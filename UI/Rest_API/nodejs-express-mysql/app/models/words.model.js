const sql = require("./db.js");

// constructor
const Words = function(words) {
  this.sample_id = words.sample_id;
  this.line_number = words.line_number;
  this.word_number = words.word_number;
  this.word_value = words.word_value;
  this.type_of_word = words.type_of_word;
  this.x_cordinate_contour = words.x_cordinate_contour;  
  this.y_cordinate_contour = words.y_cordinate_contour;
  this.width_contour = words.width_contour;
  this.height_contour = words.height_contour;
  this.word_image_path = words.word_image_path;
  this.word_image_name = words.word_image_name;
  this.status = words.status;
};

Words.create = (newWords, result) => {
  console.log("newWords:"+newWords.sample_id);
  var sqlQuery = sql.query("INSERT INTO graph_schema.words SET ?", newWords, (err, res) => {
    if (err) {
      console.log("Query:"+sqlQuery.sql);
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created words: ", { id: res.insertId, ...newWords });
    result(null, { id: res.insertId, ...newWords });
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
  sql.query(`SELECT sample_id,line_number,word_number, word_value, word_image_path, word_image_name 
    FROM graph_schema.words WHERE status ="need manual split"`, (err, res) => {
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
      "', last_updated = now() WHERE sample_id = " + newWords.sample_id + " and line_number = " + newWords.line_number + " and word_number = " + newWords.word_number;
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

var query_statement = "UPDATE graph_schema.words SET status = 'new' WHERE status <> 'Complete'";
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