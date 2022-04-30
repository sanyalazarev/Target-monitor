'use strict';

const db = require('./db');

module.exports = {
	getList(data) {
		return new Promise((resolve, reject) => {
			data.page = parseInt(data.page);
			
			const re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
			
			if(!re.test(data.dateFrom) || !re.test(data.dateTo) || !data.page)
				reject("Error in Leads.getList #1\n" + "Incorrect input data");
			else {
				const limit = 30;
				const offset = (data.page - 1) * limit;
			
				data.dateFrom = data.dateFrom.split("/").reverse().join("-") + " 00:00:00";
				data.dateTo = data.dateTo.split("/").reverse().join("-") + " 23:59:59";
				
				db.query('SELECT t.id AS personId, \
					t2.country, DATE_FORMAT(MAX(`t7`.`date`), \'%d/%m/%Y %H:%i:%s\') AS date, \
					GROUP_CONCAT(t2.subAffiliateId) AS subaffid, \
					t3.`name` AS offerName, \
					t4.`name` AS affiliateName, \
					t5.`name` AS creativeName, \
					GROUP_CONCAT(t6.`name`) AS subAffiliateName, \
					SUM(t7.`reward`) AS reward, \
					GROUP_CONCAT(t8.name) AS events \
					FROM `persons` AS t \
					LEFT JOIN clicks AS t2 ON t2.personId = t.id \
					LEFT JOIN offers AS t3 ON t3.id = t2.offerId \
					LEFT JOIN users AS t4 ON t4.id = t2.affiliateId \
					LEFT JOIN creatives AS t5 ON t5.id = t2.creativeId \
					LEFT JOIN subaffiliates AS t6 ON t6.id = t2.subAffiliateId \
					LEFT JOIN conversions AS t7 ON t7.clickId = t2.id \
					LEFT JOIN events AS t8 ON t8.id = t7.eventId \
					WHERE t3.`advertiserId` = ? AND t7.`id` IS NOT NULL AND t7.`date` >= ? AND t7.`date` <= ? \
					GROUP BY t.id \
					ORDER BY MAX(`t7`.`date`) DESC \
					LIMIT ?, ?', 
					[data.userId, data.dateFrom, data.dateTo, offset, limit], 
				(err, rows) => {
					if (err)
						reject("Error in Leads.getList #1\n" + err);
					else {
						for(var i=0; i<rows.length; i++) {
							rows[i].events = rows[i].events ? rows[i].events.split(',') : [];
							
							rows[i].events = rows[i].events.filter(function (value, index, array) { 
								return array.indexOf(value) === index;
							});
							
							rows[i].subAffiliateName = rows[i].subAffiliateName ? rows[i].subAffiliateName.split(',') : [];
							
							rows[i].subAffiliateName = rows[i].subAffiliateName.filter(function (value, index, array) { 
								return array.indexOf(value) === index;
							});
						}
						
						resolve(rows);
					}
				});
			}
		})
	}, 
	
	getListForAffiliate(data) {
		return new Promise((resolve, reject) => {
			data.page = parseInt(data.page);
			
			const re = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
			
			if(!re.test(data.dateFrom) || !re.test(data.dateTo) || !data.page)
				reject("Error in Leads.getListForAffiliate #1\n" + "Incorrect input data");
			else {
				const limit = 30;
				const offset = (data.page - 1) * limit;
			
				data.dateFrom = data.dateFrom.split("/").reverse().join("-") + " 00:00:00";
				data.dateTo = data.dateTo.split("/").reverse().join("-") + " 23:59:59";
				
				db.query('SELECT t.id AS personId, \
					t2.country, DATE_FORMAT(MAX(`t7`.`date`), \'%d/%m/%Y %H:%i:%s\') AS date, \
					t3.`name` AS offerName, \
					t4.`name` AS affiliateName, \
					t5.`name` AS creativeName, \
					GROUP_CONCAT(t6.`name`) AS subAffiliateName, \
					SUM(t7.`reward`) AS reward, \
					GROUP_CONCAT(t8.name) AS events \
					FROM `persons` AS t \
					LEFT JOIN clicks AS t2 ON t2.personId = t.id \
					LEFT JOIN offers AS t3 ON t3.id = t2.offerId \
					LEFT JOIN users AS t4 ON t4.id = t2.affiliateId \
					LEFT JOIN creatives AS t5 ON t5.id = t2.creativeId \
					LEFT JOIN subaffiliates AS t6 ON t6.id = t2.subAffiliateId \
					LEFT JOIN conversions AS t7 ON t7.clickId = t2.id \
					LEFT JOIN events AS t8 ON t8.id = t7.eventId \
					WHERE t2.`affiliateId` = ? AND t7.`id` IS NOT NULL AND t7.`date` >= ? AND t7.`date` <= ? \
					GROUP BY t.id \
					ORDER BY MAX(`t7`.`date`) DESC \
					LIMIT ?, ?', 
					[data.userId, data.dateFrom, data.dateTo, offset, limit], 
				(err, rows) => {
					if (err)
						reject("Error in Leads.getListForAffiliate #2\n" + err);
					else {
						for(var i=0; i<rows.length; i++) {
							rows[i].events = rows[i].events ? rows[i].events.split(',') : [];
							
							rows[i].events = rows[i].events.filter(function (value, index, array) { 
								return array.indexOf(value) === index;
							});
							
							rows[i].subAffiliateName = rows[i].subAffiliateName ? rows[i].subAffiliateName.split(',') : [];
							
							rows[i].subAffiliateName = rows[i].subAffiliateName.filter(function (value, index, array) { 
								return array.indexOf(value) === index;
							});
						}
						
						resolve(rows);
					}
				});
			}
		})
	}
}