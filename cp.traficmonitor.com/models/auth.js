const bcrypt = require('bcrypt');

const db = require('./db');
const Helper = require('./helper');
// const User = require('./user');

module.exports = {
	isLogin: function (req, res, next){
		let userId;

		if(req.cookies.hash && (userId = Helper.getIdByHash(req.cookies.hash))) {
			db.query("SELECT `id`, `name`, `role` FROM `users` WHERE `id` = ?;", [userId], 
			function(err, rows){
				if(err || rows.length == 0) {
					console.log("Error authenticate userId = " + userId + "\n");
					return res
						.clearCookie('hash')
						.cookie('requestedPage', req.path, {maxAge: (86400 * 1000)})
						.redirect('/login');
				}
				else {
					const user = rows[0];

					// User.updateActiveTime(user.userId);
					
					res.locals.userId = user.id;
					res.locals.userName = user.name;
					res.locals.userRole = user.role;
					
					global.userRole = user.role;
					
					next();
				}
			});
		}
		else {
			return res
				.cookie('requestedPage', req.path, {maxAge: (86400 * 1000)})
				.redirect('/login');
		}
	}, 
	
	userLogin: async function (data, send) {
		return new Promise((resolve, reject) => {
			db.query("SELECT `id`, `password` FROM `users` WHERE `email` LIKE ?;", [data.email], function(err, rows){
				if(err)
					reject({error: "Internal error."});
				else if(rows.length == 0)
					reject({error: "Wrong email or password."});
				else
					resolve(rows[0]);
			});
		}).then(user => {
			return new Promise((resolve, reject) => {
				bcrypt.compare(data.pass, user.password, function(err, result) {
					if(result) 
						resolve({
							error: false, 
							hash: Helper.getHashById(user.id)
						})
					else
						reject({error: "Wrong email or password."});
				});
			})
		})
	}
};