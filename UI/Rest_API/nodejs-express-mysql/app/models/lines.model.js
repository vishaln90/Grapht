const sql = require("./db.js");

// constructor
const Lines = function(lines) {
  this.sample_id = lines.sample_id;
  this.line_number = lines.line_number;
  this.content_type = lines.content_type;
  this.y_cordinate_contour = lines.y_cordinate_contour;
  this.height_contour = lines.height_contour;
  this.line_image_path = lines.line_image_path;
  this.line_image_name = lines.line_image_name;
  this.status = lines.status;
};

Lines.create = (newLines, result) => {
  console.log("newLines:"+newLines.sample_id);
  var sqlQuery = sql.query("INSERT INTO graph_schema.lines SET ?", newLines, (err, res) => {
    if (err) {
      console.log("Query:"+sqlQuery.sql);
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created lines: ", { id: res.insertId, ...newLines });
    result(null, { id: res.insertId, ...newLines });
  });
};

Lines.findById = (sample_id, result) => {
  sql.query(`SELECT * FROM lines WHERE id = ${sample_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found lines: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Lines with the id
    result({ kind: "not_found" }, null);
  });
};

Lines.getAll = result => {
  sql.query("SELECT * FROM lines", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("lines: ", res);
    result(null, res);
  });
};


Lines.findOne = (result) => {
  sql.query(`SELECT sample_id,line_number,content_type, y_cordinate_contour,height_contour, line_image_path, line_image_name 
    FROM graph_schema.lines WHERE status ="new" and content_type="Line"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found lines: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found Samples with the id
    result({ kind: "not_found" }, null);
  });
};


Lines.updateStatusById = (newLines, result) => {

var query_statement = "UPDATE graph_schema.lines SET status ='"+ newLines.status + 
      "', last_updated = now() WHERE sample_id = " + newLines.sample_id + " and line_number = " + newLines.line_number;
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


Lines.updateStatusToNull = (result) => {

var query_statement = "UPDATE graph_schema.lines SET status = 'new' WHERE status <> 'Complete'";
console.log(query_statement);
  sql.query(query_statement,(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
     result(null, res);
     console.log("lines_updated_to_null step complete");
    }
  );
};



Lines.remove = (id, result) => {
  sql.query("DELETE FROM lines WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Lines with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted lines with id: ", id);
    result(null, res);
  });
};

Lines.removeAll = result => {
  sql.query("DELETE FROM lines", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} lines`);
    result(null, res);
  });
};

module.exports = Lines;