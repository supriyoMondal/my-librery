const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db/connectDB');

const app = express();

//connecting to db
connectDB();
//setting view engine to ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
//setting the default layout file for expressLayout
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));