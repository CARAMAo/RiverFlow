// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10',endpoint: 'http://localhost:4566'});

//River table definition
var params = {
  AttributeDefinitions: [
    {
      AttributeName: 'station_id',
      AttributeType: 'N'
    },
    {
      AttributeName: 'measured_date',
      AttributeType: 'S',
    }
  ],
  KeySchema: [
    {
      AttributeName: 'station_id',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'measured_date',
      KeyType: 'RANGE',
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: 'hydrometric_data_sele',
  StreamSpecification: {
    StreamEnabled: false
  }
};

// Create User table
ddb.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Hydrometric data table created", data);
  }
});

//create Station table
ddb.createTable({
  AttributeDefinitions:[
    {
      AttributeName:"station_id",
      AttributeType:"N"
    }
  ],
  KeySchema:[
    {
      AttributeName:"station_id",
      KeyType:"HASH"
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 3,
    WriteCapacityUnits: 3
  },
  TableName: 'stations',
}, (err,data) => {
  if(err){
    console.log("Error creating stations table",err);
  } else {
    console.log("Stations table successfully created",data);

    const station_data = require('./stations.json');
    station_data.forEach(Item => {
      ddb.putItem({
        TableName:'stations',
        Item,
      }, (err,data) => {
        if(err){
          console.log("Error adding Item",err);
        } else {
          console.log("Item successfully added");
        }
      })
    })
  }
}
)


