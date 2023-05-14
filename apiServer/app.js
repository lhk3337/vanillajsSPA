// npm init --yes
// npm i express cors helmet morgan
// npm i nodemon --save-dev
// -> nodemon app1 으로 실행 가능

const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // 디버깅
const mallRouter = require("./router/mall.js");
const couponRouter = require("./router/coupon.js");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// load assets
app.use("/asset", express.static(path.resolve(__dirname, "asset")));

app.use("/mall", mallRouter);
app.use("/coupon", couponRouter);

app.get("/", (req, res) => {
  res.send("hello world");
  // res.render('test1.html', {
  //     name : "hojun!",
  //     age : 10
  // });
});

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.log("애러났음!");
  console.log(err);
  res.sendStatus(500);
});
const PORT = 8080;
app.listen(process.env.PORT || PORT, () => console.log(`Server running. Port is ${PORT}`));
