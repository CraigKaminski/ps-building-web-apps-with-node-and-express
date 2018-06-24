const sql = require('mssql');

function bookController(bookService, nav) {
  async function getIndex(req, res) {
    const request = new sql.Request();
    const { recordset: books } = await request.query('select * from books');

    res.render(
      'bookListView',
      {
        books,
        nav,
        title: 'Books'
      }
    );
  }

  async function getById(req, res) {
    const { id } = req.params;
    const request = new sql.Request();
    const { recordset: [book] } = await request
      .input('id', sql.Int, id)
      .query('select * from books where ID = @id');

    book.details = await bookService.getBookById(book.BOOK_ID);

    res.render(
      'bookView',
      {
        book,
        nav,
        title: book.TITLE
      }
    );
  }

  return {
    getIndex,
    getById
  };
}

module.exports = bookController;
