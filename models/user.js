const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    nickname:{
        type:String,
        maxlength: 20,
        unique:1 //똑같은 이름을 쓰지 못하도록 하는 것
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type: String,
        minlength: 5
    },
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }//토큰을 사용할 수 있는 유효기간
})

userSchema.pre('save',function(next){
    //비밀번호 암호화
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password,salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }

})


userSchema.methods.comparePassword = function(plainPassword, cb){
    //Plain Password와 암호화된 패스워드가 같은지 확인
    bcrypt.compare(plainPassword, this.password, function(err, ismatch){
        if(err) return cb(err);
            cb(null, ismatch)
    })  
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    //jsonwebtoken을 이용해 토큰 생성

    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}


userSchema.statics.findByToken = function(token, cb){
    var user = this;

   
    //토큰을 decode
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해 유저 찾고 클라이언트에서 가져온 토큰과 데베에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err,user){
            if(err) return cb(err);
            cb(null,user)
        })

    })
}

const User = mongoose.model('User',userSchema)

module.exports = {User}// 모듈을 다른 곳에서도 쓸 수 있음