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
      AttributeName: 'sensor_id',
      AttributeType: 'N'
    },
  ],
  KeySchema: [
    {
      AttributeName: 'sensor_id',
      KeyType: 'HASH'
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: 'Sele',
  StreamSpecification: {
    StreamEnabled: false
  }
};

// Create User table
ddb.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("River table created", data);
  }
});


