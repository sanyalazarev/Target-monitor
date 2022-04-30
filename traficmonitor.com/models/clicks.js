'use strict';

const db = require('./db');

module.exports = {
	addNew: function(data) {
		data.offerId = parseInt(data.offerId);
		data.affiliateId = parseInt(data.affiliateId);
		data.creativeId = parseInt(data.creativeId);
		data.subAffiliateId = parseInt(data.subAffiliateId);
		
		return new Promise((resolve, reject) => {
			if (!data.offerId || !data.affiliateId || !data.creativeId)
				return reject("Error in Clicks.addNew #1\n" + "Required parameters not set");
			else {
				db.query("INSERT INTO `clicks` (`affiliateId`, `offerId`, `creativeId`, `subAffiliateId`, `personId`, `ip`, `language`, `countryId`, `country`, `countryAllowed`, `a1`, `a2`, `a3`, `a4`, `a5`, `custom_params`) \
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", 
					[
						data.affiliateId, 
						data.offerId, 
						data.creativeId, 
						data.subAffiliateId, 
						data.personId, 
						data.ip, 
						data.language, 
						data.countryId, 
						data.country, 
						data.countryAllowed, 
						(data.a1 ? data.a1 : ''), 
						(data.a2 ? data.a2 : ''), 
						(data.a3 ? data.a3 : ''), 
						(data.a4 ? data.a4 : ''), 
						(data.a5 ? data.a5 : ''), 
						data.custom_params
					], 
				function(err, res) {
					if (err)
						return reject("Error in Clicks.addNew #2\n" + err);
					else
						return resolve(res.insertId);
				})
			}
		})
	}, 
	
	search: function(data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT `id` FROM `clicks` \
				WHERE `ip` = ? AND `date` >= (NOW() - INTERVAL 60 MINUTE) ORDER BY `id` DESC;", 
				[data.ip], 
			function(err, rows) {
				if (err)
					return reject("Error in Clicks.search #1\n" + err);
				else
					return resolve(rows.length ? rows[0].id : 0);
			})
		})
	}
}