const request = require('request');
const fs = require('fs');
const db = require('./models/db');

function addModels(manufacture_id, Manufacturer, sec) {
	setTimeout(function(){
		var sql = "";
		request('https://www.trade-a-plane.com/ajax/get_model_groups?make_type_id=1&make_name=' + encodeURIComponent(Manufacturer) + '&_=1622740605148', { json: true }, (err, res, body) => {
			if (err) { return console.log(err); }
			
			// var sql = '';
			// for(var i=0; i<body.Models.length; i++) {
				// if(body.Models[i].Value && !body.Models[i].IsParent)
					// sql += "INSERT INTO `planes` (`manufacture_id`, `name`) VALUES ('" + manufacture_id + "', '" + body.Models[i].Value + "');" + "\n";
			// }
			// console.log(sql);
			// console.log(body);
			
			for(var i=0; i<body.length; i++)
				if(body[i][1] == "f" || !body[i][1])
					sql += "INSERT INTO `planes_model` (`manufacture_id`, `name`) VALUES ('" + manufacture_id + "', '" + body[i][0] + "');" + "\n";
				else
					for(var j=0; j<body[i][2].length; j++)
						sql += "INSERT INTO `planes_model` (`manufacture_id`, `name`) VALUES ('" + manufacture_id + "', '" + body[i][2][j][0] + "');" + "\n";
			
			console.log(sql);
			fs.appendFileSync('models.sql', sql);
		});
	}, sec)
}

db.query("SELECT * FROM `planes_manufacture` ORDER BY `id` ASC", function(err, rows) {
	for(var i=0; i<rows.length; i++)
		addModels(rows[i].id, rows[i].name, i * 1000);
})
