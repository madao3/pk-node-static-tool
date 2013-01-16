var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var updater = require('./updater');
var handle = {}
handle["/"] = requestHandlers.start;
handle["/update"] = requestHandlers.update;

server.start(router.route, handle);