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
	
	dataSocket.emit('getClicks', JSON.stringify(req));
	
	$(".preloader").show();
}

dataSocket.on('getClicks', function (data) {
	data = JSON.parse(data);
	
	$(".preloader").hide();
	
	if(data.clicks.length) {
		inProgress = false;
		updateList(data);
	}
	else
		$("#list .table-striped tr:last").after('<tr><td class="success text-center" colspan="14">END OF LIST REACHED</td></tr>');
});

function updateList(data) {
	var html = '';

	for(var i=0; i<data.clicks.length; i++) {
		html += '<tr data-id="' + data.clicks[i].id + '">\
	<td>#' + data.clicks[i].id + '</td>\
	<td>' + data.clicks[i].personId + '</td>\
	<td>' + data.clicks[i].offerName + '</td>\
	<td>' + data.clicks[i].affiliateName + '</td>\
	<td>' + data.clicks[i].creativeName + '</td>\
	<td>' + (data.clicks[i].subAffiliateName ? data.clicks[i].subAffiliateName : 'NO') + '</td>\
	<td>' + data.clicks[i].ip + '</td>\
	<td>' + data.clicks[i].country + '</td>\
	<td>' + data.clicks[i].a1 + '</td>\
	<td>' + data.clicks[i].a2 + '</td>\
	<td>' + data.clicks[i].a3 + '</td>\
	<td>' + data.clicks[i].a4 + '</td>\
	<td>' + data.clicks[i].a5 + '</td>\
	<td>' + data.clicks[i].date + '</td>\
</tr>';
	}
	
	$("#list .table-striped tr:last").after(html);
}