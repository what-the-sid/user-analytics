const { HelloWorldController } = require('./controllers');
const { sendMessage, createLogBody, processTimer } = require('../utils')
const { helloWorldSchema } = require('./schema')

const metadata = {
  method: 'POST',
  name: 'hello-world'
}

exports.handler = async (event,context,callback) => {

  const executionTimeStart = Date.now()
  try{
    const validation = helloWorldSchema.validate(JSON.parse(event.body))
    let response = {}
    let statusCode = 200

    if (validation.error) {
			response = { msg: "Missing Payload", success: false }
      statusCode = 422
		}
    else{
      response = new HelloWorldController(event, metadata).process()
    }

    const executionTimeEnd = Date.now()
    const runtime = (executionTimeEnd - executionTimeStart)/1000
    const logBody = createLogBody(metadata, event,
      {response, statusCode, runtime:runtime+0.2})

    console.log("Log Body:::",JSON.stringify(logBody))

    sendMessage(JSON.stringify(logBody))
    await processTimer(200)
    return {
      statusCode,
      body: JSON.stringify(response)
    }
  }
  catch(err){
    console.log(err)
    const response = { msg: 'Internal Server Error', success: false}
    const logBody = createLogBody(metadata, event, {...response, statusCode:500})
    await sendMessage(JSON.stringify(logBody))
    return {
      statusCode: 500,
      body: JSON.stringify(response)
    }
  }
}
