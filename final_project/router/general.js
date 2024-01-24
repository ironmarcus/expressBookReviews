const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const userExist = (username) => {
  return users.some((user) => user.username === username);
};


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
    return res.status(404).json({message: "Missing username or password."});
  } else if (userExist(username)){
    return res.status(404).json({message: "User exists"});
  } else{
    users.push({ username: username, password: password});
    return res.status(200).json({message: "New user registered."});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const book = books[isbn];
  return res.status(200).json({ isbn: book });
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const matchBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  return res.status(200).send(JSON.stringify(matchBooks,null,4))
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const matchtitle = Object.values(books).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
  );
  return res.status(200).send(JSON.stringify(matchtitle,null,4))
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const book = books[isbn];
  return res.status(200).send(JSON.stringify(book.reviews,null,4))
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
