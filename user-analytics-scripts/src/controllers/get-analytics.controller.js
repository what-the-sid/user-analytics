const { DynamoDBClient, QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb")
const client = new DynamoDBClient({});

const { scanResuls, insertLog, batchInsertCache } = require("../../utils")

const {appConfig} = require('../../config')
const logTableName = appConfig.get('/aws/logDB');
const cacheTableName = appConfig.get('/aws/cacheDB');

class GetAnalyticsController {

  constructor(event, metadata){
    this.metadata = metadata
    this.event = event
  }

  processResponse(response){
    const processedResponse = {};
    for (const key in response) {
      if (response[key].S) {
        processedResponse[key] = response[key].S;
      } else if (response[key].N) {
        processedResponse[key] = parseFloat(response[key].N);
      } else if (response[key].BOOL) {
        processedResponse[key] = response[key].BOOL === 'true';
      }
    }
    return processedResponse
  }

  async scan() {
    try{
      let { dateFrom, dateTo, lastEvaluatedKey, logId } = this.event.queryStringParameters
      let requestId = this.event.requestContext.requestId
      let data = []
      let count = 1
      let nextStart = null

      const params = {
        TableName: logTableName,
        FilterExpression: '#timeStamp between :start and :end',
        ExpressionAttributeNames: { "#timeStamp": "timeStamp" },
        ExpressionAttributeValues: {
          ':start': {S:dateFrom},
          ':end': {S:dateTo}
        },
        Limit: 20,
        ExclusiveStartKey: lastEvaluatedKey
      }

      if(lastEvaluatedKey && logId){
        lastEvaluatedKey = JSON.parse(lastEvaluatedKey)
        params["TableName"] = cacheTableName
        params["FilterExpression"] = "#timeStamp between :start and :end AND " + "#logId = :logId"
        params["ExpressionAttributeValues"][":logId"] = logId
        params["ExpressionAttributeNames"]["#logId"] = "logId"
      }
        let statusACount = 0;
        let statusBCount = 0;
        const uniqueUsers = new Set();
        let unknownUsersCount = 0;

        do {
            const params = {
              TableName: logTableName,
              FilterExpression: '#timeStamp between :start and :end',
              ExpressionAttributeNames: { "#timeStamp": "timeStamp" },
              ExpressionAttributeValues: {
                ':start': {S:dateFrom},
                ':end': {S:dateTo}
              },
              Limit: 20,
              ExclusiveStartKey: lastEvaluatedKey
            }
            const result = await client.send(new ScanCommand(params));
            const items = result.Items;
            const itemToCache = []
            for (let item of items) {
              item = this.processResponse(item)
              if (item.status === 'SUCCESS') {
                statusACount++;
              } else if (item.status === 'FAILURE') {
                statusBCount++;
              }
              const userId = item.userId;
              uniqueUsers.add(userId);
              if (item.userId === 'Unkown User') {
                unknownUsersCount++;
              }
              // if(count===1){
              itemToCache.push({...item})
              // }
            }
            if(params["TableName"] === logTableName){
              await batchInsertCache(itemToCache, cacheTableName, requestId)
            }
            data = [...data,...itemToCache]
            nextStart = result.LastEvaluatedKey
            lastEvaluatedKey = result.LastEvaluatedKey;
            count++
          } while (lastEvaluatedKey && !logId);
          return {
              successCount:statusACount,
              failureCount:statusBCount,
              uniqueUsers: uniqueUsers.size,
              unknownUsersCount,
              lastEvaluatedKey: nextStart,
              logId: requestId,
              data
          }
    }
    catch(err){
      console.log(err)
      return false
    }
  }
}

module.exports = GetAnalyticsController;
