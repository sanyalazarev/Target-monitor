'use strict';
const db = require('./db');

module.exports = {
	getList(data) {
		return new Promise((resolve, reject) => {
			const limit = 1000;
			const offset = (data.page - 1) * limit;
			
			db.query('SELECT t.* \
				FROM `events` AS t \
				WHERE t.`advertiserId` = ? LIMIT ?, ?;', 
				[data.userId, offset, limit], 
			(err, rows) => {
				if (err)
					reject("Error in Events.getList #1\n" + err);
				else
					resolve(rows);
			});
		})
	},
	
	getById(data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `events` WHERE `id` = ?;", 
				[data.id], 
			(err, rows) => {
				if (err)
					reject('Error in Events.getById #1\n' + err);
				else if (rows.length == 0)
					reject('Error in Events.getById #2\n' + 'Not found.');
				else
					resolve(rows[0]);
			});
		})
	},
	
	getByAdvertiserId(data) {
		return new Promise((resolve, reject) => {
			db.query('SELECT * FROM `events` WHERE `advertiserId` = ?;', 
				[data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in Events.getByAdvertiserId #1\n" + err);
				else
					resolve(rows);
			});
		})
	},
	
	add(data) {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO `events` (`advertiserId`, `name`, `regular`, `price`, `percent`, `public`) VALUES (?, ?, ?, ?, ?, ?)", 
				[data.userId, data.name, data.regular, data.price, data.percent, data.public], 
			(err, res) => {
				if (err)
					reject('Error in Events.add #1\n' + err);
				else {
					data.error = false;
					data.eventId = res.insertId;
					
					resolve(data);
				}
			});
		})
	},
	
	edit(data) {
		return new Promise((resolve, reject) => {
			db.query("UPDATE `events` SET `name` = ?, `regular` = ?, `price` = ?, `percent` = ?, `public` = ? WHERE `id` = ? AND `advertiserId` = ?;", 
				[data.name, data.regular, data.price, data.percent, data.public, data.eventId, data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in Events.edit #1\n" + err);
				else
					resolve();
			});
		})
	}, 
	
	remove(data) {
		return new Promise((resolve, reject) => {
			db.query("DELETE FROM `events` WHERE `id` = ? AND `advertiserId` = ?;", 
				[data.eventId, data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in Events.delete #1\n" + err);
				else
					resolve();
			});
		})
	}, 
	
	getAllByPostback(data) {
		return new Promise((resolve, reject) => {
			db.query('SELECT t.*, t2.`name` AS advertiser \
				FROM `events` AS t \
				LEFT JOIN `users` AS t2 ON t2.`id` = t.`advertiserId` \
				WHERE t.`public` = 1;', 
			(err, rows) => {
				if (err)
					reject("Error in Events.getAllOptions #1\n" + err);
				else
					resolve(rows);
			});
		})
	},
	
	
}