const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');
// const multer = require('multer');
const path = require('path');
const uploadPath = path.join('public', Book.coverImageBasePath);
const fs = require('fs');

const imageMineType = ['image/jpeg', 'image/png', 'image/gif']
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMineType.includes(file.mimetype))
//     }
// })
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
// upload.single('cover'),
router.post('/', async (req, res) => {
    // const fileName = req.file != null ? req.file.filename : null;
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
        publishDate: new Date(req.body.publishDate)
    });
    saveCover(newBook, req.body.cover);
    let book;
    try {
        book = await newBook.save();
        return res.redirect(`/book/${newBook.id}`);
    } catch (error) {
        console.log(error.message);

        return renderNewPage(res, newBook, true);
    }

});
//show book route
router.get("/:id", async (req, res) => {
    let book = {};
    try {
        book = await Book.findById(req.params.id).populate('author').exec();
        return res.render('book/show', { book });
    } catch (error) {
        console.log(error.message);
        return res.redirect('/book');
    }
})
//edit page view
router.get('/:id/edit', async (req, res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
    } catch (error) {
        console.log(error.message);
        return res.redirect('/book');
    }
    renderEditPage(res, book);
})
router.put('/:id/edit', async (req, res) => {
    let book;

    try {
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;
        book.publishDate = new Date(req.body.publishDate);

        if (req.body.cover != null && req.body.cover != '') {
            saveCover(book, req.body.cover);
        }
        await book.save();
        return res.redirect(`/book/${book.id}`);
    } catch (error) {
        console.log(error.message);
        if (book != null) {
            return renderEditPage(res, book, true);
        }
        return res.redirect('/');
    }
})

router.delete('/:id', async (req, res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        await book.remove();
        return res.redirect('/book');
    } catch (error) {
        console.log(error);
        if (book != null) {
            return res.render('book/edit', { book, errorMessage: "Could Not Remove Book" })
        }
        return res.redirect(`/book`)
    }
})

// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) {
//             console.error(err);
//         }
//     });
// }
async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new');
}
async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit');
}


async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors, book
        }
        if (hasError) {
            params.errorMessage = form == 'new' ? 'Error Creating Book' : 'Error Editing Book';
        }
        return res.render(`book/${form}`, params)
    } catch (error) {
        console.log(error.message);
        return res.redirect('/book')
    }
}

// Render edit Page

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    // console.log(cover.type);

    if (cover != null && imageMineType.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
}

module.exports = router;