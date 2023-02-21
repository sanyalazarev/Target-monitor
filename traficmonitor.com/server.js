const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const geoip = require('geoip-country');
const isoToCountry = require('iso-country-utils');
const detectIp = require('detect-ip');

const port = 5656;

const Persons = require('./models/persons');
const Countries = require('./models/countries');
const Clicks = require('./models/clicks');
const Offers = require('./models/offers');
const Conversions = require('./models/conversions');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(detectIp());

const privateKey  = fs.readFileSync(__dirname + '/ssl/key.pem', 'utf8');
const certificate = fs.readFileSync(__dirname + '/ssl/certificate.pem', 'utf8');

app.get('/', async (req, res) => {
	res.sendFile("public/index.html");
});

app.get('/monit', async (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

app.post('/conversion', async (req, res) => {
	Conversions.addNew(req.body)
		.then((conversionId) => {
			res.send(JSON.stringify({error: false, text: ''}));
		})
		.catch(err => {
			console.log(err);
			res.send(JSON.stringify({error: true, text: err}));
		});
});

app.get('/conversion', async (req, res) => {
	Conversions.addNew(req.query)
		.then((conversionId) => {
			res.send(JSON.stringify({error: false, text: ''}));
		})
		.catch(err => {
			console.log(err);
			res.send(JSON.stringify({error: true, text: err}));
		});
});

app.post('/save-fingerprint', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	
	const offer_id = parseInt(req.body.offer_id);
	const affiliate_id = parseInt(req.body.affiliate_id);
	const creative_id = parseInt(req.body.creative_id);
	const subaffiliate_id = req.body.subaffiliate_id ? parseInt(req.body.subaffiliate_id) : 0;
	
	if(!offer_id || !affiliate_id || !creative_id)
		res.send('ERROR');
	else {
		try {
			const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
			const geo = geoip.lookup(ip);
			
			const device = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';
			const language = req.headers['accept-language'] ? req.headers['accept-language'] : 'unknown';
			const country = (geo && geo.country) ? isoToCountry.getCountryFromAlpha2(geo.country) : {name: 'Unknown'};
			
			if(!country || !country.name) {
				console.log("Country definition error.\n");
				console.log(geo.country, geo);
				
				country = {name: 'Unknown'};
			}
			
			const person = await Persons.searchByFingerprint(req.body.fingerprint);
			
			let person_id;
			if(person)
				person_id = person.id;
			else {
				person_id = await Persons.addNew({
					ip: ip, 
					country: country.name, 
					device: device, 
					language: language, 
					fingerprint: req.body.fingerprint
				});
			}
			
			const countries = await Countries.getByName(country.name);
			
			let countryId;
			if(countries.length > 0)
				countryId = countries[0].id;
			else
				countryId = await Countries.addNew(country.name);
			
			const permittedCountries = await Offers.getPermittedCountries(offer_id);
			const countryAllowed = permittedCountries.length > 0 && permittedCountries.indexOf(countryId) == -1 ? 0 : 1;
			
			let custom_params = {};
			for (let prop in req.body)
				if(['offer_id', 'affiliate_id', 'creative_id', 'subaffiliate_id', 'a1', 'a2', 'a3', 'a4', 'a5', 'fingerprint'].indexOf(prop) == -1)
					custom_params[prop] = req.body[prop];
				
			
			const click_id = await Clicks.addNew({
				affiliateId: affiliate_id, 
				offerId: offer_id, 
				creativeId: creative_id, 
				subAffiliateId: subaffiliate_id, 
				personId: person_id, 
				ip: ip, 
				language: language, 
				countryId: countryId, 
				country: country.name, 
				countryAllowed: countryAllowed, 
				a1: req.body.a1, 
				a2: req.body.a2, 
				a3: req.body.a3, 
				a4: req.body.a4, 
				a5: req.body.a5, 
				custom_params: (Object.keys(custom_params).length ? JSON.stringify(custom_params) : '')
			});
			
			const offer = await Offers.getById(offer_id);
			
			if(offer)
				res.send(offer.url.replace("{click_id}", click_id).replace("{affiliate_id}", affiliate_id));
			else
				res.send('ERROR');
		}
		catch (err) {
			console.log(err);
			
			res.send('ERROR');
		}
	}
});

app.get('/get-clickid', async (req, res) => {
	try {
		const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
		const device = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';
		const language = req.headers['accept-language'] ? req.headers['accept-language'] : 'unknown';
		const click_id = await Clicks.search({
			ip: ip, 
			language: language
		});
		
		res.send(JSON.stringify({error:false, click_id: click_id}));
	}
	catch (err) {
		console.log(err);
		res.send(JSON.stringify({error: 'Internal error'}))
	}
});

var httpsServer = https.createServer({key: privateKey, cert: certificate}, app);

httpsServer.listen(port, function() {
	console.log(`App listening at port: ${port}`)
});