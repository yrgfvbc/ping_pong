// For exhibition - run server1.bat in a terminal, run server2.bat in a different terminal,
// and then run this file in a third terminal
let send_message_command = require("./send_message_command.js")
let configuration = require("./configuration");
let rmq_url = configuration.rmq_url;
let ping_pong_exchange_name = configuration.ping_pong_exchange_name;
send_message_command.send_message_command(rmq_url,ping_pong_exchange_name,
    "server2","ping","server1")

