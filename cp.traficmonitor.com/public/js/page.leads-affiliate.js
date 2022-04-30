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
	
	dataSocket.emit('getLeadsAffiliate', JSON.stringify(req));
	
	$(".preloader").show();
}

dataSocket.on('getLeadsAffiliate', function (data) {
	data = JSON.parse(data);
	
	$(".preloader").hide();
	
	if(data.leads.length) {
		inProgress = false;
		updateList(data);
	}
	else
		$("#list .table-striped tr:last").after('<tr><td class="success text-center" colspan="8">END OF LIST REACHED</td></tr>');
});

function updateList(data) {
	var html = '';

	for(var i=0; i<data.leads.length; i++) {
		html += '<tr>\
	<td>' + data.leads[i].personId + '</td>\
	<td>' + data.leads[i].offerName + '</td>\
	<td>' + (data.leads[i].subAffiliateName ? data.leads[i].subAffiliateName : 'NO') + '</td>\
	<td>' + data.leads[i].creativeName + '</td>\
	<td>' + data.leads[i].country + '</td>\
	<td>' + data.leads[i].reward + '$</td>\
	<td>' + data.leads[i].events + '</td>\
	<td>' + data.leads[i].date + '</td>\
</tr>';
	}

	$("#list .table-striped tr:last").after(html);
}