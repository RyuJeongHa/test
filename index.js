const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')

const config = require('./config/key')

//application/x-www-form-urlencoded을 분석
app.use(bodyParser.urlencoded({extended: true})); 

//application/json을 분석
app.use(bodyParser.json());

const {User} = require("./models/User");

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false
}).then(()=> console.log('MongoDB Connected..')).catch(err => console.log(err))




app.get('/',(req, res) => res.send('Hello World! 안녕하세요~~'))

app.post('/register', (req,res) => {
    //회원 가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어줌
    
    const user = new User(req.body)

    //save => mongodb에서 오는 메소드
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    }) 

})

app.listen(port, () => console.log('Example app listening on port!'))