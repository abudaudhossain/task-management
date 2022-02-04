const mongoose = require('mongoose');

const field = {
    token: {
        type: String,
        required: true,
    },
    deviceToken: {
        type: String,
        required: true
    },
    userToken: {
        type: String,
        required: true
    },
    status:{  // 1.active  2. inactive(default) 
        type: String,
        default: "active"
    }
}

const authSessionSchema = mongoose.Schema(field,{timestamps: true}) 

module.exports = mongoose.model("AuthSession", authSessionSchema);