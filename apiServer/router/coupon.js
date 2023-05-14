const express = require("express");
let coupondata = require("../database/dataCoupon");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(req.query);
  const section = req.query.section;

  const data = section ? coupondata.filter((coupon) => coupon.section === section) : coupondata;
  console.log(req.query);
  res.status(200).json(data);
});

router.get("/:id", (req, res, next) => {
  //   console.log(req.params);
  const id = req.params.id;
  const data = coupondata.find((coupon) => coupon.productid === +id);

  res.status(200).json(data);
});

module.exports = router;
