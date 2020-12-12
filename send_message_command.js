let amqp = require("amqplib/callback_api");

let publish_command = function(msg, channel, exchange,sender_server, dest_server){
    channel.publish(exchange, sender_server, Buffer.from(msg),{
        replyTo:dest_server,
        contentType:"command"
    });
    console.log(" Told %s to send %s to %s",sender_server,msg,dest_server);
};

let send_message_command = function(rmq_url, exchange_name,sender_server,msg,dest_server) {
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
            publish_command(msg, channel, exchange_name, sender_server, dest_server)
        });
        setTimeout(function() {
            connection.close();
            process.exit(0)
        }, 10);
    });
};
module.exports = {send_message_command}