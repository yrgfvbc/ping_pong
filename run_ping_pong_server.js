let ping_pong = require("./ping_pong.js");
let configuration = require("./configuration");
let rmq_url = configuration.rmq_url;
let ping_pong_exchange_name = configuration.ping_pong_exchange_name;
let server_name = process.argv.slice(2).join(' ') || "server";
ping_pong.run_ping_pong_server(rmq_url, server_name, ping_pong_exchange_name)