const express = require('express');
const router = express.Router();
const Book = require('../models/Book')
router.get('/', async (req, res) => {
    let books = [];
    try {
        books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec();
    } catch (error) {
        console.log(error.message);
        books = [];
    }
    res.render('index', { books });
})

module.exports = router;