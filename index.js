import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/User.js";

const app = express();
const port = 3000;


// application/x-www-form-urlencoded 데이터를 분석해서 가지고 올 수 있게 해 줌
app.use(bodyParser.urlencoded({extended: true}));
// application/json 데이터를 분석해서 가지고 올 수 있게 해 줌
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));



app.get('/', (req, res) => {
  res.send('Hello World!!')
});

app.post('/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});