/* var page = 1;
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
		role: 1, 
		search: $("#user-search").val(), 
        page : page
    };
	
	dataSocket.emit('getUsers', JSON.stringify(req));
}

dataSocket.on('getUsers', function (data) {
	data = JSON.parse(data);
	
	if(data.users.length) {
		inProgress = false;
		updateList(data);
	}
	else
		alert("This is end!");
});

function updateList(data) {
	var html = '';

	for(var i=0; i<data.users.length; i++) {
		html += '<tr>\
	<td>#' + data.users[i].id + '</td>\
	<td>' + (data.users[i].image ? '<img src="' + data.users[i].image + '" class="list-image"> ' : '') + data.users[i].name + ' ' + data.users[i].lastName + '</td>\
	<td>' + data.users[i].address + '</td>\
	<td>' + data.users[i].licenceType + '</td>\
	<td>' + data.users[i].flightHours + '</td>\
	<td>\
		<a href="/users/edit/' + data.users[i].id + '" class="btn btn-sm btn-default">Edit</a>\
		<button class="btn btn-sm btn-danger remove-row">Delete</button>\
	</td>\
</tr>';
	}

	if($("#list .table-striped tbody tr:last").length)
		$("#list .table-striped tbody tr:last").after(html);
	else
		$("#list .table-striped tbody").html(html);
} */

$("#list").on("click", ".list-image", function(i, obj){
	$("#modal .modal-content").html('<div class="modal-header">\
	<button type="button" class="close" data-dismiss="modal">&times;</button>\
	<h4 class="modal-title">User photo</h4>\
</div>\
<div class="modal-body text-center">\
	<img src="' + $(this).attr("src") + '" alt="" style="max-width: 100%;">\
</div>');
	$("#modal").modal("show");
})

$("#list").on("click", ".remove-row", function(){
	if(confirm("Really delete?"))
		dataSocket.emit('userRemove', JSON.stringify({hash: userHash, userId: $(this).closest("tr").data("id")}));
});

dataSocket.on('userRemove', function (data) {
	data = JSON.parse(data);
	if(!data.error)
		$("#list [data-id=" + data.userId + "]").remove();
	else
		alert("Delete error!");
});