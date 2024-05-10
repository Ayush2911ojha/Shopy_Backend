const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controllers/Product.controller');

const router = express.Router();
//  /products is already added in base path
router.post('/', createProduct)
      .get('/', fetchAllProducts)
      .get('/:id', fetchProductById)
      .put('/:id', updateProduct)

exports.router = router;