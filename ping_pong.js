console.log(process.env.RMQ_URL)
let amqp = require("amqplib/callback_api");
let rmq_url = "amqp://localhost"
let ping_pong_exchange_name = "ping_pong_exchange"
let server_name = process.argv.slice(2).join(' ') || "server1";

//Function for publishing a message to an exchange with a specific key(target server name)
let publish_to_key = function(msg, key,channel, exchange){
    channel.publish(exchange, key, Buffer.from(msg),{
        replyTo:server_name
    });
    console.log(" %s Sent %s to %s",server_name, msg,key );
    if(msg === "ping" || msg === "Ping"){
        console.log(" Awaiting pong" );
    }
};

amqp.connect(rmq_url, function (error0,connection){
    if (error0){
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertExchange(ping_pong_exchange_name, "direct",{
            durable: true
        });

        channel.assertQueue('', {
            exclusive: true
        }, function(error2, queue) {
            if (error2) {
                throw error2;
            }
            console.log(" %s listing for pings, To exit press CTRL+C",server_name);
            channel.bindQueue(queue.queue, ping_pong_exchange_name, server_name);

            channel.consume(queue.queue, function (msg) {
                if (msg.content) {
                    let msg_data = msg.content.toString()
                    let origin_server = msg.properties.replyTo
                    console.log(" Received message %s", msg_data);
                    //console.log(msg);
                    //checks if recieved command to msg another server, if so publish to the exchange with the servers key
                    if(msg.properties.contentType === "command"){
                        publish_to_key(msg_data,origin_server,channel,ping_pong_exchange_name,server_name);
                    }
                    //checks if recieved ping, if so respond "pong!"
                    else{
                        if(msg_data === "ping" || msg_data === "Ping"){
                            publish_to_key("pong!",origin_server,channel,ping_pong_exchange_name,server_name)
                        }
                    }
                }
            }, {
                noAck: true
            });
        });
    });
});

