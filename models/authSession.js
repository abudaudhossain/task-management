const mongoose = require("mongoose");

const field ={
    "token":{
        type:"string",
        required:true,
    },
    "userToken": {
        type: String,
        required: true
    },
    "deviceToken": {
        type: String,
        required: true
    },
    "status":{
        type: String,
        required: true
    }
} 

const authSessionSchema = mongoose.Schema(field,{timestamps: true}) 

module.exports = mongoose.model("AuthSession", authSessionSchema);