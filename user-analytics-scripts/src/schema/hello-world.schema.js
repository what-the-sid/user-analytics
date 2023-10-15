const Joi = require('joi')

const helloWorldSchema = Joi.object({
	userId: Joi.string().required()
})

module.exports = {
	helloWorldSchema
}
