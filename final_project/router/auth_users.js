const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(
    (user) => user.username === username && user.password === password
  );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
    return res.status(400).json({ message: "Missing username or password." });
  } else if (!authenticatedUser(username, password)){
    return res.status(401).json({ message: "Incorrect username or password" });
  } else{
    const accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 3600,
    });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User logged in" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.session.authorization.username;
  const review = req.body.review;
  const isbn = req.params.isbn;
  if (!review){
    res.status(400).json({ message: "No Review"});
  } else{
    books[isbn].reviews[user] = review;
    res.status(200).json({ message: "Book review updated." });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  if (!books[isbn]){
    res.status(400).json({ message: "Not valid ISBN"});
  } else{
    delete books[isbn].reviews[user];
    res.status(200).json({ message: "Book review deleted"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
