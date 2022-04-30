'use strict';
const db = require('./db');

module.exports = {
	getList(data) {
		return new Promise((resolve, reject) => {
			const limit = data.count ? data.count : 1000;
			const offset = (data.page - 1) * limit;
			
			db.query('SELECT * FROM `offers` WHERE `advertiserId` = ? LIMIT ?, ?;', 
				[data.userId, offset, limit], 
			(err, rows) => {
				if (err)
					reject("Error in Offers.getList #1\n" + err);
				else
					resolve(rows);
			});
		})
	},
	
	getById(data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `offers` WHERE `id` = ?;", 
				[data.id], 
			(err, rows) => {
				if (err)
					reject('Error in Offers.getById #1\n' + err);
				else if (rows.length == 0)
					reject('Error in Offers.getById #2\n' + 'Not found.');
				else
					resolve(rows[0]);
			});
		})
	},
	
	getPermittedCountries(data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT GROUP_CONCAT(`countryId`) AS countries FROM `offers_permitted_countries` WHERE `offerId` = ?;", 
				[data.offerId], 
			(err, rows) => {
				if (err)
					reject('Error in Offers.getPermittedCountries #1\n' + err);
				else
					resolve(rows[0].countries ? rows[0].countries.split(',') : []);
			});
		})
	},
	
	add(data) {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO `offers` (`advertiserId`, `name`, `description`, `public`, `active`, `url`, `domainId`) VALUES (?, ?, ?, ?, ?, ?, ?)", 
				[data.userId, data.name, data.description, data.public, data.active, data.url, data.domainId], 
			(err, res) => {
				if (err)
					reject('Error in Offers.add #1\n' + err);
				else {
					data.error = false;
					data.offerId = res.insertId;
					
					if(data.countries && data.countries.length) {
						let sql = '';
						for(var i=0; i<data.countries.length; i++)
							sql += 'INSERT INTO `offers_permitted_countries` (`offerId`, `countryId`) VALUES (' + data.offerId + ', ' + db.escape(data.countries[i]) + ');\n';
						
						db.query(sql);
					}
					
					resolve(data);
				}
			});
		})
	},
	
	edit(data) {
		return new Promise((resolve, reject) => {
			db.query("UPDATE `offers` SET `name` = ?, `description` = ?, `url` = ?, `public` = ?, `active` = ?, `domainId` = ? WHERE `id` = ? AND `advertiserId` = ?;", 
				[data.name, data.description, data.url, data.public, data.active, data.domainId, data.offerId, data.userId], 
			(err, rows) => {
				if (err)
					reject("Error in Offers.edit #1\n" + err);
				else {
					let sql = 'DELETE FROM `offers_permitted_countries` WHERE `offerId` = ' + db.escape(data.offerId) + ';\n';
					if(data.countries && data.countries.length) {
						for(var i=0; i<data.countries.length; i++)
							sql += 'INSERT INTO `offers_permitted_countries` (`offerId`, `countryId`) VALUES (' + data.offerId + ', ' + db.escape(data.countries[i]) + ');\n';
					}
					db.query(sql);
					
					resolve();
				}
			});
		})
	}, 
	
	remove(data) {
		return new Promise((resolve, reject) => {
			db.query("DELETE FROM `offers` WHERE `id` = ? AND `advertiserId` = ?;\
				DELETE FROM `offers_permitted_countries` WHERE `offerId` = ?;", 
				[data.offerId, data.userId, data.offerId], 
			(err, rows) => {
				if (err)
					reject("Error in Offers.delete #1\n" + err);
				else
					resolve();
			});
		})
	},
	
	getAllPricing(data) {
		return new Promise((resolve, reject) => {
			const limit = data.count ? data.count : 1000;
			const offset = (data.page - 1) * limit;
			
			db.query('SELECT t.*, t2.`name` AS country FROM `offers_pricing` AS t \
				LEFT JOIN `countries` AS t2 ON t2.`id` = t.`countryId` \
				WHERE `offerId` = ?;', 
				[data.offerId], 
			(err, rows) => {
				if (err)
					reject("Error in Offers.getAllPricing #1\n" + err);
				else
					resolve(rows);
			});
		})
	},
	
	getPriceById(data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `offers_pricing` WHERE `id` = ?;", 
				[data.id], 
			(err, rows) => {
				if (err)
					reject('Error in Offers.getPriceById #1\n' + err);
				else if (rows.length == 0)
					reject('Error in Offers.getPriceById #2\n' + 'Not found.');
				else
					resolve(rows[0]);
			});
		})
	},
	
	// ToDo: fix
	addPrice(data) {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO `offers_pricing` (`offerId`, `countryId`, `gender`, `ageFrom`, `ageTo`, `price`) VALUES (?, ?, ?, ?, ?, ?)", 
				[data.offerId, data.countryId, data.gender, data.ageFrom, data.ageTo, data.price], 
			(err, res) => {
				if (err)
					reject('Error in Offers.addPrice #1\n' + err);
				else {
					data.error = false;
					data.id = res.insertId;
					
					resolve(data);
				}
			});
		})
	},
	
	// ToDo: fix
	editPrice(data) {
		return new Promise((resolve, reject) => {
			db.query("UPDATE `offers_pricing` SET `countryId` = ?, `gender` = ?, `ageFrom` = ?, `ageTo` = ?, `price` = ? WHERE `id` = ?;", 
				[data.countryId, data.gender, data.ageFrom, data.ageTo, data.price, data.pricingId], 
			(err, rows) => {
				if (err)
					reject("Error in Offers.editPrice #1\n" + err);
				else
					resolve(data);
			});
		})
	}, 
	
	// ToDo: fix
	removePrice(data) {
		return new Promise((resolve, reject) => {
			db.query("DELETE FROM `offers_pricing` WHERE `id` = ?;", 
				[data.pricingId], 
			(err, rows) => {
				if (err)
					reject("Error in Offers.removePrice #1\n" + err);
				else
					resolve(data);
			});
		})
	},
}