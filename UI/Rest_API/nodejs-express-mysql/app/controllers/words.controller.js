const Words = require("../models/words.model.js");

// Create and Save a new Words
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
console.log("---------in-------------");
  // Create a Word
  const words = new Words({
    sample_id: req.body.sample_id,
    line_number: req.body.line_number,
    word_number: req.body.word_number,
    word_value: req.body.word_value,
    type_of_word: req.body.type_of_word,
    x_cordinate_contour: req.body.x_cordinate_contour,
    y_cordinate_contour: req.body.y_cordinate_contour,
    width_contour: req.body.width_contour,
    height_contour : req.body.height_contour,
    word_image_path : req.body.word_image_path,
    word_image_name : req.body.word_image_name,
    status : req.body.status // seperate with ,
  });

  // Save Words in the database -- CALLER
  Words.create(words, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Words."
      });
    else res.send(data);
  });
};
// Retrieve all Wordss from the database.
exports.findAll = (req, res) => {
  
};

// Find a single Words with a sampleId
exports.findOne = (req, res) => {
  Words.findOne((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding an available Sample."
      });
    else res.send(data);
  });
};

// Update a Words identified by the sampleId in the request
exports.updateStatusById = (req, res) => {
console.log("Here ---------- VN ------------ updateById");
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!"}); }

  // Create a Words
  const words = new Words({
    sample_id : req.body.sample_id, // seperate with ,
    status : req.body.status
  });
console.log(req.body.sample_id + " " + req.body.status);
  // Save Words in the database -- CALLER
  Words.updateStatusById(words,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while reseting Words to null."
      });
    else res.send(""); //res.send(data);
  });
 
};



// Update a Words identified by the sampleId in the request
exports.updateStatusToNull = (req, res) => {
  Words.updateStatusToNull((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while reseting Words to null."
      });
    else res.send(""); //res.send(data);
  });
 
};


// Delete a Words with the specified sampleId in the request
exports.delete = (req, res) => {
  
};

// Delete all Wordss from the database.
exports.deleteAll = (req, res) => {
  
};