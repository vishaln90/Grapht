const sql = require("./db.js");
const Clipper = require('image-clipper');
const canvas = require('canvas');
var sizeOf = require('image-size');


// constructor
const Lines = function(lines) {
  this.sample_id = lines.sample_id;
  this.line_number = lines.line_number;
  this.content_type = lines.content_type;
  this.y_start = lines.y_start;
  this.y_end = lines.y_end;
  this.line_image_path = lines.line_image_path;
  this.line_image_name = lines.line_image_name;
  this.status = lines.status;
};
 

Lines.create = (newLines,source_file, result) => {
  console.log("newLines:"+newLines.sample_id,source_file);
  var sqlQuery = sql.query("INSERT INTO graph_schema.lines SET ?", newLines, (err, res) => {
    if (err) {
      console.log("Query:"+sqlQuery.sql);
      console.log("error: ", err);
      result(err, null);
      return;
    }

    //var source_file= "C:/Users/vnarsinghani/Desktop/Grapht/UI/UI - Line_with_connection/images/Sample2.jpg" //newLines.line_image_path.replace("/lines/","/")+"Sample"+newLines.sample_id+".jpg";
    console.log("Source fle >>", source_file);
    var target_file = newLines.line_image_path+newLines.line_image_name;
    

    clip_image(source_file, target_file, 0, newLines.y_start, 100, newLines.y_end);
    //console.log("Check dimensions ",dimensions.width, dimensions.height);

    console.log("created lines: ", { id: res.insertId, ...newLines });
    result(null, { id: res.insertId, ...newLines });
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
}

Lines.get_line_metadata = (sample_id,line_number,result) => {
var query1 ="SELECT y_start, y_end FROM graph_schema.lines WHERE sample_id = " + sample_id + " and line_number = " + line_number;
console.log ("Get Line Metadata Query >> ", query1)
  sql.query(query1, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found samples: ", res[0]);
      result(null, res[0]);
      return;
    }

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
  sql.query(`SELECT sample_id,line_number,content_type, y_start,y_end, line_image_path, line_image_name 
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