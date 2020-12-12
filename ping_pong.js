let amqp = require("amqplib/callback_api");

//Function for publishing a message to an exchange with a specific key(target server name)
let publish_to_key = function(msg, key,channel, exchange, server_name){
    channel.publish(exchange, key, Buffer.from(msg),{
        replyTo:server_name
    });
    console.log(" %s Sent %s to %s",server_name, msg,key );
    if(msg === "ping" || msg === "Ping"){
        console.log(" Awaiting pong" );
    }
};
//Function for running a server that sends and receives messages, binds to the main exchange by it
let run_ping_pong_server = function (rmq_url, server_name, exchange_name) {
    amqp.connect(rmq_url, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertExchange(exchange_name, "direct", {
                durable: true
            });
            channel.assertQueue('', {
                exclusive: true
            }, function (error2, queue) {
                if (error2) {
                    throw error2;
                }
                console.log(" %s listing for pings, To exit press CTRL+C", server_name);
                channel.bindQueue(queue.queue, exchange_name, server_name);
                channel.consume(queue.queue, function (msg) {
                    if (msg.content) {
                        let msg_data = msg.content.toString()
                        let origin_server = msg.properties.replyTo
                        console.log(" Received message %s", msg_data);

                        //console.log(msg);
                        //checks if received command to msg another server, if so publish to the exchange with the servers key

                        if (msg.properties.contentType === "command") {
                            publish_to_key(msg_data, origin_server, channel, exchange_name, server_name);
                        }
                        //checks if received ping, if so respond "pong!"
                        else {
                            if (msg_data === "ping" || msg_data === "Ping") {
                                publish_to_key("pong!", origin_server, channel, exchange_name, server_name)
                            }
                        }
                    }
                    }, {
                        noAck: true
                });
            });
        });
    });
};
module.exports = {run_ping_pong_server}