const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')

const AppointmentSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    day: {
        type: String,
        enum: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        required: true
    },
    to: {
        type: Date
    },
    from: {
        type: Date
    },
    isHoliday: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('appointments',AppointmentSchema)