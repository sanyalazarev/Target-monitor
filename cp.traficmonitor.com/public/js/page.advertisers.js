///////////////////////////////////////////////////////////////////////////
// TABS
$('.nav-tabs a').click(function (e) {
	e.preventDefault();
	if(!$(this).parent().hasClass("active")) {
		$(this).tab('show');
	}
});

///////////////////////////////////////////////////////////////////////////
// MODAL
$("body").on("click", ".add-row, .edit-row, .get-link", function(){
	var url = $(this).attr("href");
	$("#modal .modal-content").load($(this).attr("href"), function(){
		if($(".nav-tabs .active").data("tab") == "offers")
			$(".modal-dialog").addClass("modal-lg");
		else
			$(".modal-dialog").removeClass("modal-lg");
		
		$("#modal").modal("show");
		
		setTimeout(function(){
			if(url == "/offers/add" || url.substr(0, 12) == "/offers/edit") 
				$(".chosen-select").chosen();
		}, 700);
	});
	
	return false;
});



///////////////////////////////////////////////////////////////////////////
// OFFERS
$("#modal").on("click", ".add-offer", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.hash = userHash;
	
	dataSocket.emit('offerAdd', JSON.stringify(data));
});
dataSocket.on('offerAdd', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		var html = '<tr data-id="' + data.offerId + '">\
	<td>#' + data.offerId + '</td>\
	<td>' + data.name + '</td>\
	<td>' + data.description + '</td>\
	<td>' + data.url + '</td>\
	<td><img src="/img/label' + data.public + '.png" alt=""></td>\
	<td><img src="/img/label' + data.active + '.png" alt=""></td>\
	<td class="text-right">\
		<a href="/offers/edit/' + data.offerId + '" class="btn btn-sm btn-default edit-row">Edit</a>\
		<button class="btn btn-sm btn-danger remove-row">Delete</button>\
	</td>\
</tr>';
		$("#tab1 .table tbody").append(html);
		
		$("#modal").modal("hide");
		
		showNotify("success", "Offer successful add");
	}
});

// edit
$("#modal").on("click", ".edit-offer", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.hash = userHash;
	
	dataSocket.emit('offerEdit', JSON.stringify(data));
});
dataSocket.on('offerEdit', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		$("#tab1 .table [data-id=" + data.offerId + "] td:eq(1)").text(data.name);
		$("#tab1 .table [data-id=" + data.offerId + "] td:eq(2)").text(data.description);
		$("#tab1 .table [data-id=" + data.offerId + "] td:eq(3)").text(data.url);
		$("#tab1 .table [data-id=" + data.offerId + "] td:eq(4)").html('<img src="/img/label' + data.public + '.png" alt="">');
		$("#tab1 .table [data-id=" + data.offerId + "] td:eq(5)").html('<img src="/img/label' + data.active + '.png" alt="">');
		
		$("#modal").modal("hide");
		
		showNotify("success", "Offer updated");
	}
});

// delete
$("#tab1 .table").on("click", ".remove-row", function(e){
	if(confirm("Really delete?"))
		dataSocket.emit('offerRemove', JSON.stringify({hash: userHash, offerId: $(this).closest("tr").data("id")}));
});
dataSocket.on('offerRemove', function (data) {
	data = JSON.parse(data);
	
	$('#tab1 .table tr[data-id=' + data.offerId + ']').remove();
	
	showNotify("danger", "Offer successfully deleted");
});


///////////////////////////////////////////////////////////////////////////
// EVENTS
$("#modal").on("click", ".add-event", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.offerName = $("#modal [name=offerId] :selected").text();
	data.hash = userHash;
	
	dataSocket.emit('eventAdd', JSON.stringify(data));
});
dataSocket.on('eventAdd', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		var html = '<tr data-id="' + data.eventId + '">\
	<td>#' + data.eventId + '</td>\
	<td>' + data.name + '</td>\
	<td>' + data.price + '$</td>\
	<td class="text-center"><img src="/img/label' + data.regular + '.png" alt=""></td>\
	<td class="text-center"><img src="/img/label' + data.public + '.png" alt=""></td>\
	<td class="text-right">\
		<a href="/events/edit/' + data.eventId + '" class="btn btn-sm btn-default edit-row">Edit</a>\
		<button class="btn btn-sm btn-danger remove-row">Delete</button>\
	</td>\
</tr>';
		$("#tab2 .table tbody").append(html);
		
		$("#modal").modal("hide");
		
		showNotify("success", "Goal successful add");
	}
});

// edit
$("#modal").on("click", ".edit-event", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.offerName = $("#modal [name=offerId] :selected").text();
	data.hash = userHash;
	
	dataSocket.emit('eventEdit', JSON.stringify(data));
});
dataSocket.on('eventEdit', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		$("#tab2 .table [data-id=" + data.eventId + "] td:eq(1)").text(data.name);
		$("#tab2 .table [data-id=" + data.eventId + "] td:eq(2)").text(data.price);
		$("#tab2 .table [data-id=" + data.eventId + "] td:eq(3)").html('<img src="/img/label' + data.regular + '.png" alt="">');
		$("#tab2 .table [data-id=" + data.eventId + "] td:eq(4)").html('<img src="/img/label' + data.public + '.png" alt="">');
		
		$("#modal").modal("hide");
		
		showNotify("success", "Goal updated");
	}
});

// delete
$("#tab2 .table").on("click", ".remove-row", function(e){
	if(confirm("Really delete?"))
		dataSocket.emit('eventRemove', JSON.stringify({hash: userHash, eventId: $(this).closest("tr").data("id")}));
});
dataSocket.on('eventRemove', function (data) {
	data = JSON.parse(data);
	
	$('#tab2 .table tr[data-id=' + data.eventId + ']').remove();
	
	showNotify("danger", "Goal successfully deleted");
});


///////////////////////////////////////////////////////////////////////////
// DOMAINS
$("#modal").on("click", ".add-domain", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.hash = userHash;
	
	dataSocket.emit('trackingDomainAdd', JSON.stringify(data));
});
dataSocket.on('trackingDomainAdd', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		var html = '<tr data-id="' + data.domainId + '">\
	<td>#' + data.domainId + '</td>\
	<td>' + data.domain + '</td>\
	<td class="text-right">\
		<a href="/tracking-domains/edit/' + data.domainId + '" class="btn btn-sm btn-default edit-row">Edit</a>\
		<button class="btn btn-sm btn-danger remove-row">Delete</button>\
	</td>\
</tr>';
		$("#tab3 .table tbody").append(html);
		
		$("#modal").modal("hide");
		
		showNotify("success", "Domain successful add");
	}
});

// edit
$("#modal").on("click", ".edit-domain", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.hash = userHash;
	
	dataSocket.emit('trackingDomainEdit', JSON.stringify(data));
});
dataSocket.on('trackingDomainEdit', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		$("#tab3 .table [data-id=" + data.domainId + "] td:eq(1)").text(data.domain);
		
		$("#modal").modal("hide");
		
		showNotify("success", "Domain updated");
	}
});

// delete
$("#tab3 .table").on("click", ".remove-row", function(e){
	if(confirm("Really delete?"))
		dataSocket.emit('trackingDomainRemove', JSON.stringify({hash: userHash, domainId: $(this).closest("tr").data("id")}));
});
dataSocket.on('trackingDomainRemove', function (data) {
	data = JSON.parse(data);
	
	$('#tab3 .table tr[data-id=' + data.domainId + ']').remove();
	
	showNotify("danger", "Domain successfully deleted");
});