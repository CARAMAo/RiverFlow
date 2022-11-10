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


                        var measured_data_array = data.Messages.map( m => JSON.parse(m.Body));
                        
                        
                        var grouped_data = Object.values(measured_data_array.reduce( (items,el) => {
                            items[el.sensor_id] = [...(items[el.sensor_id] || []), el];
                            return items;
                        },[]));

                        console.log("received:",grouped_data);
                        
                        var Items = grouped_data.map( arr => {
                            arr.sort( (a,b) => b.timestamp - a.timestamp);
                            var avg_depth = arr.reduce( (total,element) => total+element.depth,0)/arr.length;
                            var avg_flow = arr.reduce( (total,element) => total+element.flow,0)/arr.length;
                            var last_measured_timestamp = arr[0].timestamp;
                            var last_measured_depth = arr[0].depth;
                            var last_measured_flow = arr[0].flow;
                            return {
                                "river":{S:"SELE"},
                                "sensor_id": {N:arr[0].sensor_id.toString()},
                                "avg_depth":{N:avg_depth.toString()},
                                "last_measured_depth":{N:last_measured_depth.toString()},
                                "avg_flow":{N:avg_flow.toString()},
                                "last_measured_flow":{N:last_measured_flow.toString()},
                                "last_measured_timestamp":{S:new Date(last_measured_timestamp).toISOString()},

                            }

                        });


                        //TODO: store in ddb
                        for(const Item of Items){
                            dynamo.putItem({
                                TableName:'river',
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