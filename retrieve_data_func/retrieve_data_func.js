var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var dynamo = new AWS.DynamoDB({endpoint:'http://localhost:4566'});

exports.handler = async (event) => {
    var body;
    var statusCode = 200;
    var headers = {
        ContentType:'application/json'
    }

    try{
        var station_data = await dynamo.scan({TableName:'hydrometric_data_sele'}).promise();
        var station_list = await dynamo.scan({TableName:'stations'}).promise();

        station_data.Items.forEach( (s) => {
            let station = station_list.Items.find( e => e.station_id.N === s.station_id.N);
            if(!station.data) station.data = [];
            station.data.push(s);
        });

        body = station_list;
    }catch(err){
        statusCode = 400;
        body = err.message;
    }finally{
        body = JSON.stringify(body);
    }

    let response = {
        statusCode,
        body,
        headers
    }

    return response;

    
}