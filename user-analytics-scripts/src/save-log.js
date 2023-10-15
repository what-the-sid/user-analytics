const { SaveLogController } = require('./controllers');

const metadata = {
  method: 'POST',
  name: 'save-log'
}
exports.handler = async (event,context,callback) => {
  try{
    await new SaveLogController(event, metadata).saveLog()
    return true
  }
  catch(err){
    console.log(err)
    return false
  }
}
