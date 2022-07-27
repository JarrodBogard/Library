const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book"); // "../" references to go back a directory

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { // render requires "authors" vs redirect "/authors"
      authors: authors,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/");
  }
});

// New Authors Route // this route must be above "/:id" route so the server doesn't confuse or miss "/new" route on request
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Create Authors Route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`/authors/${newAuthor.id}`);
    // res.redirect(`authors`);
  } catch {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating author",
    });
  }
});

// Get a single user
router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(8).exec();
    res.render("authors/show", { // "authors" vs "/authors"
      author: author,
      booksByAuthor: books,
    });
  } catch (err) { // don't use optional (err) parameter in production
    // console.log(err);
    res.redirect("/");
  }
});

// Edit a user
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  let author; // defined outside try block so that it has access to both try & catch blocks
  try {
    // could fail twice - trying to findById or on save()
    author = await Author.findById(req.params.id);
    author.name = req.body.name; // allows name change on edit page to be saved
    await author.save();
    res.redirect(`/authors/${author.id}`); // "/authors" to reference root
    // res.redirect(`authors`);
  } catch {
    if (author == null) {
      // if unable to findById
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        // if unable to update user
        author: author,
        errorMessage: "Error updating author",
      });
    }
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove(); // deletes author from database
    res.redirect("/authors"); // requires "/authors" for redirect vs "authors" for render
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
