module.exports = app => {

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //res.header("Access-Control-Allow-Headers", "*");
  next();
});

  const customers = require("../controllers/customer.controller.js");
  const lines = require("../controllers/lines.controller.js");
const samples = require("../controllers/samples.controller.js");
const words = require("../controllers/words.controller.js");
  // Create a new Customer
  app.post("/customers", customers.create);

  // Retrieve all Customers
  app.get("/customers", customers.findAll);

  // Retrieve a single Customer with customerId
  app.get("/customers/:customerId", customers.findOne);

  // Update a Customer with customerId
  app.put("/customers/:customerId", customers.update);

  // Delete a Customer with customerId
  app.delete("/customers/:customerId", customers.delete);

  // Create a new Customer
  app.delete("/customers", customers.deleteAll);
 
 // Create a new Customer 
  app.post("/lines", lines.create);
  app.post("/words", words.create);

  app.get("/samples", samples.findOne);
  app.put("/samples/updateStatusById", samples.updateStatusById);
  app.put("/samples/updateStatusToNull", samples.updateStatusToNull);

  app.get("/lines", lines.findOne);
  app.put("/lines/updateStatusById", lines.updateStatusById);
  app.put("/lines/updateStatusToNull", lines.updateStatusToNull);

  app.get("/words", words.findOne);
  app.put("/words/updateStatusById", words.updateStatusById);
  //app.put("/words/updateStatusToNull", words.updateStatusToNull);

};