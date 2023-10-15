const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const {appConfig} = require('../../config')
const bucketName = appConfig.get('/aws/logBucket');

class GetLogsController {

  constructor(event, metadata){
    this.metadata = metadata
    this.event = event
  }

  async download() {
    const { key } = this.event.queryStringParameters
    return new Promise((resolve, reject) => {
    const params = { Bucket: bucketName, Key: key };

    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const jsonContent = JSON.parse(data.Body.toString('utf-8'));
        resolve(jsonContent);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
  }
}

module.exports = GetLogsController;
