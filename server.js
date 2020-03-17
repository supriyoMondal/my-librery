const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const methodOverride = require('method-override');
const connectDB = require('./db/connectDB');

const app = express();

//connecting to db
connectDB();
//setting view engine to ejs
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: false }))
//setting the default layout file for expressLayout
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "public")));

app.use('/authors', require('./routes/authors'))
app.use('/book', require('./routes/book'))
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));