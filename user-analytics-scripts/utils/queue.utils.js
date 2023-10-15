const { SendMessageCommand, SQSClient } = require('@aws-sdk/client-sqs');
const {appConfig} = require('../config')

const client = new SQSClient({});

const queueRegion = appConfig.get('/aws/region');
const queueName = appConfig.get('/aws/queueName');
const queueAccId = appConfig.get('/aws/accountId');

const queueUrl = `https://sqs.${queueRegion}.amazonaws.com/${queueAccId}/${queueName}`

const sendMessage = async (MessageBody) => {
  try{
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody
    });
    const response = await client.send(command);
    return {success:true};
  }
  catch(err){
    console.log(err)
    return {success:false};
  }
}

module.exports = {
  sendMessage
}
