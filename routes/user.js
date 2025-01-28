var express = require("express");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");
var userHelper = require("../helpers/user-helpers");
const verifyLogin = (req, res, next) => req.session.loggedIn ? next() : res.redirect("/login");

/* GET home page. */
router.get("/", function (req, res, next) {
  // var data = productHelper.viewProducts()
  // productHelper.getAllProducts((products)=>{
  //   res.render('index', { products,admin:true});
  // })

  productHelper.getAllProducts().then((products) => {
    let user = req.session.user;
    res.render("user/view-products", { products, user });
  });
});

router.get("/login", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    // res.render("user/login",{"loginErr":req.session.loginErr,"loginErrDetails":req.session.loginErrDetails});
    res.render("user/login", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
});

router.get("/signup", function (req, res) {
  res.render("user/signup");
});

router.post("/signup", function (req, res) {
  userHelper.doSignup(req.body).then((result) => {
    res.redirect("/signup");
    console.log(result);
  });
});

router.post("/login", (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.loginErr = true;
      // req.session.loginErrDetails=response.status2
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/cart", verifyLogin, (req, res) => {
  res.render("user/cart");
});
module.exports = router;
