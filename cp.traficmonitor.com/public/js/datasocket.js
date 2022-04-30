const userHash = getCookie("hash");
const dataSocket = io.connect();

dataSocket.on('connect', function () {
	console.log('socket open');
});

dataSocket.on('disconnect', function () {
	console.log('socket close');
});