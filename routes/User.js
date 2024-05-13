const express = require('express');
const { fetchUserById, updateUser } = require('../controllers/User.controller');


const router = express.Router();
//  /users is already added in base path
router.get('/own', fetchUserById)
      .put('/:id', updateUser)

exports.router = router;