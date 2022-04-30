'use strict';

const db = require('./db');

module.exports = {
	getAll(data) {
		return new Promise((resolve, reject) => {
			db.query('SELECT * FROM `countries`;', (err, rows) => {
				if (err)
					reject("Error in Countries.geAll #1\n" + err);
				else
					resolve(rows);
			});
		})
	}
}