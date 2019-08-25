const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PreparationSchema = new Schema({
    prescription: {
        type: Schema.Types.ObjectId,
        ref: 'prescriptions'
    },
    name: {
        type: String,
        required: true,
    },
    howToPrepare: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        default: null
    }

})

module.exports = mongoose.model('preparations',PreparationSchema)