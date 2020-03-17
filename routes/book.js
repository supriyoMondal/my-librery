const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');
const multer = require('multer');
const path = require('path');
const uploadPath = path.join('public', Book.coverImageBasePath);
const fs = require('fs');

const imageMineType = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMineType.includes(file.mimetype))
    }
})
//all Book route
router.get('/', async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter);
    }
    let books;
    try {
        books = await query.exec();
    } catch (error) {
        return res.redirect('/');
    }

    res.render('book/index', {
        books, searchParams: req.query
    })
})
//new Book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
})
//create new Book
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    // const { title, author,
    //     publishDate, pageCount,
    //     description } = req.body;
    // if (title == null || author == null || publishDate == null || pageCount == null || fileName == null || description == null) {
    //     console.log('error sending data')
    //     return renderNewPage(res, new Book(), true);
    // }
    const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        pageCount: req.body.pageCount,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        coverImageName: fileName
    });
    let book;
    try {
        book = await newBook.save();
        //   return res.redirect(`/book/${newBook.id}`);
        return res.redirect('book');
    } catch (error) {
        if (newBook.coverImageName != null) {
            removeBookCover(newBook.coverImageName);
        }
        return renderNewPage(res, newBook, true);
    }

});

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) {
            console.error(err);
        }
    });
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors, book
        }
        if (hasError) params.errorMessage = 'Error Creating Book';
        return res.render('book/new', params)
    } catch (error) {
        console.log(error.message);
        return res.redirect('/book')
    }
}

module.exports = router;