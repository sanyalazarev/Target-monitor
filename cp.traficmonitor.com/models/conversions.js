'use strict';
const db = require('./db');

module.exports = {
	getAll(data) {
		return new Promise((resolve, reject) => {
			const re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
			
			if(!re.test(data.dateFrom) || !re.test(data.dateTo))
				reject("Error in Conversions.getAll #1\n" + "Incorrect input data");
			else {
				data.dateFrom = data.dateFrom.split("/").reverse().join("-") + " 00:00:00";
				data.dateTo = data.dateTo.split("/").reverse().join("-") + " 23:59:59";
				
				db.query('SELECT t.`id`, \
						t.`clickId`, \
						t3.`personId`, \
						t6.`name` AS offer, \
						t7.`name` AS affiliate, \
						t2.`name` AS goal, \
						t4.`name` AS creative, \
						t5.`name` AS subAffiliate, \
						t3.`ip`, \
						t3.`country`, \
						t.`comment`, \
						CONCAT(t.`reward`, \'$\') AS payout, \
						t.`b1`, \
						t.`b2`, \
						t.`b3`, \
						t.`b4`, \
						t.`b5`, \
						DATE_FORMAT(t3.`date`, \'%d/%m/%Y %H:%i:%s\') AS clickDate, \
						DATE_FORMAT(t.`date`, \'%d/%m/%Y %H:%i:%s\') AS goalDate \
					FROM `conversions` AS t \
					LEFT JOIN `events` AS t2 ON t2.`id` = t.`eventId` \
					LEFT JOIN `clicks` AS t3 ON t3.`id` = t.`clickId` \
					LEFT JOIN `creatives` AS t4 ON t4.`id` = t3.`creativeId` \
					LEFT JOIN `subaffiliates` AS t5 ON t5.`id` = t3.`subAffiliateId` \
					LEFT JOIN `offers` AS t6 ON t6.`id` = t3.`offerId` \
					LEFT JOIN `users` AS t7 ON t7.`id` = t3.`affiliateId` \
					WHERE (t.`advertiserId` = ? OR t3.`affiliateId` = ?) AND t.`date` >= ? AND t.`date` <= ? \
					ORDER BY t.`id`;', 
					[data.userId, data.userId, data.dateFrom, data.dateTo], 
				(err, rows) => {
					if (err)
						reject("Error in Conversions.getAll #2\n" + err);
					else
						resolve(rows);
				});
			}
		})
	}, 
	
	getList(data) {
		return new Promise((resolve, reject) => {
			data.page = parseInt(data.page);
			
			const re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
			
			if(!re.test(data.dateFrom) || !re.test(data.dateTo) || !data.page)
				reject("Error in Conversions.getList #1\n" + "Incorrect input data");
			else {
				const limit = 30;
				const offset = (data.page - 1) * limit;
			
				data.dateFrom = data.dateFrom.split("/").reverse().join("-") + " 00:00:00";
				data.dateTo = data.dateTo.split("/").reverse().join("-") + " 23:59:59";
				
				db.query('SELECT t.*, DATE_FORMAT(t.`date`, \'%d/%m/%Y %H:%i:%s\') AS date, t2.`name` AS eventName, \
						t3.`affiliateId`, t3.`offerId`, t3.`personId`, DATE_FORMAT(t3.`date`, \'%d/%m/%Y %H:%i:%s\') AS clickDate, t3.`ip`, t3.`country`, \
						t4.`name` AS creativeName, t5.`name` AS subAffiliateName, \
						t6.`name` AS offerName, t7.`name` AS affiliateName\
					FROM `conversions` AS t \
					LEFT JOIN `events` AS t2 ON t2.`id` = t.`eventId` \
					LEFT JOIN `clicks` AS t3 ON t3.`id` = t.`clickId` \
					LEFT JOIN `creatives` AS t4 ON t4.`id` = t3.`creativeId` \
					LEFT JOIN `subaffiliates` AS t5 ON t5.`id` = t3.`subAffiliateId` \
					LEFT JOIN `offers` AS t6 ON t6.`id` = t3.`offerId` \
					LEFT JOIN `users` AS t7 ON t7.`id` = t3.`affiliateId` \
					WHERE (t.`advertiserId` = ? OR t3.`affiliateId` = ?) AND t.`date` >= ? AND t.`date` <= ? \
					ORDER BY t.`id` \
					DESC LIMIT ?, ?;', 
					[data.userId, data.userId, data.dateFrom, data.dateTo, offset, limit], 
				(err, rows) => {
					if (err)
						reject("Error in Conversions.getList #2\n" + err);
					else
						resolve(rows);
				});
			}
		})
	}, 
	
	getAllForAffiliate(data) {
		return new Promise((resolve, reject) => {
			const re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
			
			if(!re.test(data.dateFrom) || !re.test(data.dateTo))
				reject("Error in Conversions.getListForAffiliate #1\n" + "Incorrect input data");
			else {
				data.dateFrom = data.dateFrom.split("/").reverse().join("-") + " 00:00:00";
				data.dateTo = data.dateTo.split("/").reverse().join("-") + " 23:59:59";
				
				db.query('SELECT t.`id`, \
						t.`clickId`, \
						t3.`personId`, \
						t6.`name` AS offer, \
						t2.`name` AS goal, \
						t4.`name` AS creative, \
						t5.`name` AS subAffiliate, \
						t3.`ip`, \
						t3.`country`, \
						t.`comment`, \
						CONCAT(t.`reward`, \'$\') AS payout, \
						t.`b1`, \
						t.`b2`, \
						t.`b3`, \
						t.`b4`, \
						t.`b5`, \
						DATE_FORMAT(t3.`date`, \'%d/%m/%Y %H:%i:%s\') AS clickDate, \
						DATE_FORMAT(t.`date`, \'%d/%m/%Y %H:%i:%s\') AS goalDate \
				FROM `conversions` AS t \
				LEFT JOIN `events` AS t2 ON t2.`id` = t.`eventId` \
				LEFT JOIN `clicks` AS t3 ON t3.`id` = t.`clickId` \
				LEFT JOIN `creatives` AS t4 ON t4.`id` = t3.`creativeId` \
				LEFT JOIN `subaffiliates` AS t5 ON t5.`id` = t3.`subAffiliateId` \
				LEFT JOIN `offers` AS t6 ON t6.`id` = t3.`offerId` \
				WHERE t3.`affiliateId` = ? AND t.`date` >= ? AND t.`date` <= ? \
				ORDER BY t.`id`;', 
					[data.userId, data.dateFrom, data.dateTo], 
				(err, rows) => {
					if (err)
						reject("Error in Conversions.getListForAffiliate #2\n" + err);
					else
						resolve(rows);
				});
			}
		})
	}, 
	
	getListForAffiliate(data) {
		return new Promise((resolve, reject) => {
			data.page = parseInt(data.page);
			
			const re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
			
			if(!re.test(data.dateFrom) || !re.test(data.dateTo) || !data.page)
				reject("Error in Conversions.getListForAffiliate #1\n" + "Incorrect input data");
			else {
				const limit = 100;
				const offset = (data.page - 1) * limit;
			
				data.dateFrom = data.dateFrom.split("/").reverse().join("-") + " 00:00:00";
				data.dateTo = data.dateTo.split("/").reverse().join("-") + " 23:59:59";
				
				db.query('SELECT t.*, DATE_FORMAT(t.`date`, \'%d/%m/%Y %H:%i:%s\') AS date, t2.`name` AS eventName, \
					t3.`affiliateId`, t3.`offerId`, t3.`personId`, DATE_FORMAT(t3.`date`, \'%d/%m/%Y %H:%i:%s\') AS clickDate, t3.`ip`, t3.`country`, \
					t4.`name` AS creativeName, t5.`name` AS subAffiliateName, \
					t6.`name` AS offerName\
				FROM `conversions` AS t \
				LEFT JOIN `events` AS t2 ON t2.`id` = t.`eventId` \
				LEFT JOIN `clicks` AS t3 ON t3.`id` = t.`clickId` \
				LEFT JOIN `creatives` AS t4 ON t4.`id` = t3.`creativeId` \
				LEFT JOIN `subaffiliates` AS t5 ON t5.`id` = t3.`subAffiliateId` \
				LEFT JOIN `offers` AS t6 ON t6.`id` = t3.`offerId` \
				WHERE t3.`affiliateId` = ? AND t.`date` >= ? AND t.`date` <= ? \
				ORDER BY t.`id` \
				DESC LIMIT ?, ?;', 
					[data.userId, data.dateFrom, data.dateTo, offset, limit], 
				(err, rows) => {
					if (err)
						reject("Error in Conversions.getListForAffiliate #2\n" + err);
					else
						resolve(rows);
				});
			}
		})
	}, 
	
	getSumPayoutForAffiliate(data) {
		return new Promise((resolve, reject) => {
			const re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
			
			if(!re.test(data.dateFrom) || !re.test(data.dateTo))
				reject("Error in Conversions.getSumPayout #1\n" + "Incorrect input data");
			else {
				data.dateFrom = data.dateFrom.split("/").reverse().join("-") + " 00:00:00";
				data.dateTo = data.dateTo.split("/").reverse().join("-") + " 23:59:59";
				
				db.query("SELECT SUM(t.`reward`) AS sum_payout \
						FROM `conversions` AS t \
						LEFT JOIN `events` AS t2 ON t2.`id` = t.`eventId` \
						LEFT JOIN `clicks` AS t3 ON t3.`id` = t.`clickId` \
						WHERE t3.`affiliateId` = ? AND t.`date` >= ? AND t.`date` <= ?", 
					[data.userId, data.dateFrom, data.dateTo], 
				(err, rows) => {
					if (err)
						reject("Error in Conversions.getSumPayout #2\n" + err);
					else
						resolve(rows.length ? rows[0].sum_payout : 0);
				});
			}
		})
	}, 
	
	removePerson(data){
		data.personId = parseInt(data.personId);
		
		return new Promise((resolve, reject) => {
			db.query("DELETE FROM `conversions` WHERE `clickId` IN (SELECT `id` FROM `clicks` WHERE `personId` = ?);\
				DELETE FROM `clicks` WHERE `personId` = ?;\
				DELETE FROM `persons` WHERE `id` = ?;", 
				[data.personId, data.personId, data.personId], 
			(err, rows) => {
				if (err)
					reject("Error in Conversions.removePerson #1\n" + err);
				else
					resolve();
			})
		})
	}
}