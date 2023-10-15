const { insertLog, uploadLogs } = require("../../utils")

const {appConfig} = require('../../config')
const tableName = appConfig.get('/aws/logDB');

class SaveLogController {

  constructor(event, metadata){
    this.metadata = metadata
    this.event = event
  }

  async saveLog() {
    try{
      const logData = JSON.parse(this.event.Records[0].body)
      const dbItem = {
        requestId: logData.requestId,
        userId: logData.userId,
        timeStamp: logData.timestamp,
        name: logData.name,
        method: logData.method,
        statusCode: logData.statusCode,
        runtime: logData.runtime,
        status: logData.statusCode===200?"SUCCESS":"FAILURE"
      }
      const jsonBody = {
        requestBody: logData.requestBody,
        response: logData.response,
        requestHeaders: logData.requestHeaders
      }
      const buf = Buffer.from(JSON.stringify(jsonBody));
      await insertLog(dbItem, tableName)
      await uploadLogs(logData.requestId, buf)
      return true
    }
    catch(err){
      console.log(err)
      return false
    }
  }
}

module.exports = SaveLogController;
