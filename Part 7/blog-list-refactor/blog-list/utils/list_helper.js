var _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}
const favoriteBlog = (blogs) => {
    const maximum = Math.max.apply(Math, blogs.map((blog) => blog.likes))
    return blogs.find(element => element.likes === maximum)
}

const mostBlogs = (blogs) => {
    const obj = _.countBy(blogs, (rec) => {
        return rec.author
    })
    const mbAuthor = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b)
    const result = {
        author: mbAuthor,
        blogs: obj[mbAuthor]
    }
    
    return result
}

const mostLikes = (blogs) => {
    
    let obj = blogs.map(ele => ele.author)
    let uniqAuthors = _.uniq(obj)
    let addedLikes = []

    uniqAuthors.forEach( author => {
        let likes = 0
        let totalLikes = 0
        
        blogs.forEach( blog => {
            totalLikes += blog.likes
            if(author === blog.author)
            likes += blog.likes
        })
        
        addedLikes.push({author: author, likes:likes})
    })
    return favoriteBlog(addedLikes)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}