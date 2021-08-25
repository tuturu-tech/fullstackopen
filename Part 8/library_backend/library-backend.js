require('dotenv').config()
const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebToken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const DataLoader = require('dataloader')
const book = require('./models/book')

const JWT_SECRET = process.env.SECRET

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error.message)
  })

mongoose.set('debug', true);

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }
  
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Subscription {
    bookAdded: Book!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String]
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Query {
    bookCount(author: String): Int!
    authorCount: Int!
    allBooks(author: String, genre: String ): [Book!]!
    allAuthors: [Author!]!
    getAuthor(objectId: String!): Author!
    me: User
    favoriteBooks(genre: String): [Book!]!
    allGenres: [String!]!
  }
`

const resolvers = {
  Author: {
    bookCount: async (root, args, context) => {
      /*const booksByAuthor = await Book.find({ author: root._id})
      return booksByAuthor.length*/
      return context.bookCountLoader.load(root._id)

    }
  },
  
  Query: {
    getAuthor: async (root, args) => {
      const thisAuthor = await Author.find({ id: args.objectId })
      return thisAuthor
    },
    bookCount: async (root, args) => {
      if (!args.author) {
        return Book.collection.countDocuments()
      }

      const booksByAuthor = await Book.find({ author: root._id})
      return booksByAuthor.length
    },
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filtered = await Book.find({}).populate('author')

      if (!args.author && (!args.genre || args.genre == '')) {
        return filtered
      }

      if (args.author){
        filtered = filtered.filter(book => args.author === book.author.name)
      }
      
      if (args.genre){
        filtered = filtered.filter(book => args.genre === book.genres.find(el => el === args.genre))
      }

      return filtered
    },
    allAuthors: () => {
      console.log("Author.find")
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    },
    favoriteBooks: async (root, args, context) => {
      let filtered = await Book.find({}).populate('author')
      const user = context.currentUser

      filtered = filtered.filter(book => user.favoriteGenre === book.genres.find(el => el === user.favoriteGenre))

      return filtered
    },
    allGenres: async () => {
      const books = await Book.find({})
      const genres = books.map(book => book.genres)
      const flatArr = genres.flat()
      const uniqueGenres = flatArr.filter((v, i, a) => a.indexOf(v) === i)

      return uniqueGenres
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      let foundAuthor = await Author.findOne({ name: args.author })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      if (!foundAuthor){
        foundAuthor = new Author({ name: args.author })
        foundAuthor.save()
      }
      
      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: foundAuthor
      })

      try {
        await book.save()
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book})

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      
      const author = await Author.findOne({ name: args.name })

      if (!author) {
        throw new UserInputError("that author doesn't exist")
      }
      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre})

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET)}
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
}

const batchBookCount = async (keys) => { 
  const authorMap = {}
  const books = await Book.find({ author: {
    $in: keys,
  }})

  keys.forEach(key => {
    authorMap[key] = books.filter(book => book.author.toString() === key.toString()).length
  })
  
  return keys.map(key => authorMap[key])
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { 
        currentUser,
        bookCountLoader: new DataLoader(keys => batchBookCount(keys))
      }
    }
    return {
      bookCountLoader: new DataLoader(keys => batchBookCount(keys))
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})