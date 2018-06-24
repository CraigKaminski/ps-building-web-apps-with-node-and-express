const express = require('express');
const debug = require('debug')('app:admin');
const sql = require('mssql');

const adminRouter = express.Router();

function router(nav) {
  adminRouter.route('/')
    .get((req, res) => {
      res.render('adminView', {
        nav,
        title: 'Add Book'
      });
    })
    .post(async (req, res) => {
      const {
        body: {
          author,
          genre,
          read,
          title
        }
      } = req;
      debug(req.body);
      const request = new sql.Request();
      await request
        .input('author', sql.VarChar, author)
        .input('genre', sql.VarChar, genre)
        .input('read', sql.Bit, read ? 1 : 0)
        .input('title', sql.VarChar, title)
        .query('insert into books values (@title, @author, @read, @genre)');
      res.redirect('/admin');
    });

  return adminRouter;
}

module.exports = router;
