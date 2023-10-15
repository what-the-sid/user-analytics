const Joi = require('joi')

const helloWorldSchema = Joi.object({
	dateFrom: Joi.string().required(),
  dateTo: Joi.string().required(),
  lastEvaluatedKey:Joi.string().optional()
})

module.exports = {
	helloWorldSchema
}
