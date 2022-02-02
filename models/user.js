const mongoose = require('mongoose');

const field = {
    "token": {
        type: String,
        required: true,
    },
    "name": {
        type: String,
        required: true
    },
    "email": {
        type: String,
        required: true
    },
    "password":{
        type: String,
        required: true
    },
    "rule":{
        type: String,
        default: "employee"
    }

}