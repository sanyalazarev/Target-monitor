const Config = require('../config/config');
const Helper = require('./helper');
const Auth = require('./auth');
const User = require('./user');
const Creatives = require('./creatives');
const Subaffiliates = require('./subaffiliates');
const Offers = require('./offers');
const Events = require('./events');
const TrackingDomains = require('./trackingDomains');
const Clicks = require('./clicks');
const Conversions = require('./conversions');
const Leads = require('./leads');
const Postbacks = require('./postbacks');

module.exports = function (io, socket) {
	function sendOnce(err, type, data) {
		if (err)
			console.log(err);
		else
			socket.emit(type, data);
	}

	function sendAll(err, type, data) {
		if (err)
			console.log(err);
		else
			io.sockets.emit(type, data);
	}

	// AUTH
	socket.on('userLogin', function (data) {
		data = JSON.parse(data);
		Auth.userLogin(data)
			.then(result => {
				sendOnce(null, "userLogin", JSON.stringify(result));
			})
			.catch(result => {
				sendOnce(null, "userLogin", JSON.stringify(result));
			});
	});

	// USERS
	socket.on('getUsers', function (data) {
		User.getList(data)
			.then(data => {
				sendOnce(null, "getUsers", JSON.stringify(data));
			})
			.catch(err => {
				console.log(err);
			});
	});

	socket.on('userEdit', function (data) {
		data = JSON.parse(data);
		
		User.edit(data)
			.then(() => {
				sendOnce(null, "userEdit", JSON.stringify({ success: true }));
			})
			.catch(err => {
				console.log(err);
				sendOnce(null, "userEdit", JSON.stringify({ success: false }));
			});
	});

	socket.on('userRemove', function (data) {
		data = JSON.parse(data);
		
		User.remove(data)
			.then(result => {
				result.error = false;
				sendOnce(null, "userRemove", JSON.stringify(result));
			})
			.catch(err => {
				console.log(err);
				sendOnce(null, "userRemove", JSON.stringify({ error: true }));
			});
	});

	// CREATIVES
	socket.on('creativeAdd', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Creatives.add(data)
				.then(data => {
					sendOnce(null, "creativeAdd", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "creativeAdd", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('creativeEdit', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Creatives.edit(data)
				.then(() => {
					data.error = false;
					sendOnce(null, "creativeEdit", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "creativeEdit", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('creativeRemove', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Creatives.remove(data)
				.then(() => {
					sendOnce(null, "creativeRemove", JSON.stringify({error: false, creativeId: data.creativeId}));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "creativeRemove", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	// Subaffiliates
	socket.on('subaffiliateAdd', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Subaffiliates.add(data)
				.then(data => {
					sendOnce(null, "subaffiliateAdd", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "subaffiliateAdd", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('subaffiliateEdit', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Subaffiliates.edit(data)
				.then(() => {
					data.error = false;
					sendOnce(null, "subaffiliateEdit", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "subaffiliateEdit", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('subaffiliateRemove', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Subaffiliates.remove(data)
				.then(() => {
					sendOnce(null, "subaffiliateRemove", JSON.stringify({error: false, subaffiliateId: data.subaffiliateId}));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "subaffiliateRemove", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	// Offers
	socket.on('offerAdd', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Offers.add(data)
				.then(data => {
					sendOnce(null, "offerAdd", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "offerAdd", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('offerEdit', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Offers.edit(data)
				.then(() => {
					data.error = false;
					sendOnce(null, "offerEdit", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "offerEdit", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('offerRemove', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Offers.remove(data)
				.then(() => {
					sendOnce(null, "offerRemove", JSON.stringify({error: false, offerId: data.offerId}));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "offerRemove", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('offerPricingAdd', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Offers.addPrice(data)
				.then(data => {
					sendOnce(null, "offerPricingAdd", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "offerPricingAdd", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('offerPricingEdit', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Offers.editPrice(data)
				.then(data => {
					data.error = false;
					sendOnce(null, "offerPricingEdit", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "offerPricingEdit", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('offerPricingRemove', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Offers.removePrice(data)
				.then(() => {
					sendOnce(null, "offerPricingRemove", JSON.stringify({error: false, pricingId: data.pricingId}));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "offerPricingRemove", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	// Events
	socket.on('eventAdd', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Events.add(data)
				.then(data => {
					sendOnce(null, "eventAdd", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "eventAdd", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('eventEdit', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Events.edit(data)
				.then(() => {
					data.error = false;
					sendOnce(null, "eventEdit", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "eventEdit", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('eventRemove', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Events.remove(data)
				.then(() => {
					sendOnce(null, "eventRemove", JSON.stringify({error: false, eventId: data.eventId}));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "eventRemove", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	// TRACKINGDOMAINS
	socket.on('trackingDomainAdd', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			TrackingDomains.add(data)
				.then(data => {
					sendOnce(null, "trackingDomainAdd", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "trackingDomainAdd", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('trackingDomainEdit', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			TrackingDomains.edit(data)
				.then(() => {
					data.error = false;
					sendOnce(null, "trackingDomainEdit", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "trackingDomainEdit", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('trackingDomainRemove', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			TrackingDomains.remove(data)
				.then(() => {
					sendOnce(null, "trackingDomainRemove", JSON.stringify({error: false, domainId: data.domainId}));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "trackingDomainRemove", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	// CLICKS
	socket.on('getClicks', async function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			try {
				const clicks = await Clicks.getList(data);
				
				sendOnce(null, "getClicks", JSON.stringify({error: false, clicks: clicks}));
			}
			catch(err) {
				console.log(err);
				sendOnce(null, "getClicks", JSON.stringify({error: 'Internal error'}));
			}
		}
	});
	
	socket.on('getClicksAffiliate', async function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			try {
				const clicks = await Clicks.getListForAffiliate(data);
				
				sendOnce(null, "getClicksAffiliate", JSON.stringify({error: false, clicks: clicks}));
			}
			catch(err) {
				console.log(err);
				sendOnce(null, "getClicksAffiliate", JSON.stringify({error: 'Internal error'}));
			}
		}
	});
	
	// CONVERSIONS
	socket.on('getConversions', async function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			try {
				const conversions = await Conversions.getList(data);
				
				sendOnce(null, "getConversions", JSON.stringify({error: false, conversions: conversions}));
			}
			catch(err) {
				console.log(err);
				sendOnce(null, "getConversions", JSON.stringify({error: 'Internal error'}));
			}
		}
	});
	
	socket.on('getConversionsAffiliate', async function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			try {
				const conversions = await Conversions.getListForAffiliate(data);
				
				sendOnce(null, "getConversionsAffiliate", JSON.stringify({error: false, conversions: conversions}));
			}
			catch(err) {
				console.log(err);
				sendOnce(null, "getConversionsAffiliate", JSON.stringify({error: 'Internal error'}));
			}
		}
	});
	
	// LEADS
	socket.on('getLeads', async function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			try {
				const leads = await Leads.getList(data);
				
				sendOnce(null, "getLeads", JSON.stringify({error: false, leads: leads}));
			}
			catch(err) {
				console.log(err);
				sendOnce(null, "getLeads", JSON.stringify({error: 'Internal error'}));
			}
		}
	});
	
	socket.on('getLeadsAffiliate', async function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			try {
				const leads = await Leads.getListForAffiliate(data);
				
				sendOnce(null, "getLeadsAffiliate", JSON.stringify({error: false, leads: leads}));
			}
			catch(err) {
				console.log(err);
				sendOnce(null, "getLeadsAffiliate", JSON.stringify({error: 'Internal error'}));
			}
		}
	});
	
	// Postbacks
	socket.on('postbackAdd', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Postbacks.add(data)
				.then(data => {
					sendOnce(null, "postbackAdd", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "postbackAdd", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('postbackEdit', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Postbacks.edit(data)
				.then(() => {
					data.error = false;
					sendOnce(null, "postbackEdit", JSON.stringify(data));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "postbackEdit", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
	
	socket.on('postbackRemove', function (data) {
		data = JSON.parse(data);
		
		if(data.hash && (data.userId = Helper.getIdByHash(data.hash))) {
			Postbacks.remove(data)
				.then(() => {
					sendOnce(null, "postbackRemove", JSON.stringify({error: false, postbackId: data.postbackId}));
				})
				.catch(err => {
					console.log(err);
					sendOnce(null, "postbackRemove", JSON.stringify({error: 'Internal error'}));
				});
		}
	});
};