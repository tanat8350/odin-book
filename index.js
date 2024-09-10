const express = require('express');
const cookieParser = require('cookie-parser');

const cloudinary = require('./configs/cloudinary');

const app = express();

app.use(require('cors')());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

require('./configs/passport');

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/post', require('./routes/post'));
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(3000);
