const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.route('/')
    .get(async (req, res) => {
      const request = new sql.Request();
      const { recordset: books } = await request.query('select * from books');
      debug(books);

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
    .all(async (req, res, next) => {
      const { id } = req.params;
      const request = new sql.Request();
      const { recordset: books } = await request
        .input('id', sql.Int, id)
        .query('select * from books where ID = @id');
      debug(books);
      [req.book] = books;
      next();
    })
    .get(async (req, res) => {
      const { book } = req;
      res.render(
        'bookView',
        {
          book,
          nav,
          title: book.TITLE
        }
      );
    });

  return bookRouter;
}

module.exports = router;
