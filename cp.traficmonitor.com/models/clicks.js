'use strict';
const db = require('./db');

module.exports = {
	getList(data) {
		return new Promise((resolve, reject) => {
			data.page = parseInt(data.page);
			
			const re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
			
			if(!re.test(data.dateFrom) || !re.test(data.dateTo) || !data.page)
				reject("Error in Clicks.getList #1\n" + "Incorrect input data");
			else {
				const limit = 30;
				const offset = (data.page - 1) * limit;
			
				data.dateFrom = data.dateFrom.split("/").reverse().join("-") + " 00:00:00";
				data.dateTo = data.dateTo.split("/").reverse().join("-") + " 23:59:59";
				
				db.query('SELECT t.*, DATE_FORMAT(t.`date`, \'%d/%m/%Y %H:%i:%s\') AS date, \
					t2.`name` AS creativeName, t3.`name` AS subAffiliateName, \
					t5.`name` AS offerName, t6.`name` AS affiliateName \
					FROM `clicks` AS t \
					LEFT JOIN `creatives` AS t2 ON t2.`id` = t.`creativeId` \
					LEFT JOIN `subaffiliates` AS t3 ON t3.`id` = t.`subAffiliateId` \
					LEFT JOIN `offers` AS t5 ON t5.`id` = t.`offerId` \
					LEFT JOIN `users` AS t6 ON t6.`id` = t.`affiliateId` \
					WHERE (t.`affiliateId` = ? OR t5.`advertiserId` = ?) AND t.`date` >= ? AND t.`date` <= ? \
					ORDER BY t.`id` \
					DESC LIMIT ?, ?;', 
					[data.userId, data.userId, data.dateFrom, data.dateTo, offset, limit], 
				(err, rows) => {
					if (err)
						reject("Error in Clicks.getList #2\n" + err);
					else
						resolve(rows);
				});
			}
		})
	}, 
	
	getTotalInfo(data) {
		return new Promise((resolve, reject) => {
			const re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
			
			if(!re.test(data.dateFrom) || !re.test(data.dateTo))
				reject("Error in Clicks.getTotalInfo #1\n" + "Incorrect input data");
			else {
				data.dateFrom = data.dateFrom.split("/").reverse().join("-") + " 00:00:00";
				data.dateTo = data.dateTo.split("/").reverse().join("-") + " 23:59:59";
				
				db.query("SELECT COUNT(t.`id`) AS clicks \
					FROM `clicks` AS t \
					LEFT JOIN `creatives` AS t2 ON t2.`id` = t.`creativeId` \
					LEFT JOIN `subaffiliates` AS t3 ON t3.`id` = t.`subAffiliateId` \
					LEFT JOIN `offers` AS t5 ON t5.`id` = t.`offerId` \
					WHERE (t.`affiliateId` = ? OR t5.`advertiserId` = ?) AND t.`date` >= ? AND t.`date` <= ?; \
					SELECT t.`id` \
					FROM `clicks` AS t \
					LEFT JOIN `creatives` AS t2 ON t2.`id` = t.`creativeId` \
					LEFT JOIN `subaffiliates` AS t3 ON t3.`id` = t.`subAffiliateId` \
					LEFT JOIN `offers` AS t5 ON t5.`id` = t.`offerId` \
					WHERE (t.`affiliateId` = ? OR t5.`advertiserId` = ?) AND t.`date` >= ? AND t.`date` <= ? \
                    GROUP BY t.`personId`;", 
					[data.userId, data.userId, data.dateFrom, data.dateTo, data.userId, data.userId, data.dateFrom, data.dateTo], 
				(err, rows) => {
					if (err)
						reject("Error in Clicks.getTotalInfo #2\n" + err);
					else
						resolve({clicks: (rows[0].length ? rows[0][0].clicks : 0), persons: rows[1].length});
				});
			}
		})
	}, 
	
	getListForAffiliate(data) {
		return new Promise((resolve, reject) => {
			data.page = parseInt(data.page);
			
			const re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
			
			if(!re.test(data.dateFrom) || !re.test(data.dateTo) || !data.page)
				reject("Error in Clicks.getListForAffiliate #1\n" + "Incorrect input data");
			else {
				const limit = 30;
				const offset = (data.page - 1) * limit;
			
				data.dateFrom = data.dateFrom.split("/").reverse().join("-") + " 00:00:00";
				data.dateTo = data.dateTo.split("/").reverse().join("-") + " 23:59:59";
				
				db.query('SELECT t.*, DATE_FORMAT(t.`date`, \'%d/%m/%Y %H:%i:%s\') AS date, \
					t2.`name` AS creativeName, t3.`name` AS subAffiliateName, \
					t5.`name` AS offerName, t6.`name` AS affiliateName \
					FROM `clicks` AS t \
					LEFT JOIN `creatives` AS t2 ON t2.`id` = t.`creativeId` \
					LEFT JOIN `subaffiliates` AS t3 ON t3.`id` = t.`subAffiliateId` \
					LEFT JOIN `offers` AS t5 ON t5.`id` = t.`offerId` \
					LEFT JOIN `users` AS t6 ON t6.`id` = t.`affiliateId` \
					WHERE t.`affiliateId` = ? AND t.`date` >= ? AND t.`date` <= ? \
					ORDER BY t.`id` \
					DESC LIMIT ?, ?;', 
					[data.userId, data.dateFrom, data.dateTo, offset, limit], 
				(err, rows) => {
					if (err)
						reject("Error in Clicks.getListForAffiliate #2\n" + err);
					else
						resolve(rows);
				});
			}
		})
	}, 
	
	getTotalInfoForAffiliate(data) {
		return new Promise((resolve, reject) => {
			const re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
			
			if(!re.test(data.dateFrom) || !re.test(data.dateTo))
				reject("Error in Clicks.getTotalInfoForAffiliate #1\n" + "Incorrect input data");
			else {
				data.dateFrom = data.dateFrom.split("/").reverse().join("-") + " 00:00:00";
				data.dateTo = data.dateTo.split("/").reverse().join("-") + " 23:59:59";
				
				db.query("SELECT COUNT(t.`id`) AS clicks \
					FROM `clicks` AS t \
					LEFT JOIN `creatives` AS t2 ON t2.`id` = t.`creativeId` \
					LEFT JOIN `subaffiliates` AS t3 ON t3.`id` = t.`subAffiliateId` \
					LEFT JOIN `offers` AS t5 ON t5.`id` = t.`offerId` \
					WHERE t.`affiliateId` = ? AND t.`date` >= ? AND t.`date` <= ?; \
					SELECT t.`id` \
					FROM `clicks` AS t \
					LEFT JOIN `creatives` AS t2 ON t2.`id` = t.`creativeId` \
					LEFT JOIN `subaffiliates` AS t3 ON t3.`id` = t.`subAffiliateId` \
					LEFT JOIN `offers` AS t5 ON t5.`id` = t.`offerId` \
					WHERE t.`affiliateId` = ? AND t.`date` >= ? AND t.`date` <= ? \
                    GROUP BY t.`personId`;", 
					[data.userId, data.dateFrom, data.dateTo, data.userId, data.dateFrom, data.dateTo], 
				(err, rows) => {
					if (err)
						reject("Error in Clicks.getTotalInfoForAffiliate #2\n" + err);
					else
						resolve({clicks: (rows[0].length ? rows[0][0].clicks : 0), persons: rows[1].length});
				});
			}
		})
	}
}