const axios = require('axios');
const debug = require('debug')('app:goodreadsService');
const xml2js = require('xml2js');

const parser = xml2js.Parser({ explicitArray: false });

function goodreadsService() {
  function getBookById(id) {
    return new Promise((resolve, reject) => {
      axios.get(`https://www.goodreads.com/book/show/${id}.xml?key=HnxUc9JGrcXoKvhO6oI0w`)
        .then((response) => {
          parser.parseString(response.data, (error, result) => {
            if (error) {
              debug(error);
            } else {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((error) => {
          reject(error);
          debug(error);
        });
    });
  }

  return { getBookById };
}

module.exports = goodreadsService();
