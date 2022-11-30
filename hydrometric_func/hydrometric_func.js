var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

var dynamo = new AWS.DynamoDB({endpoint:'http://localhost:4566'});
var sqs = new AWS.SQS({endpoint:'http://localhost:4566'});


exports.handler = () => {

    //retrieve messages
    sqs.getQueueUrl({
        QueueName:"hydrometric_SELE"
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
                        if(!data.Messages) {
                            console.log("No messages found!");
                            return;
                        }


                        var Items = data.Messages.map( m => {

                            const payload = JSON.parse(m.Body);
                            console.log(payload);
                            return {
                                station_id:{N: payload.station_id.toString()},
                                measured_date:{S: payload.measured_date},
                                flow_depth:{N: payload.flow_depth.toString()},
                                flow_velocity:{N: payload.flow_velocity.toString()}
                            }
                        });

                        //TODO: store in ddb
                        for(const Item of Items){
                            dynamo.putItem({
                                TableName:'hydrometric_data_sele',
                                Item,
                            }, (err,data) => {
                                if(err){
                                    console.log("Unable to put item",err);
                                } else {
                                    console.log("Item successfully added!",data);
                                }
                            })
                        }

                        //delete message
                        data.Messages.forEach(m => {
                        sqs.deleteMessage({
                            QueueUrl,
                            ReceiptHandle: m.ReceiptHandle
                        }, (err,data) => {
                            if(err) console.log("Error: unable to delete message",m.MessageId,err);
                        });});
                    
                        

                    }
                })
        }
    });

}