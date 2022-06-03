const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { check, validationResult } = require("express-validator");
const authorization = require("../middleware/authentication");
const upload = require("../middleware/uploads");

//add property
router.post(
  "/product/insert",
  authorization.verifySeller,
  upload.single("pimage"),
  [
    check("PropertyTitle", "Enter the property title").not().isEmpty(),
    check("PropertyAddress", "Enter product address").not().isEmpty(),
    check("ProductCategory", "Choose the product category").not().isEmpty(),
    check("ProductDescription", "Enter the product description").not().isEmpty(),
    check("ProductPrice", "Enter the product price in numbers").isNumeric(),
    check("Room", "Enter the total room").isNumeric(),
    check("latitude", "Enter the correct latitude for the property location"),
    check("longitude", "Enter the correct longitude for the property location"),
    check(
      "ProductAddedBy",
      "Cannot add the product becuase we donot know who is adding the product"
    )
      .not()
      .isEmpty(),
  ],

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    if (req.file == undefined) {
      return res.status(400).json({
        message: "Invalid image format or the file is very large!!",
      });
    }

    const PropertyTitle = req.body.PropertyTitle;
    const PropertyAddress = req.body.PropertyAddress;
    const ProductImage = req.file.filename;
    const ProductDescription = req.body.ProductDescription;
    const ProductPrice = req.body.ProductPrice;
    const Room = req.body.Room;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const ProductCategory = req.body.ProductCategory;
    const ProductAddedBy = req.body.ProductAddedBy;

    const ProductData = new Product({
      PropertyTitle: PropertyTitle,
      PropertyAddress: PropertyAddress.toLowerCase(),
      ProductImage: ProductImage,
      ProductDescription: ProductDescription,
      ProductPrice: ProductPrice,
      Room: Room,
      latitude: latitude,
      longitude: longitude,
      ProductCategory: ProductCategory,
      ProductAddedBy: ProductAddedBy,
    });
    ProductData.save()
      .then(function (result) {
        res.status(201).json({ message: "Property Added!!" });
      })
      .catch(function (err) {
        res.status(400).json({ message: "Property unable to add!!" });
      });
  }
);

//All Product show
router.get("/product/showall", function (req, res) {
  Product.find()
    .sort({ createdAt: -1 })
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (error) {
      res.status(400).json({ message: error.message });
    });
});

//get product by categories
router.get("/product/category/:id", (req, res) => {
  Product.find({ ProductCategory: req.params.id })
    .sort({ createdAt: -1 })
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((err) => {
      res.json(400).json({ message: err.message });
    });
});

//All products of a seller
router.get(
  "/product/seller/showall",
  authorization.verifySeller,
  authorization.getSellerProfile,
  (req, res) => {
    const sid = req.user._id;

    Product.find({ ProductAddedBy: sid })
      .sort({ createdAt: -1 })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  }
);

//get single product
router.get("/product/single/:pid", function (req, res) {
  const pid = req.params.pid;
  Product.findById(pid)
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (error) {
      res.status(400).json({ message: error });
    });
});

//delete product
router.delete(
  "/product/delete/:pid",
  authorization.verifySeller,
  function (req, res) {
    const pid = req.params.pid;
    Product.deleteOne({ _id: pid })
      .then(function (result) {
        res.status(200).json({ message: "Product deleted!!" });
      })
      .catch(function (error) {
        res.status(400).json({ message: "Product unable to delete!!" });
      });
  }
);

//update product image
router.put(
  "/product/update/image/:pid",
  authorization.verifySeller,
  upload.single("pimage"),
  (req, res) => {
    if (req.file == undefined) {
      return res.status(400).json({
        message: "Invalid Image format or image size very large!!",
      });
    }

    const id = req.params.pid;
    const ProductImage = req.file.filename;
    Product.updateOne(
      { _id: id },
      {
        ProductImage: ProductImage,
      }
    )
      .then((result) => {
        res.status(201).json({ message: "Product Image updated Successfully" });
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  }
);

//Update property
router.put(
  "/product/update/:pid",
  authorization.verifySeller,
  [
    check("PropertyTitle", "Enter the product name").not().isEmpty(),
    check("PropertyAddress", "Enter property address").not().isEmpty(),
    check("ProductCategory", "Choose the product category").not().isEmpty(),
    check("ProductDescription", "Enter the product description").not().isEmpty(),
    check("ProductPrice", "Enter the product price in numbers").isNumeric(),
    check("Room", "Enter the Room").isNumeric(),
    check("latitude", "Enter the correct latitude for the property location"),
    check("longitude", "Enter the correct longitude for the property location"),
  ],

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
      });
    }

    const PropertyTitle = req.body.PropertyTitle;
    const PropertyAddress = req.body.PropertyAddress;
    const ProductCategory = req.body.ProductCategory;
    const ProductDescription = req.body.ProductDescription;
    const ProductPrice = req.body.ProductPrice;
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    const Room = req.body.Room;
    const id = req.params.pid;

    Product.updateOne(
      { _id: id },
      {
        Room: Room,
        ProductPrice: ProductPrice,
        ProductDescription: ProductDescription,
        latitude: latitude,
        longitude: longitude,
        ProductCategory: ProductCategory,
        PropertyTitle: PropertyTitle,
        PropertyAddress: PropertyAddress,
      }
    )

      .then(function (result) {
        res.status(201).json({ message: "Property Updated!!" });
      })
      .catch(function (error) {
        res.status(400).json({ message: "Property unable to update!!" });
      });
  }
);

//sell product
router.put("/product/sell", (req, res) => {
  Product.updateOne(
    { _id: req.body.id },
    {
      ProductSold: req.body.ProductSold,
    }
  )
    .then((response) => {
      // console.log(response);
      res.status(200).json({ message: "Product Sold" });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

//like
router.put("/product/like", authorization.verifyBuyer, (req, res) => {
  Product.findByIdAndUpdate(
    req.body.productId,
    { $push: { likes: req.body.userId } },
    { new: true }
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

//unlike
router.put("/product/unlike", authorization.verifyBuyer, (req, res) => {
  Product.findByIdAndUpdate(
    req.body.productId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

//comment
router.put("/product/comment", authorization.verifyBuyer, (req, res, next) => {
  let comment = { text: req.body.text, postedBy: req.body.userId };
  Product.findByIdAndUpdate(
    req.body.productId,
    { $push: { comments: comment } },
    { new: true }
  )
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((err) => {
      res.status(400).json({ message: err });
    });
});

//uncomment
router.put("/product/uncomment", authorization.verifyBuyer, (req, res) => {
  Product.findByIdAndUpdate(
    req.body.productId,
    { $pull: { comments: { _id: req.body.commentId } } },
    { new: true }
  )
    .then((comment) => {
      res.status(200);
      res.json(comment);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
});

//search
router.get("/product/search/:query", (req, res) => {
  var regex = new RegExp(req.params.query, "i");
  Product.find({ PropertyTitle: regex })
    .sort({ createdAt: -1 })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(400).json({ message: err.response });
      console.log(err.message);
    });
});

module.exports = router;
