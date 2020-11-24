const sql = require("./db.js");
const Clipper = require('image-clipper');
const canvas = require('canvas');
var sizeOf = require('image-size');

// constructor
const Words = function(words) {
  this.sample_id = words.sample_id;
  this.line_number = words.line_number;
  this.word_number = words.word_number;
  this.word_value = words.word_value;
  this.type_of_word = words.type_of_word;
  this.x_start = words.x_start;  
  this.y_start = words.y_start;  
  this.x_end = words.x_end;
  this.y_end = words.y_end;
  this.word_image_path = words.word_image_path;
  this.word_image_name = words.word_image_name;
  this.status = words.status;
};

Words.create = (newWords,source_image_full_path, result) => {
  console.log("newWords:"+newWords.sample_id);
  var sqlQuery = sql.query("INSERT INTO graph_schema.words SET ?", newWords, (err, res) => {
    if (err) {
      console.log("Query:"+sqlQuery.sql);
      console.log("error: ", err);
      result(err, null);
      return;
    }

    //console.log("created words: ", { id: res.insertId, ...newWords });
    clip_image(source_image_full_path, newWords.word_image_path+newWords.word_image_name, newWords.x_start, newWords.y_start, newWords.x_end, newWords.y_end);
    result(null, { id: res.insertId, ...newWords });
  });
};

function clip_image(source_file,target_file, x_start, y_start, x_end, y_end) 
{
    
    sizeOf(source_file, function (err, dimensions) {

        var abs_max_width = dimensions.width;
        var abs_max_height = dimensions.height;

        var clip_width = (x_end-x_start)*abs_max_width/100;
        var clip_height = (y_end-y_start)*abs_max_height/100;
        
        Clipper.configure('canvas', canvas);
        Clipper(source_file, function() {

        console.log("Actual Inputs >>>",x_start, y_start, x_end, y_end)
        console.log("Files >>", source_file,target_file);

        console.log("Inputs to clipper >>>>>>>",abs_max_width*x_start/100, abs_max_height*y_start/100, clip_width, clip_height)
        this.crop(abs_max_width*x_start/100, abs_max_height*y_start/100, clip_width, clip_height)
        .toFile(target_file, function() {
            console.log('saved!');});
        });
    });
};


Words.findById = (sample_id, result) => {
  sql.query(`SELECT * FROM words WHERE id = ${sample_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found words: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Words with the id
    result({ kind: "not_found" }, null);
  });
};

Words.getAll = result => {
  sql.query("SELECT * FROM words", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("words: ", res);
    result(null, res);
  });
};


Words.findOne = (result) => {
  sql.query(`SELECT sample_id,line_number, word_number, word_value, word_image_path, word_image_name, x_start, x_end, y_start, y_end 
    FROM graph_schema.words WHERE status ="EVALUATION Pending"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found words: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found Samples with the id
    result({ kind: "not_found" }, null);
  });
};


Words.updateStatusById = (newWords, result) => {

var query_statement = "UPDATE graph_schema.words SET status ='"+ newWords.status + 
      "', last_updated = now() WHERE sample_id = " + newWords.sample_id + " and line_number = " + newWords.line_number 
      + " and word_number = " + newWords.word_number;
console.log(query_statement);
  sql.query(query_statement,(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Samples with the id
        result({ kind: "not_found" }, null);
        return;
      }
      
      console.log("line_updated");
     //result(null, { id: id, ...samples });
     result(null, res);
    }
  );
};


Words.updateStatusToNull = (result) => {

var query_statement = "UPDATE graph_schema.words SET status = 'EVALUATION Pending' WHERE status = 'EVALUATION In-progress'";
console.log(query_statement);
  sql.query(query_statement,(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
     result(null, res);
     console.log("words_updated_to_null step complete");
    }
  );
};



Words.remove = (id, result) => {
  sql.query("DELETE FROM words WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Words with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted words with id: ", id);
    result(null, res);
  });
};

Words.evaluate_words_to_chars = (newWords, result) => {

var query_statement = "Call graph_schema.evaluate_words_2(" + newWords.sample_id + "," + newWords.line_number + ")";
console.log(query_statement);
  sql.query(query_statement,(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      
      console.log("word to char split complete");
     result(null, res);
    }
  );
};



Words.removeAll = result => {
  sql.query("DELETE FROM words", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} words`);
    result(null, res);
  });
};

module.exports = Words;