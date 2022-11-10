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
    {
      AttributeName: 'river',
      AttributeType: 'S',
    }
  ],
  KeySchema: [
    {
      AttributeName: 'river',
      KeyType:'HASH',
    },
    {
      AttributeName: 'sensor_id',
      KeyType: 'RANGE'
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  TableName: 'river',
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


