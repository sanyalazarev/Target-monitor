'use strict';

const db = require('./db');

module.exports = {
	search: function(data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `persons` WHERE `device` LIKE ? AND `language` LIKE ?;", 
				[data.device, data.language], 
			function(err, rows){
				if (err)
					return reject(err)
				else
					return resolve(rows.length ? rows[0] : false);
			})
		})
	}, 
	
	searchByFingerprint: function(fingerprint) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `persons` WHERE `fingerprint` LIKE ?;", 
				[fingerprint], 
			function(err, rows){
				if (err)
					return reject(err)
				else
					return resolve(rows.length ? rows[0] : false);
			})
		})
	}, 
	
	addNew: function(data) {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO `persons` (`device`, `language`, `fingerprint`) VALUES (?, ?, ?);", 
				[data.device, data.language, data.fingerprint], 
			function(err, res){
				if (err)
					return reject(err)
				else
					return resolve(res.insertId);
			})
		})
	}
}