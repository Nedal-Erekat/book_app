"use strict";
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');

const app = express();
const pg = require('pg');//Database

const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL)

 //serve CSS file
app.use(express.static('./public/styles')); 

// modulwear to be able to send our data in a secure way by useing "post" request
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Set the view engine so can use EJS templet
app.set('view engine','ejs');            

app.get('/',loadBooks);
function loadBooks(req,res) {
    let SQL = `SELECT * FROM books;`;
    client.query(SQL)
    .then(data=>{

        res.render('pages/index',{selectedBooks: data.rows})
    })
    
}

    

app.get('/searches/new',(req,res)=>{
    
    res.render('pages/searches/new');
})
app.get('/searches',(req,res)=>{     //if I used the post handler I have to change "query" to "body"
    let field=req.query.tit;         // "query" appeare in the main link but "body" will be hide(more secure)
    let searchNam=req.query.name;

    let q='';
    if(field==='title'){
         q=`${searchNam}+intitle`;
    }else {
         q=`${searchNam}+inauthor`;
    }
    let url=`https://www.googleapis.com/books/v1/volumes?q=${q}`;
    superagent.get(url)
    .then(data=>{
        let creatBooks=data.body.items.map(ele=>{
            let newBook=new Book(ele);
            return newBook;
        });
        res.render('pages/searches/show',{booksData: creatBooks});    
    })
    .catch (error => errorHandler(error));


})
function Book(obj) {
    this.title=obj.volumeInfo.title;
    this.img=obj.volumeInfo.imageLinks.thumbnail;
    this.author=obj.volumeInfo.authors;
    this.description=obj.volumeInfo.description;
}
app.get('/hello',(req,res)=>{
    
    res.render('pages/index');
});
app.get('*',(req,res)=>{
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