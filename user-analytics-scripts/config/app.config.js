const Confidence = require('confidence')
const path = require('path');

//App Configuration in confidence store

const config = {
	$meta: 'This file defines all configurations for this project.',
	env:{
		$env: 'NODE_ENV',
		$default: 'development',
	},
	aws:{
    accountId:{
      $env: 'ACC_ID',
			$default: '294778484587'
    },
		logBucket:{
			$env: 'S3_BUCKET',
			$default: 'api-monitor-logs'
		},
		queueName:{
			$env: 'SQS_NAME',
			$default: 'logQueue',
		},
    region:{
      $env: 'ACC_REGION',
			$default: 'ap-south-1'
    },
		logDB: {
			$env: 'DB_NAME',
			$default: 'api-logs'
		},
		cacheDB: {
			$env: 'CACHE_NAME',
			$default: 'log-cache'
		}
	}
}

// Initialize Confidence Store
const store = new Confidence.Store(config)
const criteria = {
	env: process.env['NODE_ENV'],
}

module.exports = {
	get: (key) => store.get(key, criteria),
	meta: (key) => store.meta(key, criteria)
}
