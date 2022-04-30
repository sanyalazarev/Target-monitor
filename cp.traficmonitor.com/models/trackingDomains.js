'use strict';
const db = require('./db');

module.exports = {
	getList(data) {
		return new Promise((resolve, reject) => {
			const limit = 1000;
			const offset = (data.page - 1) * limit;
			
			db.query('SELECT * FROM `tracking_domains` WHERE `advertiserId` = ? LIMIT ?, ?;', 
				[data.userId, offset, limit], 
			(err, rows) => {
				if (err)
					reject("Error in TrackingDomains.getList #1\n" + err);
				else
					resolve(rows);
			});
		})
	},
	
	getById(data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `tracking_domains` WHERE `id` = ?;", 
				[data.id], 
			(err, rows) => {
				if (err)
					reject('Error in TrackingDomains.getById #1\n' + err);
				else if (rows.length == 0)
					reject('Error in TrackingDomains.getById #2\n' + 'Not found.');
				else
					resolve(rows[0]);
			});
		})
	},
	
	add(data) {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO `tracking_domains` (`advertiserId`, `domain`) VALUES (?, ?)", 
				[data.userId, data.domain], 
			(err, res) => {
				if (err)
					reject('Error in TrackingDomains.add #1\n' + err);
				else {
					data.error = false;
					data.domainId = res.insertId;
					
					resolve(data);
				}
			});
		})
	},
	
	edit(data) {
		return new Promise((resolve, reject) => {
			db.query("UPDATE `tracking_domains` SET `domain` = ? WHERE `id` = ? AND `advertiserId` = ?;", 
				[data.domain, data.domainId, data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in TrackingDomains.edit #1\n" + err);
				else
					resolve();
			});
		})
	}, 
	
	remove(data) {
		return new Promise((resolve, reject) => {
			db.query("DELETE FROM `tracking_domains` WHERE `id` = ? AND `advertiserId` = ?;", 
				[data.domainId, data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in TrackingDomains.delete #1\n" + err);
				else
					resolve();
			});
		})
	}
}