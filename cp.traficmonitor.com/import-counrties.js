const db = require('./models/db');

const cntrs = ["Afghanistan", 
"Algeria", 
"Angola", 
"Argentina", 
"Australia", 
"Bahamas", 
"Belgium", 
"Bosnia and Herzegovina", 
"Brazil", 
"Bulgaria", 
"Canada", 
"China", 
"Colombia", 
"Croatia", 
"Cyprus", 
"Denmark", 
"Dominican Republic", 
"Egypt", 
"El Salvador", 
"Estonia", 
"Finland", 
"France", 
"Germany", 
"Greece", 
"Hungary", 
"Iceland", 
"India", 
"Indonesia", 
"Ireland", 
"Israel", 
"Italy", 
"Jersey", 
"Jordan", 
"Korea, Republic of", 
"Kuwait", 
"Kyrgyzstan", 
"Latvia", 
"Lebanon", 
"Lithuania", 
"Luxembourg", 
"Malaysia", 
"Mexico", 
"Morocco", 
"Netherlands", 
"New Zealand", 
"Norway", 
"Pakistan", 
"Panama", 
"Peru", 
"Philippines", 
"Poland", 
"Portugal", 
"Puerto Rico", 
"Qatar", 
"Romania", 
"Saudi Arabia", 
"Serbia", 
"Singapore", 
"Slovakia", 
"Slovenia", 
"South Africa", 
"Spain", 
"Sweden", 
"Switzerland", 
"Thailand", 
"Tunisia", 
"Turkey", 
"Ukraine", 
"United Arab Emirates", 
"United Kingdom of Great Britain and Northern Ireland", 
"United States of America", 
"Viet Nam"];

function getCountryByName(name) {
	return new Promise((resolve, reject) => {
		db.query("SELECT * FROM `countries` WHERE `name` LIKE ?", [name], (err, rows) => {
			if (err)
				reject("Error in getCountryByName #1\n" + err);
			else
				resolve(rows);
		});
	})
}

function addCountry(name) {
	return new Promise((resolve, reject) => {
		db.query("INSERT INTO `countries` (`name`) VALUES (?);", [name], (err, res) => {
			if (err)
				reject("Error in addCountry #1\n" + err);
			else
				resolve(res);
		});
	})
}
	
async function start() {
	for(var i=0; i<cntrs.length; i++) {
		row = await getCountryByName(cntrs[i]);
		if(row.length == 0)
			row = await addCountry(cntrs[i]);
		console.log(row);
	}
}

start();