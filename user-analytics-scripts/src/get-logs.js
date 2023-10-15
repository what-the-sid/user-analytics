const { GetLogsController } = require('./controllers');

const metadata = {
  method: 'GET',
  name: 'get-logs'
}
exports.handler = async (event,context,callback) => {
  try{
    const constructor = new GetLogsController(event, metadata)
    const response = await constructor.download()
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body:JSON.stringify({...response, success:true})
    }
  }
  catch(err){
    console.log(err)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body:JSON.stringify({msg:"Internal Server Error", success:false})
    }
  }
}
