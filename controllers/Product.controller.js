const { Product } = require("../models/product.model");


exports.createProduct = async (req, res) => {
  // this product we have to get from API body
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};


//   // filter = {"category":["smartphone","laptops"]}
//   // sort = {sort:"price",order="desc"}
//   // pagination = {page:1,per_page=10}
exports.fetchAllProducts = async (req, res) => {
  let query = Product.find({ deleted: {$ne:true} });
  let totalProductsQuery = Product.find({});

  if (req.query.category) {
    query = query.find({ category: { $in: req.query.category.split(",") } });
    totalProductsQuery = totalProductsQuery.find({ category: { $in: req.query.category.split(",") } });
  }
  if (req.query.brand) {
    query = query.find({ brand: { $in: req.query.brand.split(",") } });
    totalProductsQuery = totalProductsQuery.find({ brand: { $in: req.query.brand.split(",") } });
  }

  // Sorting
  if (req.query.sort && req.query.order) {
    const sortQuery = {};
    sortQuery[req.query.sort] = req.query.order === "desc" ? -1 : 1;
    query = query.sort(sortQuery);
  }

  const totalDocs = await totalProductsQuery.countDocuments().exec();
  console.log({ totalDocs });

  // Pagination
  if (req.query.page && req.query.per_page) {
    console.log("req.query.page",req.query.page)
    const pageSize = parseInt(req.query.per_page);
    const page = parseInt(req.query.page);
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  // try {
  //   const docs = await query.exec();
  //   res.set('X-Total-Count', totalDocs);
    
  //   res.status(200).json(docs);
  // } catch (err) {
  //   res.status(400).json(err);
  // }
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
  try {
    const docs = await query.exec();

    // Set the 'X-Total-Count' header with the total number of documents
    res.set('X-Total-Count', totalDocs);

     // Expose the 'X-Total-Count' header to the client-side code
    res.append('Access-Control-Expose-Headers', 'X-Total-Count');
    // Wrap the fetched products inside a 'data' property
    const responseData = { data: docs };

    // Send the wrapped data as a JSON response
    res.status(200).json(responseData);
} catch (err) {
    res.status(400).json(err);
}

};


exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};