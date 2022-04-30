'use strict';

const db = require('./db');

module.exports = {
	getList(data) {
		return new Promise((resolve, reject) => {
			const limit = 20;
			const offset = (data.page - 1) * limit;
			
			db.query('SELECT t.id AS personId, \
				t2.country, DATE_FORMAT(t2.`date`, \'%d/%m/%Y %H:%i:%s\') AS date, \
				t3.`name` AS offerName, \
				t4.`name` AS affiliateName, \
				t5.`name` AS creativeName, \
				t6.`name` AS subaffiliateName, \
				GROUP_CONCAT(t7.eventId) AS events \
				FROM `persons` AS t \
				LEFT JOIN clicks AS t2 ON t2.personId = t.id \
				LEFT JOIN offers AS t3 ON t3.id = t2.offerId \
				LEFT JOIN users AS t4 ON t4.id = t2.affiliateId \
				LEFT JOIN creatives AS t5 ON t5.id = t2.creativeId \
				LEFT JOIN subaffiliates AS t6 ON t6.id = t2.subAffiliateId \
				LEFT JOIN conversions AS t7 ON t7.clickId = t2.id \
				WHERE t2.offerId = ? AND t3.`advertiserId` = ? \
				GROUP BY t.id \
				ORDER BY `t`.`id` DESC, `t7`.`date` ASC \
				LIMIT ?, ?', 
				[data.offerId, data.userId, offset, limit], 
			(err, rows) => {
				if (err)
					reject("Error in Leads.getList #1\n" + err);
				else {
					for(var i=0; i<rows.length; i++)
						rows[i].events = rows[i].events ? rows[i].events.split(',') : [];
					
					resolve(rows);
				}
			});
		})
	}
}