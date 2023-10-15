const { GetAnalyticsController } = require('./controllers');

const metadata = {
  method: 'GET',
  name: 'get-analytics'
}
exports.handler = async (event,context,callback) => {
  try{
    const constructor = new GetAnalyticsController(event, metadata)
    const response = await constructor.scan()
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
