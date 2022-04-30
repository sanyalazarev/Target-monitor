///////////////////////////////////////////////////////////////////////////
// MODAL
$("body").on("click", ".add-row, .edit-row", function(){
	$("#modal .modal-content").load($(this).attr("href"), function(){
		$("#modal").modal("show");
	});
	
	return false;
});

///////////////////////////////////////////////////////////////////////////
// OFFERS
$("#modal").on("click", ".add-price", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.country = $("#modal [name=countryId] option:selected").text();
	data.hash = userHash;
	
	dataSocket.emit('offerPricingAdd', JSON.stringify(data));
});
dataSocket.on('offerPricingAdd', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		var html = '<tr data-id="' + data.id + '">\
	<td>#' + data.id + '</td>\
	<td>' + data.country + '</td>\
	<td>' + (data.gender ? 'Men' : 'Women') + '</td>\
	<td>' + data.ageFrom + ' - ' + data.ageTo + '</td>\
	<td>' + data.price + '$</td>\
	<td class="text-right">\
		<a href="/offers/pricing/edit/' + data.id + '" class="btn btn-sm btn-default edit-row">Edit</a>\
		<button class="btn btn-sm btn-danger remove-row">Delete</button>\
	</td>\
</tr>';

		$("#list .table tbody").append(html);
		
		$("#modal").modal("hide");
		
		showNotify("success", "Offer price successful add");
	}
});

// edit
$("#modal").on("click", ".edit-price", function(e){
	e.preventDefault();
	
	var data = getFormData($("#modal"));
	data.country = $("#modal [name=countryId] option:selected").text();
	data.hash = userHash;
	
	dataSocket.emit('offerPricingEdit', JSON.stringify(data));
});
dataSocket.on('offerPricingEdit', function (data) {
	data = JSON.parse(data);
	
	if(data.error) {
		$("#modal").modal("hide");
		showNotify("danger", data.error);
	}
	else {
		$("#list .table [data-id=" + data.pricingId + "] td:eq(1)").text(data.country);
		$("#list .table [data-id=" + data.pricingId + "] td:eq(2)").text(data.gender == 1 ? 'Men' : (data.gender == 2 ? 'Women' : 'All'));
		$("#list .table [data-id=" + data.pricingId + "] td:eq(3)").text(data.ageFrom + ' - ' + data.ageTo);
		$("#list .table [data-id=" + data.pricingId + "] td:eq(4)").text(data.price + '$');
		
		$("#modal").modal("hide");
		
		showNotify("success", "Offer price updated");
	}
});

// delete
$("#list .table").on("click", ".remove-row", function(e){
	if(confirm("Really delete?"))
		dataSocket.emit('offerPricingRemove', JSON.stringify({hash: userHash, pricingId: $(this).closest("tr").data("id")}));
});
dataSocket.on('offerPricingRemove', function (data) {
	data = JSON.parse(data);
	
	$('#list .table tr[data-id=' + data.pricingId + ']').remove();
	
	showNotify("danger", "Offer price successfully deleted");
});