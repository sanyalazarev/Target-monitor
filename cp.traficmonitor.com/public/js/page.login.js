$(".form-signin").on("submit", function(e){
	e.preventDefault();
	
	dataSocket.emit('userLogin', JSON.stringify({
		"email"	: $("#email").val(),
		"pass"	: $("#password").val()
	}));
});

dataSocket.on('userLogin', function (data) {
	data = JSON.parse(data);
	
	if (!data.error) {
		userHash = data.hash;
		setCookie("hash", userHash, {"path": "/", "expires": 31536000});
		var prevPage = getCookie("requestedPage");
		document.location.href = prevPage ? prevPage : "/";
	}
	else
		alert(data.error);
});