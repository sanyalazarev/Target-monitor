'use strict';

const db = require('./db');

module.exports = {
	getByName: function(country) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `countries` WHERE `name` LIKE ?", 
				[country], 
			function(err, rows) {
				if (err)
					return reject("Error in Countries.getByName\n" + err);
				else
					return resolve(rows);
			});
		});
	}, 
	
	addNew: function(country) {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO `countries` (`name`) VALUE (?)", 
				[country], 
			function(err, res) {
				if (err)
					return reject("Error in Countries.addNew\n" + err);
				else
					return resolve(res.insertId);
			});
		});
	}
}