const passport = require('passport');
const { Strategy } = require('passport-local');
const debug = require('debug')('app:local.strategy');
const sql = require('mssql');

function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, done) => {
      const request = new sql.Request();
      const { recordset: [user] } = await request
        .input('username', sql.VarChar, username)
        .query('select * from users where USERNAME = @username');

      if (user && user.PASSWORD === password) {
        done(null, { username, password });
      } else {
        done(null, false);
      }
    }
  ));
}

module.exports = localStrategy;
