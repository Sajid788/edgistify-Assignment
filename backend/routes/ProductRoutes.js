const express = require("express");

const productRouter  = express.Router();
const { getProducts} = require('../controller/ProductController');

productRouter.get('/', getProducts);


module.exports = { productRouter };