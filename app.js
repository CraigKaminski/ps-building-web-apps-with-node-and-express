const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const adminRouter = require('./src/routes/adminRoutes');
const bookRouter = require('./src/routes/bookRoutes');

const app = express();
const config = {
  user: 'library',
  password: 'j8Z3Vge!hl',
  server: 'cstone-pslibrary.database.windows.net',
  database: 'PSLibrary',

  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};
const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' }
];
const port = process.env.PORT || 3000;

sql.connect(config).catch(err => debug(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'library', resave: true, saveUninitialized: true }));
require('./src/config/passport.js')(app);
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/fonts', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/fonts')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/admin', adminRouter(nav));
app.use('/books', bookRouter(nav));

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      nav,
      title: 'Library'
    }
  );
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
