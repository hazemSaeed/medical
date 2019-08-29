const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ContactSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    created: { 
        type: String, 
        default: Date.now
    }

})

module.exports = mongoose.model('contacts',ContactSchema)