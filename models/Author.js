const mongoose = require('mongoose');
const Book = require('./Book');
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

authorSchema.pre('remove', function (next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err);
        } else if (books.length > 0) {
            next(new Error('This Author has books'));
        } else {
            next();
        }
    });

})

module.exports = Author = mongoose.model('Authors', authorSchema);
