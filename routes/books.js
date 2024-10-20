const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Create a new book (POST /books)
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve all books with pagination and filters (GET /books)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, publishedYear, genre } = req.query;

  const query = {};
  if (publishedYear) query.publishedYear = publishedYear;
  if (genre) query.genre = genre;

  try {
    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve a single book (GET /books/:id)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a book (PUT /books/:id)
router.put('/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ error: 'Book not found' });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a book (DELETE /books/:id)
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
