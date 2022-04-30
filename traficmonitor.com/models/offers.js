'use strict';

const db = require('./db');

module.exports = {
	getById: function(offerId) {
		offerId = parseInt(offerId);
		
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `offers` WHERE `id` = ?", [offerId], function(err, rows){
				if (err)
					return reject("Error in Offers.getById\n" + err);
				else
					return resolve(rows.length ? rows[0] : false);
			})
		})
	}, 
	
	getPermittedCountries: function(offerId) {
		offerId = parseInt(offerId);
		
		return new Promise((resolve, reject) => {
			db.query("SELECT GROUP_CONCAT(`countryId`) AS countries FROM `offers_permitted_countries` WHERE `offerId` = ?;", 
					[offerId], 
			function(err, rows) {
				if (err)
					return reject("Error in Offers.getPermittedCountries\n" + err);
				else {
					let permittedCountries = rows[0].countries ? rows[0].countries.split(",") : [];
					
					permittedCountries = permittedCountries.map(function(el) {
						return parseInt(el);
					});
					
					return resolve(permittedCountries);
				}
			})
		})
	}, 
}