'use strict';
const db = require('./db');

module.exports = {
	getList(data) {
		return new Promise((resolve, reject) => {
			const limit = 1000;
			const offset = (data.page - 1) * limit;
			
			db.query('SELECT * FROM `subaffiliates` WHERE `affiliateId` = ? LIMIT ?, ?;', 
				[data.userId, offset, limit], 
			(err, rows) => {
				if (err)
					reject("Error in Subaffiliates.getList #1\n" + err);
				else
					resolve(rows);
			});
		})
	},
	
	getById(data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `subaffiliates` WHERE `id` = ?;", 
				[data.id], 
			(err, rows) => {
				if (err)
					reject('Error in Subaffiliates.getById #1\n' + err);
				else if (rows.length == 0)
					reject('Error in Subaffiliates.getById #2\n' + 'Not found.');
				else
					resolve(rows[0]);
			});
		})
	},
	
	add(data) {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO `subaffiliates` (`affiliateId`, `name`, `utmId`) VALUES (?, ?, ?)", 
				[data.userId, data.name, data.utmId], 
			(err, res) => {
				if (err)
					reject('Error in Subaffiliates.add #1\n' + err);
				else {
					data.error = false;
					data.subaffiliateId = res.insertId;
					
					resolve(data);
				}
			});
		})
	},
	
	edit(data) {
		return new Promise((resolve, reject) => {
			db.query("UPDATE `subaffiliates` SET `name` = ?, `utmId` = ? WHERE `id` = ? AND `affiliateId` = ?;", 
				[data.name, data.utmId, data.subaffiliateId, data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in Subaffiliates.edit #1\n" + err);
				else
					resolve()
			});
		})
	}, 
	
	remove(data) {
		return new Promise((resolve, reject) => {
			db.query("DELETE FROM `subaffiliates` WHERE `id` = ? AND `affiliateId` = ?;", 
				[data.subaffiliateId, data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in Subaffiliates.delete #1\n" + err);
				else
					resolve();
			});
		})
	}
}