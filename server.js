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


app.get('/hello',(req,res)=>{
    
    res.render('pages/index');
})

app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
})