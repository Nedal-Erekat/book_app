"use strict";
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');

const app = express();
const pg = require('pg');//Database
const methodOverride = require('method-override');//to use 'put'&'delete'


const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL)

//serve CSS file
app.use(express.static('./public/styles'));
app.use(express.static('./public/js'));
app.use(methodOverride('_method'));

// modulwear to be able to send our data in a secure way by useing "post" request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the view engine so can use EJS templet
app.set('view engine', 'ejs');

app.get('/', loadBooks);
app.get('/searches/new',getBooks);
app.get('/searches',getSearchedBooks);
app.get('/books/:id', showBook);
app.put('/books/:id', EditBook);
app.delete('/books/:id', deleteBook);

app.post('/books', displayDetails)


function loadBooks(req, res) {
    let SQL = `SELECT * FROM books;`;
    client.query(SQL)
        .then(data => {
            console.log();
            res.render('pages/index', { selectedBooks: data.rows })
        })

}

function showBook(req, res) {
    let SQL = `SELECT * FROM books WHERE id=${req.params.id};`
    client.query(SQL)
        .then(data => {
            // console.log(data.rows);
            res.render('pages/books/show', { selectedBooks: data.rows });
        });
}
function displayDetails(req, res) {
    // console.log(req.body.isbn);
    let SQL = `INSERT INTO books (author,title,isbn,image_url,description,bookshelf) VALUES ($1,$2,$3,$4,$5,$6);`
    let safeValues = [req.body.author, req.body.title,req.body.isbn, req.body.image_url, req.body.description, req.body.bookshelf];
    // console.log(safeValues);
    client.query(SQL, safeValues)
    .then(() => {
        let sql = `SELECT * FROM books WHERE isbn='${req.body.isbn}';`;
        client.query(sql)
        .then((result) => {
            // console.log('here>>>>>>>>>>');
            // console.log(result.rows[0].id);
                    res.redirect(`/books/${result.rows[0].id}`);
                });

        })
}


function getBooks(req,res) {
    
    res.render('pages/searches/new');
}


function getSearchedBooks(req,res) {    //if I used the post handler I have to change "query" to "body"
    let field = req.query.tit;         // "query" appeare in the main link but "body" will be hide(more secure)
    let searchNam = req.query.name;
    
    let q = '';
    if (field === 'title') {
        q = `${searchNam}+intitle`;
    } else {
        q = `${searchNam}+inauthor`;
    }
    let url = `https://www.googleapis.com/books/v1/volumes?q=${q}`;
    superagent.get(url)
        .then(data => {
            // console.log(data.body.items[0].id);
            let creatBooks = data.body.items.map(ele => {
                let newBook = new Book(ele);
                return newBook;
            });
            // console.log(creatBooks[0]);
            // console.log('>>>>>>>>>. inConstructor');
            res.render('pages/searches/show', { booksData: creatBooks });
        })
        .catch(error => errorHandler(error));
}
function EditBook(req,res) {
    // let {author,title,isbn,image_url,description,bookshelf} = req.body;

    let SQL=`UPDATE books SET author=$1,title=$2,isbn=$3,image_url=$4,description=$5,bookshelf=$6 WHERE id=$7; `
    let values=[req.body.author,req.body.title,req.body.isbn,req.body.image_url,req.body.description,req.body.bookshelf,req.params.id];
    // console.log(values);
    client.query(SQL,values)
    .then(()=>{
        res.redirect(`/books/${req.params.id}`);
    })

}
function deleteBook(req,res) {
    let SQL=`DELETE FROM books WHERE id=$1;`
    let val=[req.params.id];
    client.query(SQL,val)
    .then(()=>{
        res.redirect('/');
    })
}


function Book(obj) {
    this.title = obj.volumeInfo.title;//? newValue : defult;
    this.isbn=obj.id;
    this.image_url = obj.volumeInfo.imageLinks.thumbnail;
    this.author = obj.volumeInfo.authors;
    this.description = obj.volumeInfo.description;
}
app.get('/hello', (req, res) => {

    res.render('pages/index');
});
app.get('*', (req, res) => {
    res.send('Not found')
})

function errorHandler(error, request, response) {
    response.status(500).render('pages/error');
}

// To connect the client 
client.connect()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`listening on ${PORT}`)
        );
    })