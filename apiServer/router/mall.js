const express = require("express");
let productdata = require("../database/dataMall");

const router = express.Router();

// * / url에 최신 게시물 3개 응답
// * /product - 블로그 글 모두 응답
// * /product?section=it - it관련된 글 모두 응답
router.get("/", (req, res, next) => {
  console.log(req.query);
  const section = req.query.section;

  const data = section ? productdata.filter((product) => product.section === section) : productdata;

  res.status(200).json(data);
});

// * /product/1 1번 게시물 상세보기
// * /product/2 2번 게시물 상세보기
router.get("/:id", (req, res, next) => {
  console.log(req.params);
  const id = req.params.id;

  const data = productdata.find((product) => product.id === +id);

  res.status(200).json(data);
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  req.body.success = "post 전송 성공";

  res.status(200).json(req.body);
});

router.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const data = productdata.find((product) => product.id === +id);

  if (data) {
    req.body.success = "put 전송 성공";
    res.status(200).json(req.body);
  } else {
    res.status(404);
  }
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;

  productdata = productdata.filter((product) => product.id != id);
  if (data) {
    req.body.success = "delete 전송 성공";
    res.status(200).json(req.body);
  } else {
    res.status(404);
  }
});

module.exports = router;
