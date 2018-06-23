const express = require('express');

function router(nav) {
  const bookRouter = express.Router();

  const books = [
    {
      title: 'War and Peace',
      genre: 'Historical Fiction',
      author: 'Lev Nikolayevich Tolstoy',
      read: false
    },
    {
      title: 'Les Miseables',
      genre: 'Historical Fiction',
      author: 'Victor Hugo',
      read: false
    }
  ];

  bookRouter.route('/')
    .get((req, res) => {
      res.render(
        'bookListView',
        {
          books,
          nav,
          title: 'Books'
        }
      );
    });

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;

      res.render(
        'bookView',
        {
          book: books[id],
          nav,
          title: books[id].title
        }
      );
    });

  return bookRouter;
}

module.exports = router;
