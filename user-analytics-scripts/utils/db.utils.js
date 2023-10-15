const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, BatchWriteCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


const insertLog = async (Item, tableName) => {
  console.log()
  try{
    const command = new PutCommand({
      TableName: tableName,
      Item
    });

    await docClient.send(command);
    return true;
  }
  catch(err){
    console.log(err)
    return false
  }
}

const batchInsertCache = async (Items, tableName,logId) => {

  const putRequests = Items.map(e=>({
      PutRequest: {
        Item: {...e,logId,expiryTime:new Date().getTime() + 60 * 60 * 1000}
      }
    }))
  try{
    const command = new BatchWriteCommand({
      RequestItems: {
        [tableName]: putRequests,
      },
    });

    await docClient.send(command);
    return true;
  }
  catch(err){
    console.log(err)
    return false
  }
}

const scanResuls = async (params) => {
  const result = await docClient.scan(params).promise();
  const items = result.Items;
  return {items, lastEvaluatedKey: result.LastEvaluatedKey}
}

module.exports = {
  insertLog,
  scanResuls,
  batchInsertCache
}
