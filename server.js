"use strict";
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT;

app.use(express.static('./public/styles'));


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render('pages/index')
})
app.get('/searches/new',(req,res)=>{
    
    res.render('pages/searches/new');
})
app.get('/searches',(req,res)=>{
    let field=req.query.tit;
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
        // console.log(data.body.items);
        let creatBooks=data.body.items.map(ele=>{
            let newBook=new Book(ele);
            return newBook;
        });
        // res.json(data.body.items);
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

app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
})