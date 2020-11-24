const Samples = require("../models/samples.model.js");

// Create and Save a new Samples
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Samples
  const samples = new Samples({
    sample_id : req.body.sample_id // seperate with ,
  });

  // Save Samples in the database -- CALLER
  Samples.create(samples, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Samples."
      });
    else res.send(data);
  });
};
// Retrieve all Sampless from the database.
exports.findAll = (req, res) => {
  
};

// Find a single Samples with a sampleId
exports.findOne = (req, res) => {
  Samples.findOne((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding an available Sample."
      });
    else res.send(data);
  });
};


exports.pendingCount = (req, res) => {
  Samples.pendingCount((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding an available Sample."
      });
    else res.send(data);
  });
};


exports.get_source_image_path_from_sample = (req, res) => {

const sample_id = req.params.sample_id;
  console.log(sample_id);

  Samples.get_source_image_path_from_sample(sample_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Unable to fetch image path from sample."
      });
    else res.send(data);
  });
};

// Update a Samples identified by the sampleId in the request
exports.updateStatusById = (req, res) => {
console.log("Here ---------- VN ------------ updateById");
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!"}); }

  // Create a Samples
  const samples = new Samples({
    sample_id : req.body.sample_id, // seperate with ,
    status : req.body.status
  });
console.log(req.body.sample_id + " " + req.body.status);
  // Save Samples in the database -- CALLER
  Samples.updateStatusById(samples,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while reseting Samples to null."
      });
    else res.send(""); //res.send(data);
  });
 
};



// Update a Samples identified by the sampleId in the request
exports.updateStatusToNull = (req, res) => {
  Samples.updateStatusToNull((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while reseting Samples to null."
      });
    else res.send(""); //res.send(data);
  });
 
};


// Delete a Samples with the specified sampleId in the request
exports.delete = (req, res) => {
  
};

// Delete all Sampless from the database.
exports.deleteAll = (req, res) => {
  
};