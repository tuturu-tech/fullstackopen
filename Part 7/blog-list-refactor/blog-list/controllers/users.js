const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
    response.json(users)
})

usersRouter.get('/:id', async (request, response, next) => {
        const user = await User.findById(request.params.id)
        response.json(user)

})

usersRouter.post('/', async (request, response, next) => {
    const body = request.body

    if(!body.password || body.password.length < 3){
        return response.status(400).json({ error: 'password missing or not at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name || "anonymous user",
        passwordHash,
    })

        const savedUser = await user.save()
        response.json(savedUser)
})

module.exports = usersRouter