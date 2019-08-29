const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReservationSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    dateFrom: {
        type: String,
        required: true
    },
    dateTo: {
        type: String,
        required: true
    },
    subject: {
        type: String
    },
    message: {
        type: String
    },
    opened: {
        type: Boolean,
        default: false 
    },
    created: { 
        type: Date, 
        default: Date.now
    }

})

module.exports = mongoose.model('reservations',ReservationSchema)