const { User } = require("../models/User");

let auth = (req,res, next) => {
    //인증 처리를 하는 곳

    //client 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;

    //토큰을 보호화 한 후 유저를 찾음
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true})

        req.token = token;
        req.user = user;
        next();
    })
}

module.exports = {auth};