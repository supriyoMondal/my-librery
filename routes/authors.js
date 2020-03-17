const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const Book = require('../models/Book')
//all authors route
router.get('/', async (req, res) => {
    let searchOptions = {};
    if (req.query.name != "") {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    let authors;
    try {
        authors = await Author.find(searchOptions);
    } catch (err) {
        console.log(err.message);
        return res.render('authors/index', { authors });
    }

    res.render('authors/index', { authors, name: req.query.name });
})
//new authors route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() });
})
//create new author
router.post('/', async (req, res) => {
    let { name } = req.body;
    if (name == null || name.trim().length == 0) {
        return res.redirect('authors/new')
    };
    let author = new Author({ name });
    try {
        await author.save();
    } catch (error) {
        console.log(error.message);
        return res.render('authors/new', {
            author
        });
    }
    // res.redirect('authors')
    return res.redirect(`/authors/${author.id}`)
})
router.get('/:id', async (req, res) => {
    let author, booksByAuthor = [];
    try {
        author = await Author.findById(req.params.id);
        booksByAuthor = await Book.find({ author: author.id }).limit(3).exec();
    } catch (error) {
        console.log(error.message);
        return res.redirect('/authors');
    }
    // console.log(booksByAuthor);

    return res.render('authors/show', { author, booksByAuthor });
})
router.get('/:id/edit', async (req, res) => {
    let author = {};
    try {
        author = await Author.findById(req.params.id);
    } catch (error) {
        console.error(error.message);
        return res.redirect('/authors')
    }
    return res.render('authors/edit', { author });
})
router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        return res.redirect(`/authors/${author.id}`);
    } catch (error) {
        if (author == null) {
            return res.redirect('/');
        }
        console.log(error.message);
        return res.redirect('/authors');
    }
})
router.delete('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        return res.redirect(`/authors`);
    } catch (error) {
        console.log(error.message);

        if (author == null) {
            return res.redirect('/');
        }
        return res.redirect('/authors');
    }
})

module.exports = router;