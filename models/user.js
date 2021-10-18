const mongoose = require('mongoose');
//const { string, number } = require('prop-types');

const userSchema = mongoose.Schema({
    nickname:{
        type:String,
        maxlength: 20,
        unique:1 //똑같은 이름을 쓰지 못하도록 하는 것
    },
    password:{
        type: String,
        minlength: 5
    },
    token:{
        type:String
    },
    tokenExp:{
        type:Number,
    },//토근을 사용할 수 있는 유효기간
})

const User = mongoose.model('User',userSchema)

module.exports = {User}// 모듈을 다른 곳에서도 쓸 수 있음