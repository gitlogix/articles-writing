const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const Article = require('./model/article');

mongoose.connect('mongodb://localhost:27017/nodekb', {useNewUrlParser: true});
const db = mongoose.connection;

//Check for error & Connect to DB
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`connected!`)
});

// Init App
const app = express();
const PORT = 4000;

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) // parse application/json

app.use(express.static(path.join(__dirname, "public")))

// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Home Route
app.get("/", (req, res) => {
    res.render("index", {
        title: "Knowledgebase",
        post: "Articles"
    });
})

//Add Article
app.get("/article/add", (req, res) => {
    res.render("add_article", {
        title: "Knowledgebase",
        post: "New Article"
    });
})

//Added Article
app.post("/article/add", (req, res) => {
    const article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.description = req.body.body;

    article.save((err) => {
        if (err){
            console.log(err)
            return;
        } else {
            res.redirect("/articles")
        }
    })
    return;
})

//Edit Article
app.get("/article/edit/:id", (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        err && console.log(err) && process.kill();
        res.render("edit_article", {
            post: "Edit Article",
            article: article
        });
    })
})

//Edited Article
app.post("/article/edit/:id", (req, res) => {
    const editedArticle = {
        title: req.body.title, 
        author: req.body.author, 
        description: req.body.body
    }
    Article.findByIdAndUpdate(req.params.id, { $set: editedArticle}, (err) => {
        err && console.log(err) && process.kill();
        res.redirect("/articles");
    })
})

app.get("/article/delete/:id", (req, res) => {
    Article.findOneAndDelete(req.params.id, (err) => {
        err && console.log(err) && process.kill();
        res.redirect("/articles");
    })
})

// Show Single Article
app.get("/article/:id", (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        err && console.log(err) && process.kill();
        res.render("article", {
            article: article
        });
    })
})

// Show Single Article
app.delete("/article/:id", (req, res) => {
    Article.findOneAndDelete(req.params.id, (err) => {
        err && console.log(err) && process.kill();
        return;
    })
})

//Show Articles
app.get("/articles", (req, res) => {
    Article.find({}, (err, articles) => {
        err && console.log(err) && process.kill();
        res.render("articles", {
            post: "All Articles",
            articles: articles
        });
    })
    
})


// Start Server
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})