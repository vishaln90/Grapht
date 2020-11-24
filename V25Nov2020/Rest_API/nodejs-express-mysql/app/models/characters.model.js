const sql = require("./db.js");
const Clipper = require('image-clipper');
const canvas = require('canvas');
var sizeOf = require('image-size');

// constructor
const Characters = function(characters) {
  this.sample_id = characters.sample_id;
  this.line_number = characters.line_number;
  this.word_number = characters.word_number;
  this.character_number = characters.character_number;
  this.word_value = characters.word_value;
  this.character_value = characters.character_value;
  this.capital = characters.capital;
  this.x_start = characters.x_start;  
  this.y_start = characters.y_start;  
  this.x_end = characters.x_end;
  this.y_end = characters.y_end;
  this.character_image_path = characters.character_image_path;
  this.word_image_path = characters.word_image_path;
  this.broader_image_path = characters.broader_image_path;
  this.status = characters.status;
  this.measure1_x = characters.measure1_x;  this.measure1_y = characters.measure1_y;
  this.measure2_x = characters.measure2_x;  this.measure2_y = characters.measure2_y;
  this.measure3_x = characters.measure3_x;  this.measure3_y = characters.measure3_y;
  this.measure4_x = characters.measure4_x;  this.measure4_y = characters.measure4_y;
  this.measure5_x = characters.measure5_x;  this.measure5_y = characters.measure5_y;
  this.measure6_x = characters.measure6_x;  this.measure6_y = characters.measure6_y;
  this.measure7_x = characters.measure7_x;  this.measure7_y = characters.measure7_y;
  this.measure8_x = characters.measure8_x;  this.measure8_y = characters.measure8_y;
  this.measure9_x = characters.measure9_x;  this.measure9_y = characters.measure9_y;
  this.measure10_x = characters.measure10_x;  this.measure10_y = characters.measure10_y;
  this.measure11_x = characters.measure11_x;  this.measure11_y = characters.measure11_y;
  this.measure12_x = characters.measure12_x;  this.measure12_y = characters.measure12_y;
  this.measure13_x = characters.measure13_x;  this.measure13_y = characters.measure13_y;
  this.measure14_x = characters.measure14_x;  this.measure14_y = characters.measure14_y;
  this.measure15_x = characters.measure15_x;  this.measure15_y = characters.measure15_y;
  this.measure16_x = characters.measure16_x;  this.measure16_y = characters.measure16_y;
  this.measure17_x = characters.measure17_x;  this.measure17_y = characters.measure17_y;
  this.measure18_x = characters.measure18_x;  this.measure18_y = characters.measure18_y;
  this.measure19_x = characters.measure19_x;  this.measure19_y = characters.measure19_y;
  this.measure20_x = characters.measure20_x;  this.measure20_y = characters.measure20_y;
};

Characters.create = (newCharacters,source_image_full_path, result) => {
  console.log("newCharacters:"+newCharacters.sample_id);
  var sqlQuery = sql.query("INSERT INTO graph_schema.characters SET ?", newCharacters, (err, res) => {
    if (err) {
      console.log("Query:"+sqlQuery.sql);
      console.log("error: ", err);
      result(err, null);
      return;
    }

    //console.log("created characters: ", { id: res.insertId, ...newCharacters });
    clip_image(source_image_full_path, newCharacters.character_image_path, newCharacters.x_start, newCharacters.y_start, newCharacters.x_end, newCharacters.y_end);
    result(null, { id: res.insertId, ...newCharacters });
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


Characters.findById = (sample_id, result) => {
  sql.query(`SELECT * FROM characters WHERE id = ${sample_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found characters: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Characters with the id
    result({ kind: "not_found" }, null);
  });
};

Characters.getAll = result => {
  sql.query("SELECT * FROM characters", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("characters: ", res);
    result(null, res);
  });
};


Characters.findOne = (inp_character_value, result) => {
  var query_1 = `SELECT sample_id,line_number,word_number, character_number, character_value, character_image_path, word_image_path,x_start, x_end, y_start, y_end 
  FROM graph_schema.characters WHERE status ='new' and character_value = '${inp_character_value}'`;

  console.log(query_1);
  sql.query(query_1, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found characters: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found Samples with the id
    result({ kind: "not_found" }, null);
  });
};


Characters.updateStatusById = (newCharacters, result) => {

var query_statement = "UPDATE graph_schema.characters SET status ='"+ newCharacters.status + 
      "', last_updated = now() WHERE sample_id = " + newCharacters.sample_id + " and line_number = " + newCharacters.line_number + 
      " and word_number = " + newCharacters.word_number+ " and character_number = " + newCharacters.character_number;
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


Characters.updateStatusToNull = (inp_character_value,result) => {

var query_statement = `UPDATE graph_schema.characters SET status = 'new' WHERE status <> 'Complete' and character_value='${inp_character_value}'`;
console.log(query_statement);
  sql.query(query_statement,(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
     result(null, res);
     console.log("characters_updated_to_null step complete");
    }
  );
};



Characters.load_point_cordinates = (newCharacters, result) => {
console.log(">>>>>>>>>>>>>",newCharacters.measure1_x);
var query_statement = "UPDATE graph_schema.characters SET status ='Complete', last_updated = now()" + 
",measure1_x = "+ newCharacters.measure1_x + ",measure1_y = "+ newCharacters.measure1_y +
",measure2_x = "+ newCharacters.measure2_x + ",measure2_y = "+ newCharacters.measure2_y +
",measure3_x = "+ newCharacters.measure3_x + ",measure3_y = "+ newCharacters.measure3_y +
",measure4_x = "+ newCharacters.measure4_x + ",measure4_y = "+ newCharacters.measure4_y +
",measure5_x = "+ newCharacters.measure5_x + ",measure5_y = "+ newCharacters.measure5_y +
",measure6_x = "+ newCharacters.measure6_x + ",measure6_y = "+ newCharacters.measure6_y +
",measure7_x = "+ newCharacters.measure7_x + ",measure7_y = "+ newCharacters.measure7_y +
",measure8_x = "+ newCharacters.measure8_x + ",measure8_y = "+ newCharacters.measure8_y +
",measure9_x = "+ newCharacters.measure9_x + ",measure9_y = "+ newCharacters.measure9_y +
",measure10_x = "+ newCharacters.measure10_x + ",measure10_y = "+ newCharacters.measure10_y +
",measure11_x = "+ newCharacters.measure11_x + ",measure11_y = "+ newCharacters.measure11_y +
",measure12_x = "+ newCharacters.measure12_x + ",measure12_y = "+ newCharacters.measure12_y +
",measure13_x = "+ newCharacters.measure13_x + ",measure13_y = "+ newCharacters.measure13_y +
",measure14_x = "+ newCharacters.measure14_x + ",measure14_y = "+ newCharacters.measure14_y +
",measure15_x = "+ newCharacters.measure15_x + ",measure15_y = "+ newCharacters.measure15_y +
",measure16_x = "+ newCharacters.measure16_x + ",measure16_y = "+ newCharacters.measure16_y +
",measure17_x = "+ newCharacters.measure17_x + ",measure17_y = "+ newCharacters.measure17_y +
",measure18_x = "+ newCharacters.measure18_x + ",measure18_y = "+ newCharacters.measure18_y +
",measure19_x = "+ newCharacters.measure19_x + ",measure19_y = "+ newCharacters.measure19_y +
",measure20_x = "+ newCharacters.measure20_x + ",measure20_y = "+ newCharacters.measure20_y +
" WHERE sample_id = " + newCharacters.sample_id + " and line_number = " + newCharacters.line_number + 
      " and word_number = " + newCharacters.word_number+ " and character_number = " + newCharacters.character_number;
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


Characters.remove = (id, result) => {
  sql.query("DELETE FROM characters WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Characters with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted characters with id: ", id);
    result(null, res);
  });
};

Characters.removeAll = result => {
  sql.query("DELETE FROM characters", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} characters`);
    result(null, res);
  });
};

module.exports = Characters;