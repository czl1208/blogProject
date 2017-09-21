var express = require('express');
var methodOverride = require('method-override');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require("body-parser");


// app configure
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extend:true}));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema(
    {
        title: String,
        image: String,
        body: String,
        created:{ type: Date, default: Date.now}
    });

var Blog = mongoose.model("Blog", blogSchema);

// ROUTES

app.get("/", function(req, res) {
   res.redirect("/blog"); 
});

app.get("/blog", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
        }else {
            res.render("index", {blogs : blogs});
        }
    });
});

app.get("/blog/new", function(req, res) {
    res.render("new");
});

app.post("/blog", function(req, res) {
   Blog.create(req.body.blog, function(err, newBlog) {
       if(err) {
           console.log(err);
       }else {
           res.redirect("/blog");
       }
   }); 
});

app.get("/blog/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, findBlog) {
        if(err) {
            console.log(err);
        }else {
            res.render("show", {blog : findBlog});
        }
    });
});

app.get("/blog/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, findBlog) {
        if(err) {
            console.log(err);
        } else {
            res.render("edit", {blog : findBlog});
        }
    });
});

app.put("/blog/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog) {
        if(err) {
            res.redirect("/blog");
        }else {
            res.redirect("/blog/" + req.params.id);
        }
    });
});

app.delete("/blog/:id", function(req, res) {
    //res.send("You have reached the Destroy Route");
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/blog");
        }else {
            res.redirect("/blog");
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog Server has Started !!!");
})