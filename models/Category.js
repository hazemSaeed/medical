const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    category: {
        type: String,
        unique: true,
        required: true,
    },
    created: { 
        type: String, 
        default: moment(Date.now()).format('DD/MM/YYYY')
    }

})

module.exports = mongoose.model('categories',CategorySchema)