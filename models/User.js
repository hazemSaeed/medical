const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    image: {
        type: String,
        required: true,
        default: 'avatar.png'
    },
    isAdmin : {
        type: Boolean,
        default: false
    },
    isDoctor: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    speciality: {
        type: String,
        default: null
    },
    education: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['approved','pending','denied'],
        default: 'pending'
    },
    stateWebsite: {
        type: String,
        default: 'enable'
    },
    twitter: {
        type: String,
        default: null
    },
    facebook: {
        type: String,
        default: null
    },
    instagram: {
        type: String,
        default: null
    },
    linkedin: {
        type: String,
        default: null
    },
    skype: {
        type: String,
        default: null
    },
    attachment: {
        type: String,
        default: null
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    created: { 
        type: Date, 
        default: Date.now 
    }

})

module.exports = mongoose.model('users',UserSchema)