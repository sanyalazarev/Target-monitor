///////////////////////////////////////////////////////////////////////////
// MODAL
$("body").on("click", ".person-info", function(e){
	e.preventDefault();
	
	$("#modal .modal-content").load($(this).attr("href"), function(){
		$("#modal").modal("show");
	});
});

$(".datepicker").datepicker({"dateFormat":"dd/mm/yy"});

var page = 1;
var inProgress = false;

$(window).scroll(function() {
	if(($(window).scrollTop() + 1000) >= ($("#list").height() - 100) && !inProgress)
		loadData();
});

function loadData() {
	inProgress = true;
	page += 1;
	
	var req = {
        hash : userHash, 
		dateFrom: $("#dateFrom").val(), 
		dateTo: $("#dateTo").val(), 
        page : page
    };
	
	dataSocket.emit('getConversions', JSON.stringify(req));
	
	$(".preloader").show();
}

dataSocket.on('getConversions', function (data) {
	data = JSON.parse(data);
	
	$(".preloader").hide();
	
	if(data.conversions.length) {
		inProgress = false;
		updateList(data);
	}
	else
		$("#list .table-striped tr:last").after('<tr><td class="success text-center" colspan="18">END OF LIST REACHED</td></tr>');
});

function updateList(data) {
	var html = '';

	for(var i=0; i<data.conversions.length; i++) {
		html += '<tr data-id="' + data.conversions[i].id + '">\
	<td>#' + data.conversions[i].id + '</td>\
	<td>' + data.conversions[i].clickId + '</td>\
	<td>' + data.conversions[i].personId + '</td>\
	<td>' + data.conversions[i].offerName + '</td>\
	<td>' + data.conversions[i].affiliateName + '</td>\
	<td>' + data.conversions[i].eventName + '</td>\
	<td>' + data.conversions[i].creativeName + '</td>\
	<td>' + (data.conversions[i].subAffiliateName ? data.conversions[i].subAffiliateName : 'NO') + '</td>\
	<td>' + data.conversions[i].ip + '</td>\
	<td>' + data.conversions[i].country + '</td>\
	<td>' + data.conversions[i].reward + '$</td>\
	<td>' + data.conversions[i].b1 + '</td>\
	<td>' + data.conversions[i].b2 + '</td>\
	<td>' + data.conversions[i].b3 + '</td>\
	<td>' + data.conversions[i].b4 + '</td>\
	<td>' + data.conversions[i].b5 + '</td>\
	<td>' + data.conversions[i].clickDate + '</td>\
	<td>' + data.conversions[i].date + '</td>\
</tr>';
	}
	
	$("#list .table-striped tr:last").after(html);
}