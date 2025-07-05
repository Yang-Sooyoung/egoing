const express = require("express");
const app = express();
const port = 3010;
const fs = require('fs');
const bodyParser = require("body-parser");
const compression = require("compression");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var db = require('./lib/db');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  })
);

var passport = require('./lib/passport')(app);

app.get("*", (request, response, next) => {
  request.list = db.get("topics").value();
  next();
});

const indexRouter = require("./routes/index");
const topicRouter = require("./routes/topic");
const authRouter = require("./routes/auth")(passport);

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry cant find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});