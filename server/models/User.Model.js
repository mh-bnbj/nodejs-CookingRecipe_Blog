const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: Number,
            required: true,
        },
        admin: {
            type: Boolean,
            required: true,
        },
    },
    {
        methods: {
            verifyPassword(password) {
                return this.password === password
            },
            verifyAdmin(admin) {
                return this.admin === admin
            },
        },
    }
)

userSchema.index({ username: 'text' })

module.exports = mongoose.model('User', userSchema, 'User')
