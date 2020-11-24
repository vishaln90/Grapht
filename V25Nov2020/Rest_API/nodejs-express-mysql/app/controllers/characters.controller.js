const Characters = require("../models/characters.model.js");

// Create and Save a new Characters
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
console.log("---------in-------------");
  // Create a Word
  const characters = new Characters({
    sample_id: req.body.sample_id,
    line_number: req.body.line_number,
    word_number: req.body.word_number,
    character_number: req.body.character_number,
    word_value: req.body.word_value,
    character_value: req.body.character_value,
    capital : req.body.capital,
    x_start: req.body.x_start,
    y_start: req.body.y_start,
    x_end: req.body.x_end,
    y_end : req.body.y_end,
    word_image_path : req.body.word_image_path,
    character_image_path : req.body.character_image_path,
    broader_image_path : req.body.broader_image_path,
    status : req.body.status
  });
  const source_image_full_path = req.body.source_image_full_path;
  console.log("word_split.............source image full path >>>"+source_image_full_path);

  // Save Characters in the database -- CALLER
  Characters.create(characters,source_image_full_path, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Characters."
      });
    else res.send(data);
  });
};
// Retrieve all Characterss from the database.
exports.findAll = (req, res) => {
  
};

// Find a single Characters with a sampleId
exports.findOne = (req, res) => {
  const character_value = req.params.character_value;
  Characters.findOne(character_value,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding an available Sample."
      });
    else res.send(data);
  });
};

// Update a Characters identified by the sampleId in the request
exports.updateStatusById = (req, res) => {
console.log("Here ---------- VN ------------ updateById");
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!"}); }
  // Create a Characters
  const characters = new Characters({
    sample_id : req.body.sample_id, // seperate with ,
    line_number : req.body.line_number, 
    word_number : req.body.word_number, 
    character_number : req.body.character_number, 
    status : req.body.status
  });
console.log(req.body.sample_id + " " + req.body.status);
  // Save Characters in the database -- CALLER
  Characters.updateStatusById(characters,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while reseting Characters to null."
      });
    else res.send(""); //res.send(data);
  });
 
};



// Update a Characters identified by the sampleId in the request
exports.updateStatusToNull = (req, res) => {
  const character_value = req.params.character_value;
  //console.log(">>>>>>>>>>>>>>>>xxx",character_value);
  Characters.updateStatusToNull(character_value,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while reseting Characters to null."
      });
    else res.send(""); //res.send(data);
  });
 
};


// Update a Characters identified by the sampleId in the request
exports.load_point_cordinates = (req, res) => {

  const characters = new Characters({
    sample_id: req.body.sample_id,
    line_number: req.body.line_number,
    word_number: req.body.word_number,
    character_number: req.body.character_number,
    status : req.body.status, // seperate with ,
    measure1_x : req.body.measure1_x, measure1_y : req.body.measure1_y,
    measure2_x : req.body.measure2_x, measure2_y : req.body.measure2_y,
    measure3_x : req.body.measure3_x, measure3_y : req.body.measure3_y,
    measure4_x : req.body.measure4_x, measure4_y : req.body.measure4_y,
    measure5_x : req.body.measure5_x, measure5_y : req.body.measure5_y,
    measure6_x : req.body.measure6_x, measure6_y : req.body.measure6_y,
    measure7_x : req.body.measure7_x, measure7_y : req.body.measure7_y,
    measure8_x : req.body.measure8_x, measure8_y : req.body.measure8_y,
    measure9_x : req.body.measure9_x, measure9_y : req.body.measure9_y,
    measure10_x : req.body.measure10_x, measure10_y : req.body.measure10_y,
    measure11_x : req.body.measure11_x, measure11_y : req.body.measure11_y,
    measure12_x : req.body.measure12_x, measure12_y : req.body.measure12_y,
    measure13_x : req.body.measure13_x, measure13_y : req.body.measure13_y,
    measure14_x : req.body.measure14_x, measure14_y : req.body.measure14_y,
    measure15_x : req.body.measure15_x, measure15_y : req.body.measure15_y,
    measure16_x : req.body.measure16_x, measure16_y : req.body.measure16_y,
    measure17_x : req.body.measure17_x, measure17_y : req.body.measure17_y,
    measure18_x : req.body.measure18_x, measure18_y : req.body.measure18_y,
    measure19_x : req.body.measure19_x, measure19_y : req.body.measure19_y,
    measure20_x : req.body.measure20_x, measure20_y : req.body.measure20_y
  });
  Characters.load_point_cordinates(characters,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while reseting Characters to null."
      });
    else res.send(""); //res.send(data);
  });
 
};


// Delete a Characters with the specified sampleId in the request
exports.delete = (req, res) => {
  
};

// Delete all Characterss from the database.
exports.deleteAll = (req, res) => {
  
};