import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/User.js";
import auth from "./middleware/auth.js";

const app = express();
const port = 5000;

app.use(
  cors({
      origin: `http://localhost:3000`, // 허락하고자 하는 요청 주소
      credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
  })
);

// application/x-www-form-urlencoded 데이터를 분석해서 가지고 올 수 있게 해 줌
app.use(bodyParser.urlencoded({extended: true}));
// application/json 데이터를 분석해서 가지고 올 수 있게 해 줌
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));



app.get('/', (req, res) => {
  res.send('Hello World!!')
});

app.get('/api/hello', (req, res) => {
  res.send("안녕하세요~");
});

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if(!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }

    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
        });
      }

      userInfo.generateToken((err, userInfo) => {
        if(err) return res.status(400).send(err);
        
        res.cookie("x_auth", userInfo.token)
          .status(200)
          .json({ loginSuccess: true, userId: userInfo._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "" },
    (err, user) => {
      if(err) return res.json({ success: false, err });
      return res.status(200).send({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});