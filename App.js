const routes = require('./Router/Route');
const handlebars = require('express-handlebars');
const express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const middlewares = require('./middlewares/middlewares');
const app = express();

/* Setup do Express 
const path = require('path');
app.use(express.static(path.join(__dirname, 'public'))); //arquivos acessáveis pelo navegador
app.use(session({secret:'segredo', cookie:{maxAge: 60000}}));
//app.use(cookieParser());
*/

app.engine('handlebars', handlebars.engine(defaultLayout='main'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middlewares.logRegister, middlewares.sessionControl)
app.use(routes);

app.listen(8081, function () {
  console.log("Servidor no http://localhost:8081");
});