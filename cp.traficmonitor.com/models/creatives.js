'use strict';
const db = require('./db');

module.exports = {
	getList(data) {
		return new Promise((resolve, reject) => {
			const limit = 1000;
			const offset = (data.page - 1) * limit;
			
			db.query('SELECT * FROM `creatives` WHERE `affiliateId` = ? LIMIT ?, ?;', 
				[data.userId, offset, limit], 
			(err, rows) => {
				if (err)
					reject("Error in Creatives.getList #1\n" + err);
				else
					resolve(rows);
			});
		})
	},
	
	getById(data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `creatives` WHERE `id` = ?;", 
				[data.id], 
			(err, rows) => {
				if (err)
					reject('Error in Creatives.getById #1\n' + err);
				else if (rows.length == 0)
					reject('Error in Creatives.getById #2\n' + 'Not found.');
				else
					resolve(rows[0]);
			});
		})
	},
	
	add(data) {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO `creatives` (`affiliateId`, `name`) VALUES (?, ?)", 
				[data.userId, data.name], 
			(err, res) => {
				if (err)
					reject('Error in Creatives.add #1\n' + err);
				else {
					data.error = false;
					data.creativeId = res.insertId;
					
					resolve(data);
				}
			});
		})
	},
	
	edit(data) {
		return new Promise((resolve, reject) => {
			db.query("UPDATE `creatives` SET `name` = ? WHERE `id` = ? AND `affiliateId` = ?;", 
				[data.name, data.creativeId, data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in Creatives.edit #1\n" + err);
				else
					resolve();
			});
		})
	}, 
	
	remove(data) {
		return new Promise((resolve, reject) => {
			db.query("DELETE FROM `creatives` WHERE `id` = ? AND `affiliateId` = ?;", 
				[data.creativeId, data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in Creatives.delete #1\n" + err);
				else
					resolve();
			});
		})
	}
}