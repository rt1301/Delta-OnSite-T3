const express               = require('express'),
      app                   = express(),
      body                  = require('body-parser'),
      mongoose              = require('mongoose'),
      Student               = require('./models/student'),
      passport              = require("passport"),
      methodOverride        = require('method-override'),
      LocalStrategy         = require("passport-local"),
      Admin                 = require("./models/admin.js");
require('dotenv').config();
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/student-record",{ useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false });
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(body.urlencoded({extended : true}));
app.set("view engine","ejs");

// Passport Config
app.use(require("express-session")({
    secret: "This is a secret message",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
// Root Route
app.get('/',(req,res)=>{
    res.redirect("/home");
});

// Student Register
app.get("/admin/register",isLoggedIn,(req,res)=>{
    res.render("register");
});
app.post("/admin/register",(req, res)=>{
    var student = req.body.student;
    Student.create(student,(err,newStudent)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect('/admin');
        }
    });
});
// Home Page
app.get("/home",(req, res)=>{
    res.render('home');
});
// Api Page
app.get("/api/students",async (req, res)=>{
    var student  = await Student.find().exec();
    res.json(student);
});
// Admin Panel
// Show Route
app.get('/admin',isLoggedIn,(req,  res)=>{
    Student.find({},(err,foundStudent)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render('admin',{student:foundStudent});
        }
    });
});
// Edit Route for Admin
app.get("/admin/:id/edit",isLoggedIn,(req,res)=>{
    Student.findById(req.params.id,function(err,foundStudent){
        if(err)
        {
            res.redirect("/admin");
        }
        else
        {
            res.render("admin_edit",{student:foundStudent});
        }
    });
});
app.put("/admin/:id",function(req, res){
    Student.findByIdAndUpdate(req.params.id,req.body.student,function(err,updatedStudent){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/admin");
        }
    });
});
// Delete Route for Admin
app.delete("/admin/:id",function(req, res){
    Student.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.redirect("/admin");
            console.log(err);
        }
        else
        {
            res.redirect("/admin");
        }
    });
});
// show login form
app.get("/admin/login",function(req, res){
    res.render("admin_login");
});
// handle login logic
app.post("/admin/login",passport.authenticate("local",
{
failureRedirect: "/admin/login",
successRedirect: "/admin"
}),function(req, res)
{
});
// LOGOUT 
app.get("/admin/logout",function(req, res)
{
    req.logout();
	res.redirect("/admin/login");
});
// Logged in middleware
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated())
		{
			return next();
        }
	res.redirect("/admin/login");	
		
}
app.listen(3000,()=>{
    console.log("Server is running");
});
