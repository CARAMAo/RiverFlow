var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

var sqs = new AWS.SQS({endpoint:'http://localhost:4566'});

const n = Math.ceil(Math.random() * 5);

sqs.getQueueUrl({
    QueueName:'hydrometric_SELE'
}, (err,data) =>{
    if(err){
        console.log("Can't retrieve QueueUrl",err);
    } else {

        for(var i = 0; i < n; i++){
            var MessageBody = JSON.stringify({
                river:'SELE',
                sensor_id: Math.ceil(Math.random()*3),
                timestamp: Date.now(),
                depth: Math.random()*50,
                flow: Math.random()*50,
            });

            sqs.sendMessage({
                QueueUrl: data.QueueUrl,
                MessageBody,
            }, (err,data)=>{
                if(err){
                    console.log("Unable to send message",err);
                } else {
                    console.log("Message successfully sent!",data);
                }
            });
        }



    }
})
