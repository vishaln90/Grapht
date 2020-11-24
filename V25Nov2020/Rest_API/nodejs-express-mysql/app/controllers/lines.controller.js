const Lines = require("../models/lines.model.js");

// Create and Save a new Lines
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Lines
  const lines = new Lines({
    sample_id: req.body.sample_id,
    line_number: req.body.line_number,
    content_type : req.body.content_type,
    y_start : req.body.y_start,
    y_end : req.body.y_end,
    line_image_path : req.body.line_image_path,
    line_image_name : req.body.line_image_name,
    status : req.body.status
  });
  const source_image_full_path = req.body.source_image_full_path;
  console.log(".....source_image_full_path >>>>>>>>"+source_image_full_path);

  // Save Lines in the database -- CALLER
  Lines.create(lines,source_image_full_path, (err, data) => {

    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Lines."
      });
    else res.send(data);

  });
};

// Get y cordinate and height of line
exports.get_line_metadata = (req, res) => {

const sample_id = req.params.sample_id;
const line_number = req.params.line_number;
  console.log(sample_id);

  Lines.get_line_metadata(sample_id, line_number, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Unable to fetch image path from sample."
      });
    else res.send(data);
  });
};



// Retrieve all Liness from the database.
exports.findAll = (req, res) => {
  
};

// Find a single Lines with a linesId
exports.findOne = (req, res) => {
  Lines.findOne((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding an available line."
      });
    else res.send(data);
  });
};


exports.updateStatusById = (req, res) => {
console.log("Here ---------- VN ------------ updateStatusById");
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!"}); }

  // Create a Line
  const lines = new Lines({
    sample_id : req.body.sample_id, // seperate with ,
    line_number : req.body.line_number,
    status : req.body.status
  });
console.log(req.body.sample_id + " " + req.body.status);
  // Save Line in the database -- CALLER
  Lines.updateStatusById(lines,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating line status."
      });
    else res.send(""); //res.send(data);
  });
 
};



// Update a Samples identified by the sampleId in the request
exports.updateStatusToNull = (req, res) => {
  Lines.updateStatusToNull((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while reseting Lines to null."
      });
    else res.send(""); //res.send(data);
  });
 
};








// Update a Lines identified by the linesId in the request
exports.update = (req, res) => {
  
};

// Delete a Lines with the specified linesId in the request
exports.delete = (req, res) => {
  
};

// Delete all Liness from the database.
exports.deleteAll = (req, res) => {
  
};