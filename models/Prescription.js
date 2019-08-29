const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PrescriptionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    published: { 
        type: Date, 
        default: Date.now
    }

})

module.exports = mongoose.model('prescriptions',PrescriptionSchema)