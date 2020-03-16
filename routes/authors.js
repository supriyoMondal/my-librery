const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
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
    res.redirect('authors')
    // return res.redirect(`author/${author.id}`)
})

module.exports = router;