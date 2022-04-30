const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const session = require('express-session');
const fileUpload = require('express-fileupload');
const ioLib = require('socket.io');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
const jsonexport = require('jsonexport');

// Utils
const checkLogin = require('./models/auth').isLogin;
const socketHandler = require('./models/socketHandlers');

// Models
const Helper = require('./models/helper');
const User = require('./models/user');
const langEn = require('./models/langEn');
// const Manufacture = require('./models/manufacture');
// const Planes = require('./models/planes');
const Creatives = require('./models/creatives');
const Subaffiliates = require('./models/subaffiliates');
const Offers = require('./models/offers');
const Events = require('./models/events');
const TrackingDomains = require('./models/trackingDomains');
const Clicks = require('./models/clicks');
const Conversions = require('./models/conversions');
const Leads = require('./models/leads');
const Countries = require('./models/countries');
const Postbacks = require('./models/postbacks');

const Config = require('./config/config');
const Domain = `${Config.protocol}://${Config.domain}`
const CLIENT_RANDOM_HASH = (Math.random().toString(36).substring(7));

// App settings
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use("/views", express.static(__dirname + '/views'));
app.use(cookieParser());
// app.use(session({ secret: '148e4e39c1591b3377347560a8328dcc' }));
app.use(fileUpload());

app.use(function (req, res, next) {
	res.locals.randomHash = CLIENT_RANDOM_HASH;
	res.locals.socketAddress = `${Config.protocol}://${Config.domain}:${Config.port}`;
	next();
});

global.lang = langEn;

// Login page
app.get('/login', (req, res) => {
	if (req.cookies.hash && Helper.getIdByHash(req.cookies.hash))
		res.redirect('/');
	else
		res.render(__dirname + '/views/login', { page: 'login' });
});

// Users
app.get('/', checkLogin, function (req, res) {
	if(res.locals.userRole < 100)
		return res.redirect('/affiliates');
	
	User.getList({ page: 1 })
		.then(data => {
			data.page = 'users';
			res.render(__dirname + '/views/users', data);
		})
		.catch(err => {
			console.log(err);
			res.render(__dirname + '/views/users', {page: 'users', users: []});
		});
});

app.get('/users/add', checkLogin, (req, res) => {
	User.add({})
		.then(data => {
			res.redirect("/users/edit/" + data.userId)
		})
		.catch(err => {
			console.log(err);
			res.redirect("/users");
		});
});

app.get('/users/edit/:userId', checkLogin, (req, res) => {
	var userId = parseInt(req.params.userId);

	User.getById({ userId: userId })
		.then(data => {
			data.page = "users-edit";
			data.userEditHah = Helper.getHashById(userId);

			res.render(__dirname + '/views/users-edit', data);
		})
		.catch(err => {
			console.log(err);
			res.redirect("/");
		});
});

app.post('/users/upload-image', function (req, res) {
	User.uploadImage({ userId: req.body.userId, image: req.files.image }, function (data) {
		res.send(JSON.stringify(data));
	});
});

// Affiliates
app.get('/affiliates', checkLogin, async (req, res) => {
	try {
		creatives = await Creatives.getList({userId: res.locals.userId, page: 1});
		subaffiliates = await Subaffiliates.getList({userId: res.locals.userId, page: 1});
		postbacks = await Postbacks.getList({userId: res.locals.userId});
		
		res.render(__dirname + '/views/affiliates', {page: "affiliates", creatives: creatives, subaffiliates: subaffiliates, postbacks: postbacks});
	}
	catch(err) {
		console.log(err);
		res.redirect("/");
	}
});

// Creatives
app.get('/creatives/add', checkLogin, (req, res) => {
	res.render(__dirname + '/views/creatives-add');
});

app.get('/creatives/edit/:creativeId', checkLogin, (req, res) => {
	Creatives.getById({id: req.params.creativeId})
		.then(data => {
			res.render(__dirname + '/views/creatives-edit', {creative: data});
		})
		.catch(err => {
			console.log(err);
			res.send('Internal error');
		});
});

app.get('/creatives/link/:creativeId', checkLogin, (req, res) => {
	Subaffiliates.getList({userId: res.locals.userId, page: 1})
		.then(data => {
			res.render(__dirname + '/views/creatives-link', {creativeId: req.params.creativeId, subaffiliates: data});
		})
		.catch(err => {
			console.log(err);
			res.send('Internal error');
		});
});

// Subaffiliates
app.get('/subaffiliates/add', checkLogin, (req, res) => {
	res.render(__dirname + '/views/subaffiliates-add');
});

app.get('/subaffiliates/edit/:creativeId', checkLogin, (req, res) => {
	Subaffiliates.getById({id: req.params.creativeId})
		.then(data => {
			res.render(__dirname + '/views/subaffiliates-edit', {subaffiliate: data});
		})
		.catch(err => {
			console.log(err);
			res.send('Internal error');
		});
});

/////////////////////////////////////////////////////////
// AFFILIATES
app.get('/affiliates', checkLogin, async (req, res) => {
	try {
		const creatives = await Creatives.getList({userId: res.locals.userId, page: 1});
		const subaffiliates = await Subaffiliates.getList({userId: res.locals.userId, page: 1});
		
		res.render(__dirname + '/views/affiliates', {page: "affiliates", creatives: creatives, subaffiliates: subaffiliates});
	}
	catch(err) {
		console.log(err);
		res.redirect("/");
	}
});

// Creatives
app.get('/creatives/add', checkLogin, (req, res) => {
	res.render(__dirname + '/views/creatives-add');
});

app.get('/creatives/edit/:creativeId', checkLogin, (req, res) => {
	Creatives.getById({id: req.params.creativeId})
		.then(data => {
			res.render(__dirname + '/views/creatives-edit', {creative: data});
		})
		.catch(err => {
			console.log(err);
			res.send('Internal error');
		});
});

app.get('/creatives/link/:creativeId', checkLogin, (req, res) => {
	Subaffiliates.getList({userId: res.locals.userId, page: 1})
		.then(data => {
			res.render(__dirname + '/views/creatives-link', {creativeId: req.params.creativeId, subaffiliates: data});
		})
		.catch(err => {
			console.log(err);
			res.send('Internal error');
		});
});

// Subaffiliates
app.get('/subaffiliates/add', checkLogin, (req, res) => {
	res.render(__dirname + '/views/subaffiliates-add');
});

app.get('/subaffiliates/edit/:creativeId', checkLogin, (req, res) => {
	Subaffiliates.getById({id: req.params.creativeId})
		.then(data => {
			res.render(__dirname + '/views/subaffiliates-edit', {subaffiliate: data});
		})
		.catch(err => {
			console.log(err);
			res.send('Internal error');
		});
});


/////////////////////////////////////////////////////////
// ADVERTISERS
app.get('/advertisers', checkLogin, async (req, res) => {
	try {
		const offers = await Offers.getList({userId: res.locals.userId, page: 1});
		const events = await Events.getList({userId: res.locals.userId, page: 1});
		const domains = await TrackingDomains.getList({userId: res.locals.userId, page: 1});
		
		res.render(__dirname + '/views/advertisers', {page: "advertisers", offers: offers, events: events, domains: domains});
	}
	catch(err) {
		console.log(err);
		res.redirect("/");
	}
});

// Offers
app.get('/offers/add', checkLogin, async (req, res) => {
	try {
		const domains = await TrackingDomains.getList({userId: res.locals.userId, page: 1});
		const countries = await Countries.getAll();
		
		res.render(__dirname + '/views/offers-add', {domains: domains, countries: countries, ctr: [188, 202, 64, 60, 82, 169, 80, 81, 32, 9]});
	}
	catch(err) {
		console.log(err);
		res.send('Internal error');
	}
});

app.get('/offers/edit/:offerId', checkLogin, async (req, res) => {
	try {
		const offer = await Offers.getById({id: req.params.offerId});
		const permittedCountries = await Offers.getPermittedCountries({offerId: req.params.offerId});
		const domains = await TrackingDomains.getList({userId: res.locals.userId, page: 1});
		const countries = await Countries.getAll();
		
		res.render(__dirname + '/views/offers-edit', {offer: offer, permittedCountries: permittedCountries, countries: countries, domains: domains});
	}
	catch(err) {
		console.log(err);
		res.send('Internal error');
	}
});

app.get('/offers/pricing/:offerId', checkLogin, async (req, res) => {
	try {
		const pricing = await Offers.getAllPricing({offerId: req.params.offerId});
		
		res.render(__dirname + '/views/offers-pricing', {page: "offers-pricing", offerId: req.params.offerId, pricing: pricing});
	}
	catch(err) {
		console.log(err);
		res.send('Internal error');
	}
});

app.get('/offers/pricing/add/:offerId', checkLogin, async (req, res) => {
	try {
		const countries = await Countries.getAll();
		
		res.render(__dirname + '/views/offers-pricing-add', {offerId: req.params.offerId, countries: countries});
	}
	catch(err) {
		console.log(err);
		res.send('Internal error');
	}
});
app.get('/offers/pricing/edit/:pricingId', checkLogin, async (req, res) => {
	try {
		const pricing = await Offers.getPriceById({id: req.params.pricingId});
		const countries = await Countries.getAll();
		
		res.render(__dirname + '/views/offers-pricing-edit', {pricing: pricing, countries: countries});
	}
	catch(err) {
		console.log(err);
		res.send('Internal error');
	}
});

// Events
app.get('/events/add', checkLogin, (req, res) => {
	Offers.getList({userId: res.locals.userId, page: 1})
		.then(data => {
			res.render(__dirname + '/views/events-add', {offers: data});
		})
		.catch(err => {
			console.log(err);
			res.send('Internal error');
		});
});

app.get('/events/edit/:eventId', checkLogin, async (req, res) => {
	try {
		const offers = await Offers.getList({userId: res.locals.userId, page: 1});
		const event = await Events.getById({id: req.params.eventId});
		
		res.render(__dirname + '/views/events-edit', {offers: offers, event: event});
	}
	catch(err) {
		console.log(err);
		res.send('Internal error');
	}
});

app.get('/events/edit-pricing/:eventId', checkLogin, async (req, res) => {
	try {
		// const offers = await Offers.getList({userId: res.locals.userId, page: 1});
		// const event = await Events.getPricing({id: req.params.eventId});
		
		res.render(__dirname + '/views/events-edit-pricing', {eventId: req.params.eventId, pricing: []});
	}
	catch(err) {
		console.log(err);
		res.send('Internal error');
	}
});

// Tracking domains
app.get('/tracking-domains/add', checkLogin, (req, res) => {
	res.render(__dirname + '/views/tracking-domains-add');
});

app.get('/tracking-domains/edit/:domainId', checkLogin, async (req, res) => {
	TrackingDomains.getById({id: req.params.domainId})
		.then(data => {
			res.render(__dirname + '/views/tracking-domains-edit', {domain: data});
		})
		.catch(err => {
			console.log(err);
			res.send('Internal error');
		});
});

// Clicks
app.get('/clicks', checkLogin, async (req, res) => {
	let dateFrom, dateTo;
		
	if(!req.query.dateFrom || !req.query.dateTo) {
		const now = new Date();
		
		dateFrom = '01/' + (now.getMonth() + 1) + '/' + now.getFullYear();
		dateTo = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
	}
	else {
		dateFrom = req.query.dateFrom;
		dateTo = req.query.dateTo;
	}
			
	if(global.userRole > 10) {
		/* Clicks.getList({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo, page: 1})
			.then(data => {
				res.render(__dirname + '/views/clicks', {page: 'clicks', dateFrom: dateFrom, dateTo: dateTo, clicks: data});
			})
			.catch(err => {
				console.log(err);
				res.send('Internal error');
			}); */
		
		try {
			const clicks = await Clicks.getList({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo, page: 1});
			const total = await Clicks.getTotalInfo({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo});
			
			res.render(__dirname + '/views/clicks', {page: 'clicks', dateFrom: dateFrom, dateTo: dateTo, clicks: clicks, total: total});
		}
		catch(err) {
			console.log(err);
			res.send('Internal error');
		}
	}
	else {
		/* Clicks.getListForAffiliate({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo, page: 1})
			.then(data => {
				res.render(__dirname + '/views/clicks-affiliate', {page: 'clicks-affiliate', dateFrom: dateFrom, dateTo: dateTo, clicks: data});
			})
			.catch(err => {
				console.log(err);
				res.redirect("/clicks");
			}); */
		
		try {
			const clicks = await Clicks.getListForAffiliate({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo, page: 1});
			const total = await Clicks.getTotalInfoForAffiliate({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo});
			
			res.render(__dirname + '/views/clicks-affiliate', {page: 'clicks-affiliate', dateFrom: dateFrom, dateTo: dateTo, clicks: clicks, total: total});
		}
		catch(err) {
			console.log(err);
			res.send('Internal error');
		}
	}
});

// Conversions
app.get('/conversions', checkLogin, async (req, res) => {
	let dateFrom, dateTo;
		
	if(!req.query.dateFrom || !req.query.dateTo) {
		const now = new Date();
		
		dateFrom = '01/' + (now.getMonth() + 1) + '/' + now.getFullYear();
		dateTo = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
	}
	else {
		dateFrom = req.query.dateFrom;
		dateTo = req.query.dateTo;
	}
				
	if(global.userRole > 10) {
		Conversions.getList({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo, page: 1})
			.then(data => {
				res.render(__dirname + '/views/conversions', {page: 'conversions', dateFrom: dateFrom, dateTo: dateTo, conversions: data});
			})
			.catch(err => {
				console.log(err);
				// res.send('Internal error');
				res.redirect("/conversions");
			});
	}
	else {
		try {
			const conversions = await Conversions.getListForAffiliate({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo, page: 1})
			const sumPayout = await Conversions.getSumPayoutForAffiliate({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo})
			
			res.render(__dirname + '/views/conversions-affiliate', {page: 'conversions-affiliate', dateFrom: dateFrom, dateTo: dateTo, conversions: conversions, sumPayout: sumPayout});
		}
		catch(err) {
			console.log(err);
			res.send('Internal error');
		}
	}
});

app.get('/conversions/export', checkLogin, async (req, res) => {
	let dateFrom, dateTo;
		
	if(!req.query.dateFrom || !req.query.dateTo) {
		const now = new Date();
		
		dateFrom = '01/' + (now.getMonth() + 1) + '/' + now.getFullYear();
		dateTo = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
	}
	else {
		dateFrom = req.query.dateFrom;
		dateTo = req.query.dateTo;
	}
				
	if(global.userRole > 10) {
		try {
			const conversions = await Conversions.getAll({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo})
			const csv = await jsonexport(conversions, {rowDelimiter: ';'});
			
			res.setHeader('Content-disposition', 'attachment; filename=payout report ' + dateFrom.replace(/\//g, '_') + '-' + dateTo.replace(/\//g, '_') + '.csv');
			res.set('Content-Type', 'text/csv');
			res.status(200).send(csv);
		}
		catch(err) {
			console.log(err);
			res.send('Internal error');
		}
	}
	else {
		try {
			const conversions = await Conversions.getAllForAffiliate({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo})
			const csv = await jsonexport(conversions, {rowDelimiter: ';'});
			
			res.setHeader('Content-disposition', 'attachment; filename=payout report ' + dateFrom.replace(/\//g, '_') + '-' + dateTo.replace(/\//g, '_') + '.csv');
			res.set('Content-Type', 'text/csv');
			res.status(200).send(csv);
		}
		catch(err) {
			console.log(err);
			res.send('Internal error');
		}
	}
});


// Leads
/* app.get('/leads', checkLogin, async (req, res) => {
	try {
		const offers = await Offers.getList({userId: res.locals.userId, page: 1});
		const events = await Events.getByOfferId({userId: res.locals.userId, offerId: offers[0].id});
		const leads = await Leads.getList({userId: res.locals.userId, offerId: offers[0].id, page: 1});
		
		res.render(__dirname + '/views/leads', {page: 'leads', offerId: offers[0].id, offers: offers, events: events, leads: leads});
	}
	catch(err) {
		console.log(err);
		res.send('Internal error');
	}
});

app.get('/leads/:offerId', checkLogin, async (req, res) => {
	try {
		const offers = await Offers.getList({userId: res.locals.userId, page: 1});
		const events = await Events.getByOfferId({userId: res.locals.userId, offerId: req.params.offerId});
		const leads = await Leads.getList({userId: res.locals.userId, offerId: req.params.offerId, page: 1});
		
		res.render(__dirname + '/views/leads', {page: 'leads', offerId: req.params.offerId, offers: offers, events: events, leads: leads});
	}
	catch(err) {
		console.log(err);
		res.send('Internal error');
	}
}); */

app.get('/leads', checkLogin, async (req, res) => {
	let dateFrom, dateTo;
		
	if(!req.query.dateFrom || !req.query.dateTo) {
		const now = new Date();
		
		dateFrom = '01/' + (now.getMonth() + 1) + '/' + now.getFullYear();
		dateTo = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
	}
	else {
		dateFrom = req.query.dateFrom;
		dateTo = req.query.dateTo;
	}
	
	if(global.userRole > 10) {
		Leads.getList({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo, page: 1})
			.then(data => {
				res.render(__dirname + '/views/leads', {page: 'leads', dateFrom: dateFrom, dateTo: dateTo, leads: data});
			})
			.catch(err => {
				console.log(err);
				// res.send('Internal error');
				res.redirect("/leads");
			});
	}
	else {
		Leads.getListForAffiliate({userId: res.locals.userId, dateFrom: dateFrom, dateTo: dateTo, page: 1})
			.then(data => {
				res.render(__dirname + '/views/leads-affiliate', {page: 'leads-affiliate', dateFrom: dateFrom, dateTo: dateTo, leads: data});
			})
			.catch(err => {
				console.log(err);
				// res.send('Internal error');
				res.redirect("/leads");
			});
	}
});

// Postbacks
app.get('/postbacks/add', checkLogin, (req, res) => {
	Events.getAllByPostback()
		.then(data => {
			res.render(__dirname + '/views/postbacks-add', {events: data});
		})
		.catch(err => {
			console.log(err);
			res.send('Internal error');
		});
	
});

app.get('/postbacks/edit/:postbackId', checkLogin, async (req, res) => {
	try {
		const postback = await Postbacks.getById({id: req.params.postbackId});
		const events = await Events.getAllByPostback();
		
		res.render(__dirname + '/views/postbacks-edit', {events: events, postback: postback});
	}
	catch(err) {
		console.log(err);
		res.send('Internal error');
	}
});

app.get('/person/remove/:personId', checkLogin, async (req, res) => {
	if(res.locals.userRole == 100) {
		Conversions.removePerson({personId: req.params.personId})
			.then(() => {
				res.redirect('/conversions');
			})
			.catch(err => {
				console.log(err);
				res.send("ERROR");
			});
	}
	else
		res.redirect('/conversions');
});

// -------------- Express server
const server = app.listen(Config.port, function () {
	console.log(new Date());
	console.log('Server listening on port ' + Config.port + '!');
});

// Socket
const io = ioLib(server);
io.on('connection', socket => {
	socketHandler(io, socket);
});
