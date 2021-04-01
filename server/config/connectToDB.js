const mongoose = require("mongoose");

const connectToDB = {}

connectToDB.mongodb = ()=>{
    mongoose.connect("mongodb://" + process.env.DEV_ADDRESS + "/" + process.env.DEV_DBNAME, { useNewUrlParser: true, useUnifiedTopology: true }, (err, connected) => {
        if(err){
            return console.log(err);
        }
        else{
            return console.log("connected to mongodb database");
        }
    });
}
module.exports = connectToDB;