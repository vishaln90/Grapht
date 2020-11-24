const sql = require("./db.js");
var shell = require('shelljs');

// constructor
const Samples = function(samples) {
  this.sample_id = samples.sample_id;
  this.image_folder_path = samples.image_folder_path;
  this.image_name = samples.image_name;
  this.status = samples.status;
};

Samples.create = (newSamples, result) => {
  console.log("newSamples:"+newSamples.sample_id);
  var sqlQuery = sql.query("INSERT INTO graph_schema.samples SET ?", newSamples, (err, res) => {
    if (err) {
      console.log("Query:"+sqlQuery.sql);
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created samples: ", { id: res.insertId, ...newSamples });
    result(null, { id: res.insertId, ...newSamples });
  });
};

Samples.findOne = (result) => {
  sql.query(`SELECT sample_id,image_folder_path,image_name FROM samples WHERE status is null`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found samples: ", res[0]);
      result(null, res[0]);
      var temp_path = (res[0].image_folder_path + "/").replace("//","/");
      shell.mkdir('-p', temp_path + "lines");
      shell.mkdir('-p', temp_path + "words");
      shell.mkdir('-p', temp_path + "characters");
      return;
    }

    // not found Samples with the id
    result({ kind: "not_found" }, null);
  });
};

Samples.pendingCount = (result) => {
  sql.query(`SELECT count(1) as 'PendingCount' FROM graph_schema.samples WHERE status is null or status <> 'Complete'`, (err, res) => {
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


Samples.get_source_image_path_from_sample = (sample_id,result) => {
var query1 ="SELECT CONCAT(image_folder_path,image_name) as source_image_full_path FROM graph_schema.samples WHERE sample_id = " + sample_id;
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


Samples.getAll = result => {
  sql.query("SELECT * FROM samples", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("samples: ", res);
    result(null, res);
  });
};

Samples.updateStatusById = (newSamples, result) => {

var query_statement = "UPDATE graph_schema.samples SET status ='"+ newSamples.status + "', last_updated = now() WHERE sample_id = " + newSamples.sample_id;
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

      console.log("samples_updated");
     //result(null, { id: id, ...samples });
     result(null, res);
    }
  );
};

Samples.updateStatusToNull = (result) => {
var query_statement = "UPDATE graph_schema.samples SET status = null WHERE status <> 'Complete'";
console.log(query_statement);
  sql.query(query_statement,(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
     result(null, res);
     console.log("samples_updated_to_null step complete");
    }
  );
};

Samples.remove = (id, result) => {
  sql.query("DELETE FROM samples WHERE id = ?", id, (err, res) => {
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

    console.log("deleted samples with id: ", id);
    result(null, res);
  });
};

Samples.removeAll = result => {
  sql.query("DELETE FROM samples", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} samples`);
    result(null, res);
  });
};

module.exports = Samples;