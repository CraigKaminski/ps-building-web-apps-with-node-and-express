const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

function router(nav) {
  const authRouter = express.Router();

  authRouter.route('/signUp')
    .post(async (req, res) => {
      debug(req.body);
      const { username, password } = req.body;
      const request = new sql.Request();
      await request
        .input('username', sql.VarChar, username)
        .input('password', sql.VarChar, password)
        .query('insert into users values (@username, @password)');
      req.login(req.body, () => {
        res.redirect('/books');
      });
    });

  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: 'Sign In'
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/books',
      failureRedirect: '/'
    }));

  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });

  return authRouter;
}

module.exports = router;
