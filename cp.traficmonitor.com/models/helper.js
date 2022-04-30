'use strict';

module.exports = {
	getHashById: function (str) {
		var reg = /^[0-9]+$/gim;
		if (reg.test(str)) {
			var n = Math.floor(Math.random() * (999999999 - 100000000)) + 100000000;
			str = str * n;
			str = n.toString().substr(5) + str + n.toString().substr(0, 5);
			var strLen = str.length;

			n = Math.floor(Math.random() * (strLen - (strLen - 7))) + (strLen - 7);
			var abc = "abcdefghijklmnopqrstuvwxyz";
			var abcLen = abc.length;
			for (var i = 0; i < n; i++) {
				var abcN = Math.floor(Math.random() * abcLen);
				var pos = Math.floor(Math.random() * strLen);
				str = str.substr(0, pos) + abc[abcN] + str.substr(pos);
			}
			return str;
		}
		else
			return false;
	},

	getIdByHash: function (str) {
		if (str) {
			str = str.replace(/[^0-9]+/ig, "");
			var l = str.length;
			var n = str.substr(l - 5) + str.substr(0, 4);
			str = str.substr(4, (l - 9));
			str = str / n;

			var reg = /^[0-9]+$/gim;
			if (reg.test(str))
				return str;
			else
				return false;
		}
		else
			return false;
	},

	getDateTimeSince: function (target) {
		// check if time exists
		if ((typeof target === 'string' && target.includes('0000-00-00')) || target === null || target === undefined) {
			return global.lang.lHelpOffline
		}

		var now = new Date(), diff, yd, md, dd, hd, nd, sd, out, str;

		diff = Math.floor((now.getTime() - target.getTime()) / 1000);

		if (diff > 31536000) {
			yd = Math.floor(diff / 31536000);
			diff = diff - (yd * 31536000);
		}

		if (diff > 86400) {
			dd = Math.floor(diff / 86400);
			diff = diff - (dd * 86400);
		}

		if (diff > 3600) {
			hd = Math.floor(diff / 3600);
			diff = diff - (hd * 3600);
		}

		if (diff > 60) {
			nd = Math.floor(diff / 60);
			diff = diff - (nd * 60);
		}

		if (yd > 0) {
			var k = yd % 10;
			if (k === 1 && yd !== 11)
				str = global.lang.lHelpYear;
			else if (k > 1 && k < 5)
				str = global.lang.lHelpYear14;
			else
				str = global.lang.lHelpYearMany;
			out = yd + " " + str;
		}
		else if (md > 0) {
			var k = md % 10;
			if (k === 1 && md !== 11)
				str = global.lang.lHelpMonth;
			else if (k > 1 && k < 5)
				str = global.lang.lHelpMonth14;
			else
				str = global.lang.lHelpMonthMany;
			out = md + " " + str;
		}
		else if (dd > 0) {
			var k = dd % 10;
			if (k === 1 && dd !== 11)
				str = global.lang.lHelpDay;
			else if (k > 1 && k < 5)
				str = global.lang.lHelpDay14;
			else
				str = global.lang.lHelpDayMany;
			out = dd + " " + str;
		}
		else if (hd > 0) {
			var k = hd % 10;
			if (k === 1 && hd !== 11)
				str = global.lang.lHelpHour;
			else if (k > 1 && k < 5)
				str = global.lang.lHelpHour14;
			else
				str = global.lang.lHelpHourMany;
			out = hd + " " + str;
		}
		else if (nd > 10) {
			var k = nd % 10;
			if (k === 1 && nd !== 11)
				str = global.lang.lHelpMinute;
			else if (k > 1 && k < 5)
				str = global.lang.lHelpMinute14;
			else
				str = global.lang.lHelpMinuteMany;
			out = nd + " " + str;
		}
		else
			out = "online";

		return (out != "online") ? out + global.lang.lHelpAgo : global.lang.lHelpOnline;
	},

	getAge: function (birthDate) {
		// check if time exists
		if ((typeof birthDate === 'string' && birthDate.includes('0000-00-00')) || birthDate === null || birthDate === undefined) {
			return 0
		}

		var today = new Date();
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
			age--;
		
		return age;
	}
};