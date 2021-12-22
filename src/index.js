let express = require('express');
let bodyParser = require('body-parser');
let multer = require('module');
let mongoose = require('mongoose');

let route = require('./routes/route')

let app = express ()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer().any())

mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/Group-15DataBase?retryWrites=true&w=majority")
.then(() => console.log('mongodb running....'))
.catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express is running on PORT ' + (process.env.PORT || 3000))
})
