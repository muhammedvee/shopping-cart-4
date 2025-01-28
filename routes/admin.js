var express = require("express");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");

router.get("/", function (req, res, next) {
  productHelper.getAllProducts().then((products) => {
    res.render("admin/view-products", { products, admin: true });
  });
});

router.get("/add-product", function (req, res, next) {
  res.render("admin/add-product");
});

router.post("/add-product", function (req, res) {
  productHelper.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv("./public/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        res.render("admin/add-product");
      } else {
        console.log("Error in uploading image: " + err);
      }
    });
    // console.log(id);
  });
});

router.get("/delete-product", (req, res) => {
  // router.get('/delete-product/:id',(req,res)=>{
  // var proId = req.params.id

  var proId = req.query.id;
  // console.log('product id: ' + proId);
  productHelper.deleteProduct(proId).then((result) => {
    console.log(result);
    res.redirect("/admin");
  });
});

router.get("/edit-product", (req, res) => {
  var proId = req.query.id;
  productHelper.getProductDetails(proId).then((product) => {
    res.render("admin/edit-product", { product });
  });
});

router.post("/edit-product", (req, res) => {
  var proId = req.query.id;
  var proNewDetails = req.body;
  console.log(proId, proNewDetails);
  productHelper.updateProduct(proId, proNewDetails).then((response) => {
    // console.log(response);
    res.redirect("/admin");
    if (req.files.image) {
      let image = req.files.image;
      image.mv("./public/product-images/" + proId + ".jpg");
    }
  });
});
module.exports = router;