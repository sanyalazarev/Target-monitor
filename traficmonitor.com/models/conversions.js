'use strict';
const request = require('request');
const fs = require('fs');
const db = require('./db');

module.exports = {
	addNew: function(data) {
		const advertiserId = parseInt(data.advertiser_id);
		const clickId = parseInt(data.click_id);
		const eventId = parseInt(data.event_id);
		
		const gender = data.gender ? parseInt(data.gender) : 0;
		const age = data.age ? parseInt(data.age) : 0;
		
		const b1 = data.b1 ? data.b1 : '';
		const b2 = data.b2 ? data.b2 : '';
		const b3 = data.b3 ? data.b3 : '';
		const b4 = data.b4 ? data.b4 : '';
		const b5 = data.b5 ? data.b5 : '';
		
		return new Promise((resolve, reject) => {
			if (!advertiserId || !clickId || !eventId)
				return reject("Required parameters not set");
			else
				return resolve();
		}).then(() => {
			return new Promise((resolve, reject) => {
				db.query("SELECT * FROM `clicks` WHERE `id` = ?", 
					[clickId], 
				function(err, rows) {
					if (err) {
						console.log("Error in Conversions.addNew #1\n" + err);
						return reject("Internal error #1");
					}
					else if (rows.length == 0)
						return reject("ClickId not found");
					else
						return resolve(rows[0]);
				});
			});
		}).then(click => {
			return new Promise((resolve, reject) => {
				db.query("SELECT * FROM `events` WHERE `id` = ? AND `advertiserId` = ?;\
					SELECT `id` FROM `offers_permitted_countries` WHERE `offerId` = ? LIMIT 1;\
					SELECT `id` FROM `offers_permitted_countries` WHERE `offerId` = ? AND `countryId` = ?;\
					SELECT * FROM `postbacks` WHERE `affiliateId` = ? AND `eventId` = ?;\
					SELECT t.`id` FROM `conversions` AS t \
						LEFT JOIN `clicks` AS t2 ON t2.`id` = t.`clickId` \
						WHERE t.`eventId` = ? AND t2.`personId` = ? LIMIT 1;\
					SELECT t.`id` FROM `conversions` AS t \
						LEFT JOIN clicks AS t2 on t2.id = t.clickId \
						WHERE t.`eventId` = ? AND t2.`affiliateId` = ? AND t.`date` >= DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00');\
					SELECT * FROM `offers_pricing` \
						WHERE `offerId` = ? AND `countryId` = ? AND (`gender` = 0 OR `gender` = ?) AND `ageFrom` <= ? AND `ageTo` >= ?;", 
				[
					eventId, 
					advertiserId, 
					click.offerId, 
					click.offerId, 
					click.countryId, 
					click.affiliateId, 
					eventId, 
					eventId, 
					click.personId, 
					eventId, 
					click.affiliateId, 
					click.offerId, 
					click.countryId, 
					gender, 
					age, 
					age
				], 
				function(err, rows) {
					if (err) {
						console.log("Error in Conversions.addNew #2\n" + err);
						return reject("Internal error #2");
					}
					else if (rows[0].length == 0)
						return reject("Event not found");
					else {
						rows.push(click);
						return resolve(rows);
					}
				})
			})
		}).then(rows => {
			return new Promise((resolve, reject) => {
				const event = rows[0][0];
				const permitted_countries_list = rows[1];
				const conversion_country_check = rows[2];
				const postback = rows[3];
				const duplicate_conversion = rows[4];
				const affiliate_conversions = rows[5];
				const pricing = rows[6];
				const click = rows[7];
				
				// PAYOUT
				let payout = 0;
				if (event.regular || duplicate_conversion.length == 0)
					if (permitted_countries_list.length == 0 || conversion_country_check.length > 0)
						if (postback.length == 0 || postback[0].dailyLimit == 0 || postback[0].dailyLimit >= affiliate_conversions.length) {
							if(pricing.length > 0)
								payout = pricing[0].price;
							else if(data.payout > 0)
								payout = (data.payout / 100) * event.percent;
							else
								payout = event.price;
						}
				
				let comment = '';
				if(duplicate_conversion.length > 0)
					comment = 'duplicate';
				if(postback.length > 0 && postback[0].dailyLimit > 0 && affiliate_conversions.length > postback[0].dailyLimit)
					comment = 'limit exceeded';
				
				let query = '';
				if(postback.length > 0) {
					query = postback[0].query
						.replace('{click_id}', clickId)
						.replace('{person_id}', click.personId)
						.replace('{creative}', click.creativeId)
						.replace('{subaffiliate}', (click.subaffiliateId ? click.subaffiliateId : ''))
						.replace('{ip}', click.ip)
						.replace('{country}', click.country)
						.replace('{payout}', payout)
						.replace('{a1}', click.a1)
						.replace('{a2}', click.a2)
						.replace('{a3}', click.a3)
						.replace('{a4}', click.a4)
						.replace('{a5}', click.a5)
						.replace('{b1}', b1)
						.replace('{b2}', b2)
						.replace('{b3}', b3)
						.replace('{b4}', b4)
						.replace('{b5}', b5);
					
					if(click.custom_params) {
						click.custom_params = JSON.parse(click.custom_params);
						
						for (let prop in click.custom_params)
							query = query.replace('{' + prop + '}', click.custom_params[prop]);
					}
					
					if(postback[0].method == 'GET') {
						request.get({
							url: postback[0].url + '?' + query
						}, function (err, res, body) {
							if(err)
								console.log('Error send postback\n' + err);
							else
								console.log(body);
						});
					}
					else {
						const urlParams = new URLSearchParams(query);
						const params = Object.fromEntries(urlParams);
						
						request.post({
							url: postback[0].url, 
							form: params
						}, function(err, res, body){
							if(err)
								console.log('Error send postback\n' + err);
							else
								console.log(body);
						});
					}
					
					fs.appendFileSync("./public/postback.log", postback[0].url + '?' + query + "\n");
					db.query("INSERT INTO `postbacks_log` (`url`, `query`) VALUES (?, ?);", 
						[postback[0].url, query], 
					function(err, res) {
						if (err)
							console.log("Error in Conversions.addNew #3\n" + err);
					})
				}
				
				db.query("INSERT INTO `conversions` (\
						`advertiserId`, \
						`clickId`, \
						`eventId`, \
						`reward`, \
						`b1`, \
						`b2`, \
						`b3`, \
						`b4`, \
						`b5`, \
						`age`, \
						`gender`, \
						`payout`, \
						`comment` \
					) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", 
					[
						advertiserId, 
						clickId, 
						eventId, 
						payout, 
						b1, 
						b2, 
						b3, 
						b4, 
						b5, 
						age, 
						gender, 
						(data.payout ? data.payout : 0), 
						comment
					], 
				function(err, res){
					if (err) {
						console.log("Error in Conversions.addNew #4\n" + err);
						reject("Internal error #3");
					}
					else
						resolve(res.insertId);
				})
			})
		})
	}
}
