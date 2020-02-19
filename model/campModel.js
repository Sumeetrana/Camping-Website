const mongoose = require('mongoose')

var campSchema = mongoose.Schema({
    name: String,
    imageUrl: String,
    state: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

module.exports = mongoose.model('camp', campSchema);