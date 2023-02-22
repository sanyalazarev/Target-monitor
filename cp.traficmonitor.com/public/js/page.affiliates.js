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
	$("#modal .modal-content").load($(this).attr("href"), function(){
		$("#modal").modal("show");
	});
	return false;
});

///////////////////////////////////////////////////////////////////////////
// CREATIVES
$("#modal").on("click", ".add-creative", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.hash = userHash;
	
	dataSocket.emit('creativeAdd', JSON.stringify(data));
});
dataSocket.on('creativeAdd', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		var html = '<tr data-id="' + data.creativeId + '">\
	<td>#' + data.creativeId + '</td>\
	<td>' + data.name + '</td>\
	<td class="text-right">\
		<a href="/creatives/link/' + data.creativeId + '" class="btn btn-sm btn-primary get-link">Get link</a>\
		<a href="/creatives/edit/' + data.creativeId + '" class="btn btn-sm btn-default edit-row">Edit</a>\
		<button class="btn btn-sm btn-danger remove-row">Delete</button>\
	</td>\
</tr>';
		$("#tab1 .table tbody").append(html);
		
		$("#modal").modal("hide");
		
		showNotify("success", "Creative successful add");
	}
});

//get link
function updateLink(e){
	var url = new URL($("#modal .link").text());
	console.log(url);
	url.searchParams.set('offer_id', $("#modal .offer-id").val());
	
	if($("#modal .subaffiliate").val())
		url.searchParams.set('subaffiliate_id', $("#modal .subaffiliate").val());
	else
		url.searchParams.delete('subaffiliate_id');
	
	$("#modal .link").text(url.protocol + "//" + url.host + url.pathname + '?' + url.searchParams.toString())
}
$("#modal").on("keyup", ".offer-id", updateLink);
$("#modal").on("change", ".subaffiliate", updateLink);

// edit
$("#modal").on("click", ".edit-creative", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.hash = userHash;
	
	dataSocket.emit('creativeEdit', JSON.stringify(data));
});
dataSocket.on('creativeEdit', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		$("#tab1 .table [data-id=" + data.creativeId + "] td:eq(1)").text(data.name);
		
		$("#modal").modal("hide");
		
		showNotify("success", "Creative updated");
	}
});

// delete
$("#tab1 .table").on("click", ".remove-row", function(e){
	if(confirm("Really delete?"))
		dataSocket.emit('creativeRemove', JSON.stringify({hash: userHash, creativeId: $(this).closest("tr").data("id")}));
});
dataSocket.on('creativeRemove', function (data) {
	data = JSON.parse(data);
	
	$('#tab1 .table tr[data-id=' + data.creativeId + ']').remove();
	
	showNotify("danger", "Creative successfully deleted");
});

///////////////////////////////////////////////////////////////////////////
// SUBAFFILIATES
$("#modal").on("click", ".add-subaffiliate", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.hash = userHash;
	
	dataSocket.emit('subaffiliateAdd', JSON.stringify(data));
});
dataSocket.on('subaffiliateAdd', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		var html = '<tr data-id="' + data.subaffiliateId + '">\
	<td>#' + data.subaffiliateId + '</td>\
	<td>' + data.name + '</td>\
	<td class="text-right">\
		<a href="/subaffiliates/edit/' + data.subaffiliateId + '" class="btn btn-sm btn-default edit-row">Edit</a>\
		<button class="btn btn-sm btn-danger remove-row">Delete</button>\
	</td>\
</tr>';
		$("#tab2 .table tbody").append(html);
		
		$("#modal").modal("hide");
		
		showNotify("success", "Subaffiliate successful add");
	}
});

// edit
$("#modal").on("click", ".edit-subaffiliate", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.hash = userHash;
	
	dataSocket.emit('subaffiliateEdit', JSON.stringify(data));
});
dataSocket.on('subaffiliateEdit', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		$("#tab2 .table [data-id=" + data.subaffiliateId + "] td:eq(1)").text(data.name);
		
		$("#modal").modal("hide");
		
		showNotify("success", "Subaffiliate updated");
	}
});

// delete
$("#tab2 .table").on("click", ".remove-row", function(e){
	if(confirm("Really delete?"))
		dataSocket.emit('subaffiliateRemove', JSON.stringify({hash: userHash, subaffiliateId: $(this).closest("tr").data("id")}));
});
dataSocket.on('subaffiliateRemove', function (data) {
	data = JSON.parse(data);
	
	$('#tab2 .table tr[data-id=' + data.subaffiliateId + ']').remove();
	
	showNotify("danger", "Subaffiliate successfully deleted");
});

///////////////////////////////////////////////////////////////////////////
// POSTBACKS
$("#modal").on("click", ".add-postback", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.hash = userHash;
	
	dataSocket.emit('postbackAdd', JSON.stringify(data));
});
dataSocket.on('postbackAdd', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		var html = '<tr data-id="' + data.postbackId + '">\
	<td>#' + data.postbackId + '</td>\
	<td>' + data.name + '</td>\
	<td>' + data.url + '</td>\
	<td>' + data.method + '</td>\
	<td class="text-right">\
		<a href="/postbacks/edit/' + data.postbackId + '" class="btn btn-sm btn-default edit-row">Edit</a>\
		<button class="btn btn-sm btn-danger remove-row">Delete</button>\
	</td>\
</tr>';
		$("#tab3 .table tbody").append(html);
		
		$("#modal").modal("hide");
		
		showNotify("success", "Postback successful add");
	}
});

// edit
$("#modal").on("click", ".edit-postback", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.hash = userHash;
	
	dataSocket.emit('postbackEdit', JSON.stringify(data));
});
dataSocket.on('postbackEdit', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {console.log(data);
		$("#tab3 .table [data-id=" + data.postbackId + "] td:eq(1)").text(data.name);
		$("#tab3 .table [data-id=" + data.postbackId + "] td:eq(2)").text(data.url);
		$("#tab3 .table [data-id=" + data.postbackId + "] td:eq(3)").text(data.method);
		
		$("#modal").modal("hide");
		
		showNotify("success", "Postback updated");
	}
});

// delete
$("#tab3 .table").on("click", ".remove-row", function(e){
	if(confirm("Really delete?"))
		dataSocket.emit('postbackRemove', JSON.stringify({hash: userHash, postbackId: $(this).closest("tr").data("id")}));
});
dataSocket.on('postbackRemove', function (data) {
	data = JSON.parse(data);
	
	$('#tab3 .table tr[data-id=' + data.postbackId + ']').remove();
	
	showNotify("danger", "Subaffiliate successfully deleted");
});