var db = require("../config/connection");
var collection = require("../config/collections");
const { response } = require("express");
var objectId = require("mongodb").ObjectId;
module.exports = {
  addProduct: (product, callback) => {
    // console.log(product);
    db.get()
      .collection(collection.PRODUCT_COLLECTION)
      .insertOne(product)
      .then((data) => {
        callback(data.ops[0]._id);
      });
  },
  // getAllProducts: (callback)=> {
  //     var data = db.get().collection(collection.PRODUCT_COLLECTION).find().toArray().then((data)=>{
  //         // console.log(data);
  //         callback(data)
  //     })
  // }
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      var products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },

  deleteProduct: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .removeOne({ _id: objectId(proId) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  getProductDetails: (proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id: objectId(proId)}).then((response)=>{
            resolve(response)
        })
    })
  },
  updateProduct: (proId,proDetails)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION)
        .updateOne({_id:objectId(proId)},{
                $set:{
                    name:proDetails.name,
                    category:proDetails.category,
                    price:proDetails.price,
                    description:proDetails.description
                }
            }
        ).then((response)=>{
            resolve(response)
        })
    })
    
  }
};
