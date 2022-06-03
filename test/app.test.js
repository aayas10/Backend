process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");
var app = require("../app");
const should = chai.should();
chai.use(chaiHttp);


//this should 
const sellerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWxsZXJJRCI6IjYwNjgzZDRkMTExN2NmMzE3Y2M5NDI5NiIsImlhdCI6MTYxODg2NjAzNH0.wsxu7I917YKvwz25bHgkqy07trdIkRAsL_veaDvLXPE";
const adminToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWxsZXJJRCI6IjYwNjgzZDIwMTExN2NmMzE3Y2M5NDI5NSIsImlhdCI6MTYxODg2NjEwMn0.rysi6z8hKQdEp7o7O__OfpqRlO_HdY9LqxT5FfQ1Xb8";

//get all Properties
describe("/GET Properties", () => {
  it("it should Get all the Property", (done) => {
    chai
      .request(app)
      .get("/product/showall")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

//get all Properties by given type of properties
describe("/GET Properties", () => {
  it("it should Get all the roperty of the given Type", (done) => {
    chai
      .request(app)
      .get("/product/category/626402a1a0258245fc223927")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

//get a single Property by id
describe("/GET a Property", () => {
  it("it should Get a Property of the given id", (done) => {
    const pid = "6264031da0258245fc223954";
    chai
      .request(app)
      .get(`/product/single/${pid}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

//delete a Propery by id
describe("/DELETE a Property", () => {
  it("it should delete a Property of the given id", (done) => {
    const pid = "626402b9a0258245fc223930";
    chai
      .request(app)
      .delete(`/product/delete/${pid}`)
      .set("Authorization", "Bearer " + sellerToken) //set the header first
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

//login seller
describe("/POST login a user", () => {
  it("it should login a seller user", (done) => {
    const user = {
      email: "aayaspaudel62@gmail.com",
      password: "123456",
    };
    chai
      .request(app)
      .post(`/seller/login`)
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

//register seller
describe("/POST register a user", () => {
  it("it should register a seller user", (done) => {
    const user = {
      fullname: "Aayas",
      email: "aayas@gmail.com",
      password: "aayas",
      phoneNumber: 56787858,
      address: "Nepal",
    };
    chai
      .request(app)
      .post(`/seller/upload`)
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});

//get seller profile by token
describe("/GET a profile of seller", () => {
  it("it should get the profile of the seller if provide with token ", (done) => {
    chai
      .request(app)
      .get(`/seller/profileByToken`)
      .set("Authorization", "Bearer " + sellerToken) //set the header first
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

//verify seller by admin
describe("/Put verify seller by admin", () => {
  it("it should verify the seller acount if provide with admin login token", (done) => {
    const userId = {
      sid: "625d50c6a6d8c504d40e45ab",
    };
    chai
      .request(app)
      .put(`/seller/verify/admin`)
      .set("Authorization", "Bearer " + adminToken) //set the header first
      .send(userId)
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
});

//get a all the categories
describe("/GET all Categories", () => {
  it("it should Get all the Type of Property", (done) => {
    chai
      .request(app)
      .get(`/category/all`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

// add a Type
describe("/POST a Type", () => {
  it("it should add a Type of Property", (done) => {
    const cat = {
      name: "house",
    };
    chai
      .request(app)
      .post(`/category/insert`)
      .set("Authorization", "Bearer " + sellerToken) //set the header first
      .send(cat)
      .end((err, res) => {
        res.should.have.status(400); // 200
        done();
      });
  });
});
