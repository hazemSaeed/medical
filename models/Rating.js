const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RatingSchema = new Schema({
    prescription: {
        type: Schema.Types.ObjectId,
        ref: 'prescriptions'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    created: { 
        type: String, 
        default: Date.now()
    }

})

module.exports = mongoose.model('rating',RatingSchema)