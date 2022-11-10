var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

var dynamo = new AWS.DynamoDB({endpoint:'http://localhost:4566'});
var sqs = new AWS.SQS({endpoint:'http://localhost:4566'});

exports.handler = () => {
    //retrieve messages
    sqs.getQueueUrl({
        QueueName:"depth"
    },(err,data) => {
        if(err){
            console.log("Can't retrieve QueueUrl",err);
            return;
        }else{
            var QueueUrl = data.QueueUrl;
            sqs.receiveMessage({
                QueueUrl,
                MaxNumberOfMessages:10,
                VisibilityTimeout:10}, (err,data) =>{
                    if(err){
                        console.log("Error: unable to receive messages",err);
                    } else {
                        console.log(data);
                        
                        data.Messages.forEach( m => {
                            //TODO: compute avg

                            //TODO: store in ddb

                            //delete message
                            sqs.deleteMessage({
                                QueueUrl,
                                ReceiptHandle: m.ReceiptHandle
                            }, (err,data) => {
                                if(err) console.log("Error: unable to delete message",m.MessageId,err);
                            });
                        })
                    }
                })
        }
    });
}