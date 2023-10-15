const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const {appConfig} = require('../config')

const bucketName = appConfig.get('/aws/logBucket');

const createLogBody = (metadata, event, response) => {
  let body = JSON.parse(event.body)
  return {
    ...metadata,
    requestBody: body,
    userId: body.userId || 'Unkown User',
    requestHeaders: event.headers,
    requestId: event.requestContext.requestId || null,
    ...response,
    timestamp: new Date().toISOString()
  }
}

const uploadLogs = async (requestId, buffer) => {
  try{
    const key = `${requestId}.json`;
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
    };
    await s3.upload(params).promise()
    return true
  }
  catch(err){
    console.log(err)
    return false
  }
}

module.exports = {
  createLogBody,
  uploadLogs
}
