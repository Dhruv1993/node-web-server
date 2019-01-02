var express = require('express');
var fs = require('fs');
// tp create an express app , all we have to do is to call the express method
var hbs = require('hbs');
var app = express();
const port = process.env.PORT || 3000;
//partials are the templates that are frequently used in any dynamic webpages
hbs.registerPartials(__dirname + '/views/partials');

// set a helper which is a function used inside of a templating engine again and again. Here it the current year
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('capitalLetters', (txt) => {
    return txt.toUpperCase();
});
// setting the templating engine
app.set('view engine', 'hbs');


// custom middleware
app.use((req, res, next) => {

    var now = new Date().toString();
    var log = `${now} : ${req.method} : ${req.url}`;
    console.log(log);

    fs.appendFile('serverNotes.log', log + '\n', (err) => {
        if (err) {
            console.log(err);
        }
    });
    // next is to to tell your express that the middleware function is done and is imp.!! If you wont write it,
    // the web page keeps loading and nevr finishes i.e tht handlers are never going to fire.(app.get)
    next();
});

// another piece of middleware to call a script in case we are in the the maintaincnce of a website, it will stop the execution 
// of every other script because it doenst have next();
        // app.use((req, res, next) => {
        //     res.render('maintainance.hbs', {
        //         welcomeMessage: 'We"ll be right back'
        //     })
        // });

// __dirname stores absolute path of the root folder, so we just concatinate the public directory where html page is stored
// it is valid for each and every redirect for html or other pages 
// this sis an example of a middleware where we have to wite app.use
app.use(express.static(__dirname + '/public'));

// handler for http get request routes, first argument is the root of the directory , second is the request and response
app.get('/', (req, res) => {
    // res.send('<h2>Hello Express!!</h2>');
    // res.send('Hi Express!!');
    res.render('home.hbs', {
        welcomeMessage: "Welcome to my website",
        pageTitle: 'Home Page'
    });
});

app.get('/about', (req, res) => {
    // res.send('<h2>Hello Express!!</h2>');
    // res.send({
    //     About:'About Page',
    //     name: 'Andy',
    //     age: 12,
    //     arry: [
    //         {fam: 'me',
    //     lavu: 'lavnya'},
    //         {papa: 'Naren',
    //     simmi: 'Sim'}
    //     ]
    // });
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

// bind the application and listen to incoming requests on a specified port
app.listen(port, () => {
    console.log('server is up and running on port: ', port);
});

