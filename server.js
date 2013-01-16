var http = require("http");
var url = require("url");

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    route(handle, pathname);
    response.writeHead(200, {"Content-Type": "text/html"});
    body = "<script src='http://friend.pianke.me/static/js/jquery.js'></script>"
    response.write(body);
    response.end();
  }
  http.createServer(onRequest).listen(8888);
}

exports.start = start;