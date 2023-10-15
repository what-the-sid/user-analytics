class HelloWorldController {

  constructor(event, metadata){
    this.metadata = metadata
    this.event = event
  }

  process() {
    return { msg: "hello world", success: true }
  }
}

module.exports = HelloWorldController;
