const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')



describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', passwordHash})
    
        await user.save()
    })
    
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(n => n.username)
        expect(usernames).toContain(newUser.username)
    })
})

describe('User creation fails when', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', name: 'rootinforyou', passwordHash})
    
        await user.save()
    })



    const testTemplate = (testDescription, newUser, errorMessage) => {
        test(testDescription, async () => {
            const usersAtStart = await helper.usersInDb()

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain(errorMessage)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })
    }

    const newUsers = [
        {
            username: 'ml',
            name: 'Matti Luukkainen',
            password: 'salainen',
        },
        {
            name: 'Matti Luukkainen',
            password: 'salainen',
        },
        {
            username: 'mluss',
            name: 'Matti Luukkainen',
            password: 'sa',
        },
        {
            username: 'mluss',
            name: 'Matti Luukkainen',   
        }
    ]
    testTemplate('username is too short', newUsers[0], 'username')
    testTemplate('username is not provided', newUsers[1], '`username` is required')
    testTemplate('password is too short', newUsers[2], 'password')
    testTemplate('password is not provided', newUsers[3], 'password missing')
})


afterAll(() => {
    mongoose.connection.close()
  })