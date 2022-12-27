var express = require("express");
var router = express.Router();
const axios = require("axios");
const moment = require("moment");
const { TreeMap } = require("jstreemap");
const crypto = require("crypto");

// Configure
let appKey = "C0A94CB23929A1EB0BB76B3C9F9B1AF7";
let appSecret = "f49766fc4da94b79a8f418fee21d3fff";
let accessToken = "d21cdba483454a2c80a707580916a8efdixy";

//TODO set yours method
let timestamp = moment().format("yyyy-MM-DD HH:mm:ss.SSSZZ");
let format = "json";
let version = "1.0";
let signMethod = "md5";
let shopId = 10173853;
//TODO set your paramJson

let paramJsonCategories = JSON.stringify({ "venderId:": "10173853" });
let paramJsonProducts = JSON.stringify({ page: 1, size: 1 });

// Signature
function SignCategories(
  method,
  appKey,
  accessToken,
  timestamp,
  format,
  version,
  signMethod,
  paramJson,
  appSecret,
  venderId
) {
  // sort
  let treeMap = new TreeMap();
  treeMap.set("method", method);
  treeMap.set("app_key", appKey);
  treeMap.set("access_token", accessToken);
  treeMap.set("timestamp", timestamp);
  treeMap.set("format", format);
  treeMap.set("v", version);
  treeMap.set("venderId", venderId);
  treeMap.set("sign_method", signMethod);
  //param_json为空的时候需要写成 "{}"
  // treeMap.put("param_json", StringUtils.isEmpty(paramJson) ? "{}" : paramJson);
  if (paramJson.length == 0) {
    treeMap.set("360buy_param_json", "{}");
  } else {
    treeMap.set("360buy_param_json", paramJson);
  }
  var signInit = appSecret;
  for (let [k, v] of treeMap) {
    signInit = signInit + k + v;
  }
  signInit = signInit + appSecret;
  //sign md5
  let sign = crypto.createHash("md5").update(signInit, "utf-8").digest("hex");
  //upcase
  sign = sign.toUpperCase();

  return sign;
}

function SignProducts(
  method,
  appKey,
  accessToken,
  timestamp,
  format,
  version,
  signMethod,
  paramJson,
  appSecret
) {
  // sort
  let treeMap = new TreeMap();
  treeMap.set("method", method);
  treeMap.set("app_key", appKey);
  treeMap.set("access_token", accessToken);
  treeMap.set("timestamp", timestamp);
  treeMap.set("format", format);
  treeMap.set("v", version);
  treeMap.set("sign_method", signMethod);
  //param_json为空的时候需要写成 "{}"
  // treeMap.put("param_json", StringUtils.isEmpty(paramJson) ? "{}" : paramJson);
  if (paramJson.length == 0) {
    treeMap.set("360buy_param_json", "{}");
  } else {
    treeMap.set("360buy_param_json", paramJson);
  }
  var signInit = appSecret;
  for (let [k, v] of treeMap) {
    signInit = signInit + k + v;
  }
  signInit = signInit + appSecret;
  //sign md5
  let sign = crypto.createHash("md5").update(signInit, "utf-8").digest("hex");
  //upcase
  sign = sign.toUpperCase();

  return sign;
}

// Login
router.get("/login", function (req, res, next) {
  axios
    .get(
      "https://oauth.jd.id/oauth2/to_login?app_key=C0A94CB23929A1EB0BB76B3C9F9B1AF7&response_type=code&redirect_uri=http://localhost:3000/jdid/access-token&state=20200428&scope=snsapi_base"
    )
    .then(function (response) {
      // handle success
      res.redirect(response.config.url);
    })
    .catch(function (error) {
      // handle error
      // console.log(error);
      res.send(error);
    })
    .then(function () {
      // always executed
    });
});

router.get("/access-token", function (req, res, next) {
  axios
    .get(
      `https://oauth.jd.id/oauth2/access_token?app_key=C0A94CB23929A1EB0BB76B3C9F9B1AF7&app_secret=f49766fc4da94b79a8f418fee21d3fff&grant_type=authorization_code&code=${req.query.code}`
    )
    .then(function (response) {
      // handle success
      res.status(200).json({ message: "success", data: response });
    })
    .catch(function (error) {
      // handle error
      // console.log(error);
      console.log(error);
    })
    .then(function () {
      // always executed
    });
});

// Get Products
router.get("/get-products", function (req, res, next) {
  const method = "jingdong.seller.product.getWareInfoListByVendorId";
  const sign = SignProducts(
    method,
    appKey,
    accessToken,
    timestamp,
    format,
    version,
    signMethod,
    paramJsonProducts,
    appSecret
  );

  let openApiUrl =
    "https://open-api.jd.id/routerjson?" +
    "sign=" +
    sign +
    "&sign_method=" +
    signMethod +
    "&timestamp=" +
    encodeURIComponent(timestamp) +
    "&v=" +
    version +
    "&app_key=" +
    appKey +
    "&method=" +
    method +
    "&format=" +
    format +
    "&access_token=" +
    accessToken +
    "&360buy_param_json=" +
    encodeURIComponent(paramJsonProducts);

  axios
    .get(openApiUrl)
    .then(function (response) {
      let resData = response.data;

      res.status(200).json({ message: "success", data: resData });
    })
    .catch(function (err) {
      console.log(err);
    });
});

// Get Categories
router.get("/get-categories", function (req, res, next) {
  const method = "jingdong.seller.category.api.read.getAllCategory";
  const sign = SignCategories(
    method,
    appKey,
    accessToken,
    timestamp,
    format,
    version,
    signMethod,
    paramJsonCategories,
    appSecret,
    shopId
  );

  let openApiUrl =
    "https://open-api.jd.id/routerjson?" +
    "sign=" +
    sign +
    "&sign_method=" +
    signMethod +
    "&timestamp=" +
    encodeURIComponent(timestamp) +
    "&v=" +
    version +
    "&app_key=" +
    appKey +
    "&method=" +
    method +
    "&format=" +
    format +
    "&access_token=" +
    accessToken +
    "&venderId=" +
    shopId +
    "&360buy_param_json=" +
    encodeURIComponent(paramJsonCategories);

  axios
    .get(openApiUrl)
    .then(function (response) {
      let resData = response.data;

      res.status(200).json({ message: "success", data: resData });
    })
    .catch(function (err) {
      console.log(err);
    });
});

module.exports = router;
