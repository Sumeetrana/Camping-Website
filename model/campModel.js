const mongoose = require('mongoose')

var campSchema = mongoose.Schema({
    name: String,
    imageUrl: String,
    description: String
})

module.exports = mongoose.model('camp', campSchema);