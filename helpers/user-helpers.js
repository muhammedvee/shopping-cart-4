const collections = require("../config/collections");
var bcrypt = require("bcrypt");
var db = require("../config/connection");
module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      db.get().collection(collections.USER_COLLECTION).insertOne(userData);
      resolve(userData);
    });
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      var user = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        // var status = await bcrypt.compare(data.password,user.password)
        // if (status){
        //     console.log('login success');
        //     resolve(true)
        // }else{
        //     console.log('login failed')
        // }

        // await bcrypt.compare(data.password,user.password).then((status)=>{
        //     if (status){
        //             console.log('login success');
        //             resolve(true)
        //         }else{
        //             console.log('login failed')
        //         }

        // })
        // await bcrypt.compare(data.password,user.password,(err,result)=>{
        //     if(!err){
        //         console.log('success');
        //         resolve(true)
        //     }
        // })
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            console.log("login success");
            response.user = user
            response.status = true
            resolve(response)
          } else{
            console.log('login failed');
            resolve({status:false})
            // response.status2='Invalid password'
            // resolve(response)
          }
        });
      } else {
        console.log("user doesnot exist");
        resolve({status:false})
        // response.status2='user does not exist'
        // resolve(response)
      }
    });
  },
};
