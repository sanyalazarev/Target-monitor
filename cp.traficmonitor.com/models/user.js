const path = require('path');
const fs = require('fs');
const im = require('imagemagick');
const bcrypt = require('bcrypt');

const db = require('./db');
const Helper = require('./helper');
const STATUS = require('./status');

module.exports = {
	getList(data) {
		return new Promise((resolve, reject) => {
			const limit = 100;
			const offset = (data.page - 1) * limit;

			const searchVal = data.search ? data.search.trim() : false;
			let searchSql = '', 
				orderSql = '';

			if (searchVal) {
				if (+searchVal)
					searchSql = 'user.id = ' + db.escape(+searchVal);
				else
					searchSql = 'user.userNickname LIKE ' + db.escape("%" + searchVal + "%");
			}

			db.query('SELECT * FROM `users` AS user\
				' + (searchSql ? 'WHERE ' + searchSql : '') + '\
				' + (orderSql ? 'ORDER BY ' + searchSql : '') + '\
				LIMIT ?, ?;', 
			[offset, limit], 
			(err, rows) => {
				if (err)
					reject("Error in User.getList #1\n" + err);
				else
					resolve({ users: rows });
			});
		})
	},
	
	getById: function (data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `users` WHERE `id` = ?;", [data.userId], function (err, rows) {
				if (err)
					reject('Error in User.getById #1\n' + err);
				else if (rows.length > 0) {
					var res = { "user": rows[0] };

					resolve(res);
				}
				else
					reject('Error in User.getById #2\nUser is not found.');
			});
		})
	},
	
	add: function (data) {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO `users` (`name`) VALUES ('')", (err, res) => {
				if (err)
					reject('Error in User.add #1\n' + err);
				else {
					data.userId = res.insertId
					resolve(data);
				}
			});
		})
	},

	edit: function (data) {
		var self = this;
		
		return new Promise((resolve, reject) => {
			var sql = "";
			var table = "";
			var updateFields = [];
			var allowableFields = [
				'email',
				'name',
				'phone', 
				'role'
			];

			for (var key in data) {
				if (allowableFields.indexOf(key) != -1)
					updateFields.push("`" + key + "` = " + db.escape(data[key]));
			}
			// if (data.userRegion) this.addUserRegion(data.userRegion, data.userId);

			if (data.password)
				self.updatePassword(data.userId, data.password);

			if (data.photo) {
				var pathinfo = path.parse(data.photo);
				var imgPathSite = pathinfo.dir + "/" + pathinfo.name + "_thumb" + pathinfo.ext;
				var imgPath = "./public" + imgPathSite;

				data.crop = data.crop.split(",");

				im.convert(["./public" + data.photo, '-crop', data.crop[2] + "x" + data.crop[3] + "+" + data.crop[0] + "+" + data.crop[1], imgPath], function (err, stdout) {
					if (err)
						reject("Error in User.edit #1\n" + err);
					else {
						if (data.crop[2] > 300 || data.crop[3] > 300) {
							im.convert([imgPath, '-resize', '300x300', imgPath], function (err, stdout) {
								if (err)
									reject("Error in User.edit #2\n" + err);
							});
						}

						db.query("UPDATE `users` SET `image` = ? WHERE `id` = ?;", [imgPathSite, data.userId], function (err, rows) {
							if (err)
								reject("Error in User.edit #3\n" + err);
						});
					}
				});
			}

			sql += "UPDATE `users` SET " + updateFields.join(", ") + " WHERE `id` = " + data.userId + ";"

			db.query(sql, function (err, res) {
				if (err)
					reject("Error in User.edit #4\n" + err);
				else
					resolve();
			});
		});
	}, 
	
	updatePassword: function (userId, password) {
		bcrypt.genSalt(10, function(err, salt) {
			if(err)
				console.log("Error in User.updatePassword #1\n" + err);
			else {
				bcrypt.hash(password, salt, function(err, hash) {
					if(err)
						console.log("Error in User.updatePassword #2\n" + err);
					else {
						db.query("UPDATE `users` SET `password` = ? WHERE `id` = ?;", 
							[hash, userId], 
						function(err, res) {
							if(err)
								console.log("Error in User.updatePassword #3\n" + err);
						})
					}
				});
			}
		});
	}, 
	
	uploadImage: function (data, send) {
		var self = this;

		var filename = data.image.name.split(".");
		var ext = filename[filename.length - 1];

		const maxImageWidth = 600;
		const maxImageHeight = 600;

		if (["jpg", "jpeg", "png"].indexOf(ext.toLowerCase()) != -1) {
			var time = (new Date()).getTime();

			var path = "./public/uploads/avatars/";
			var pathSite = "/uploads/avatars/";

			var imageName = data.userId + "_" + time + "." + ext;
			var imagePath = path + imageName;

			fs.writeFile(imagePath, data.image.data, function (err) {
				im.identify(imagePath, function (err, features) {
					if (err) {
						console.log("Error in User.uploadImage #1\n" + err);
						send({ error: "Error image identify." });
					}
					else if (features.width > maxImageWidth || features.height > maxImageHeight) {
						const opt = {
							srcPath: imagePath,
							dstPath: imagePath
						};

						if ((maxImageWidth / maxImageHeight) > (features.width / features.height))
							opt.height = maxImageHeight;
						else
							opt.width = maxImageWidth;

						im.resize(opt, function (err, stdout, stderr) {
							if (err) {
								console.log("Error in User.uploadImage #2\n" + err);
								send({ error: "Error image resize." });
							}
							else {
								im.identify(imagePath, function (err, features) {
									if (err) {
										console.log("Error in User.uploadImage #3\n" + err);
										send({ error: "Error image identify." });
									}
									else
										self.saveImage({ error: false, userId: data.userId, image: pathSite + imageName, width: features.width, height: features.height }, send);
								});
							}
						});
					}
					else
						self.saveImage({ error: false, userId: data.userId, image: pathSite + imageName, width: features.width, height: features.height }, send);
				});
			});
		}
		else {
			console.log("Error in User.uploadImage #4\nWrong image format![" + data.image.name + "]");
			send({ error: "Wrong image format! Only *.jpg, *.png." });
		}
	},

	saveImage: function (data, send) {
		db.query("UPDATE `users` SET `image` = ? WHERE `id` = ?", [data.image, data.userId], function (err, res) {
			if (err) {
				console.log("Error in User.saveImage #1\n" + err);
				send({ error: "Error save image." });
			}
			else
				send(data);
		});
	},

	remove: function (data) {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM `users` WHERE `id` = ?;\
				DELETE FROM `users` WHERE id = ?;", [data.userId, data.userId], 
			(err, res) => {
				if (err)
					reject('Error in User.remove #1\n' + err);
				else {
					if(res[0].length && res[0][0].image && res[0][0].image != "/uploads/avatars/no_photo.png")
						fs.unlinkSync("public" + res[0][0].image);
					
					resolve({ userId: data.userId });
				}
			});
		})
	}
};