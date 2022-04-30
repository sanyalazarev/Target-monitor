'use strict';
const db = require('./db');

module.exports = {
	getList(data) {
		return new Promise((resolve, reject) => {
			db.query('SELECT t.* \
				FROM `postbacks` AS t \
				WHERE t.`affiliateId` = ?;', 
				[data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in Postbacks.getList #1\n" + err);
				else
					resolve(rows);
			});
		})
	},
	
	getById(data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `postbacks` WHERE `id` = ?;", 
				[data.id], 
			(err, rows) => {
				if (err)
					reject('Error in Postbacks.getById #1\n' + err);
				else if (rows.length == 0)
					reject('Error in Postbacks.getById #2\n' + 'Not found.');
				else
					resolve(rows[0]);
			});
		})
	},
	
	add(data) {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO `postbacks` (`affiliateId`, `eventId`, `name`, `url`, `method`, `query`, `dailyLimit`) VALUES (?, ?, ?, ?, ?, ?, ?)", 
				[data.userId, data.eventId, data.name, data.url, data.method, data.query, data.dailyLimit], 
			(err, res) => {
				if (err)
					reject('Error in Postbacks.add #1\n' + err);
				else {
					data.error = false;
					data.postbackId = res.insertId;
					
					resolve(data);
				}
			});
		})
	},
	
	edit(data) {
		return new Promise((resolve, reject) => {
			db.query("UPDATE `postbacks` SET `eventId` = ?, `name` = ?, `url` = ?, `method` = ?, `query` = ?, `dailyLimit` = ? WHERE `id` = ? AND `affiliateId` = ?;", 
				[data.eventId, data.name, data.url, data.method, data.query, data.dailyLimit, data.postbackId, data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in Postbacks.edit #1\n" + err);
				else
					resolve();
			});
		})
	}, 
	
	remove(data) {
		return new Promise((resolve, reject) => {
			db.query("DELETE FROM `postbacks` WHERE `id` = ? AND `affiliateId` = ?;", 
				[data.postbackId, data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in Postbacks.delete #1\n" + err);
				else
					resolve();
			});
		})
	}
}