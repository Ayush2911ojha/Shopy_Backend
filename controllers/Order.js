const { Order } = require("../models/Order.model");

exports.fetchOrdersByUser = async (req, res) => {
    const { id } = req.user;
    try {
      const orders = await Order.find({ user: id });

      res.status(200).json(orders);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.createOrder = async (req, res) => {
    const order = new Order(req.body);
    try {
      const doc = await order.save();
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.deleteOrder = async (req, res) => {
      const { id } = req.params;
      try {
      const order = await Order.findByIdAndDelete(id);
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };


  //   // filter = {"category":["smartphone","laptops"]}
//   // sort = {sort:"price",order="desc"}
//   // pagination = {page:1,per_page=10}
exports.fetchAllOrders = async (req, res) => {
  
  let query = Order.find({ deleted: {$ne:true} });
  let totalOrdersQuery = Order.find({ deleted: {$ne:true}});


  // Sorting
  // if (req.query.sort && req.query.order) {
  //   const sortQuery = {};
  //   sortQuery[req.query.sort] = req.query.order === "desc" ? -1 : 1;
  //   query = query.sort(sortQuery);
  // }

  const totalDocs = await totalOrdersQuery.countDocuments().exec();
  console.log({ totalDocs });

  // Pagination
  if (req.query.page && req.query.per_page) {
    console.log("req.query.page",req.query.page)
    const pageSize = parseInt(req.query.per_page);
    const page = parseInt(req.query.page);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count', totalDocs);
    
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
  //   try {
  //   const docs = await query.exec();

  //   // Wrap the fetched products inside a 'data' property
  //   const responseData = { data: docs };

  //   // Set the 'X-Total-Count' header with the total number of documents
  //   res.set('X-Total-Count', totalDocs);

  //   // Send the wrapped data as a JSON response
  //   res.status(200).json(responseData);
  // } catch (err) {
  //   res.status(400).json(err);
  // }
//   try {
//     const docs = await query.exec();

    
//     res.set('X-Total-Count', totalDocs);

     
//     res.append('Access-Control-Expose-Headers', 'X-Total-Count');
   
//     res.status(200).json(docs);
// } catch (err) {
//     res.status(400).json(err);
// }

};