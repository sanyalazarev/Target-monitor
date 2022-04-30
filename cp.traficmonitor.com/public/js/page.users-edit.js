/* $("#edit form").validationEngine({"autoHidePrompt":true, "autoHideDelay":1000, "promptPosition":"topLeft", "binded":false});
$("#phone").mask("+38 (099) 999-99-99");

$("#time").mask("99:99");

$(".date-input").datepicker({
	changeMonth: true,
	changeYear: true,
	yearRange: "-100:+0",
	dateFormat : "dd/mm/yy"
}); */

// Autocomplete func for GOOGLE PLACES API. Calls from google script in body tag
function initAutocomplete() {
	var input = (document.getElementById('address'));
	var autocomplete = new google.maps.places.Autocomplete(input);

	autocomplete.addListener('place_changed', function () {
		var placeInfo = autocomplete.getPlace();

		if (!placeInfo.geometry) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			$('#place-visit').attr('placeholder', 'Sorry, nothing found');
			return;
		}
		
		// get country name from response
		var countryObj = placeInfo.address_components.filter(function (elem) {
			return elem.types.includes('country');
		});

		var countryName = countryObj[0].long_name;
		var userCity = placeInfo.name;

		$('#address').val(userCity + ', ' + countryName);
		$("#lat").val(placeInfo.geometry.location.lat());
		$("#lng").val(placeInfo.geometry.location.lng());
	});
};

$(".save-data").click(function(e){
	e.preventDefault();
	
	var data = getFormData($(".edit-info"));
	
	dataSocket.emit('userEdit', JSON.stringify(data));
});

dataSocket.on('userEdit', function (data) {
	data = JSON.parse(data);
	if(data.success)
		showNotify("success", "Saved successfully");
	else
		showNotify("danger", "Save error");
});

var $uploadPhotoArea = $(".upload-more-photo");
$uploadPhotoArea.upload({
	action: "/users/upload-image",
	postData: {hash:userHash, userId: $("#userId").val()}, 
	postKey: "image",
	maxSize: 15728640,
	label: '<i class="glyphicon glyphicon-open"></i>&nbsp;&nbsp;&nbsp;&nbsp;Upload photo'
});

// обрезать изображение для главного фото
var jcropApi;
var jcropX = 0;
var jcropY = 0;
var jcropX2 = 300;
var jcropY2 = 300;
function cropevent(c){
	if(parseInt(c.w) > 0){
		var rx = 300 / c.w;
		var ry = 300 / c.h;
		
		$(".main-photo img").css({
			width: Math.round(rx * $(".jcrop-holder img").width()) + "px", 
			height: Math.round(ry * $(".jcrop-holder img").height()) + "px", 
			marginLeft: "-" + Math.round(rx * c.x) + "px", 
			marginTop: "-" + Math.round(ry * c.y) + "px"
		});
		
		if(c.x < 0) jcropX = 0; else jcropX = Math.floor(c.x);
		if(c.y < 0) jcropY = 0; else jcropY = Math.floor(c.y);
		if(c.x2 < 0) jcropX2 = 0; else jcropX2 = Math.floor(c.x2);
		if(c.y2 < 0) jcropY2 = 0; else jcropY2 = Math.floor(c.y2);
		
		$(".main-photo input[name=crop]").val(jcropX + "," + jcropY + "," + (jcropX2 - jcropX) + "," + (jcropY2 - jcropY));
	}
}

var $cropBody = $("#modal-crop-image .modal-body");
$uploadPhotoArea.on("filecomplete", function(obj, file, res){
	var data = JSON.parse(res);
	
	if(data.error)
		alert(data.error);
	else {
		$(".main-photo").html('<div style="position: relative; overflow: hidden; width: 300px; height: 300px;">\
	<img src="' + data.image + '">\
	<input type="hidden" name="photo" value="' + data.image + '">\
	<input type="hidden" name="crop" value="0,0,300,300">\
</div>');
		
		$cropBody.html('<img src="' + data.image + '">');
		
		$('#modal-crop-image').modal('show');
	
		$("#modal-crop-image .modal-dialog").css("width", data.width + 40);
		var newImg = new Image();
		newImg.onload = function () {
			jcropApi = $.Jcrop($cropBody.find("img"), {
				bgColor		: 'white',
				bgOpacity	: 0.3,
				aspectRatio	: 1,
				minSize		: [300, 300],
				setSelect	: [0, 0, 300, 300],
				onChange	: cropevent,
				onSelect	: cropevent
			});
		}
		newImg.src = data.image;
	}
});

$(".form-horizontal").on("click", ".make-main-photo", function(e){
	var src = $(this).prev("img").attr("src");
	
	$(".main-photo").html('<div style="position: relative; overflow: hidden; width: 300px; height: 300px;">\
	<img src="' + src + '">\
	<input type="hidden" name="photo" value="' + src + '">\
	<input type="hidden" name="crop" value="0,0,300,300">\
</div>');
	
	$cropBody.html('<img src="' + src + '">');
	
	$('#modal-crop-image').modal('show');
	
	var newImg = new Image();
	newImg.onload = function () {
		$("#modal-crop-image .modal-dialog").css("width", $(this)[0].width + 40);
		setTimeout(function(){
			jcropApi = $.Jcrop($cropBody.find("img"), {
				bgColor		: 'white',
				bgOpacity	: 0.3,
				aspectRatio	: 1,
				minSize		: [300, 300],
				setSelect	: [0, 0, 300, 300],
				onChange	: cropevent,
				onSelect	: cropevent
			});
		}, 300)
	}
    newImg.src = src;
});