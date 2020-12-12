let amqp = require("amqplib/callback_api");
let rmq_url = "amqp://localhost"
const ping_pong_exchange_name = "ping_pong_exchange"

let publish_to_key = function(msg, key,channel, exchange,sender_name =""){

    channel.publish(exchange, key, Buffer.from(msg),{
        replyTo:sender_name
    });
    console.log(" [x] Sent %s", msg);
};


let publish_command = function(msg, channel, exchange,sender_server, dest_server){
    channel.publish(exchange, sender_server, Buffer.from(msg),{
        replyTo:dest_server,
        contentType:"command"
    });
    console.log(" Told %s to send %s to %s",sender_server,msg,dest_server);

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

        publish_command("ping",channel,ping_pong_exchange_name,"server1", "server2");

    });
});
