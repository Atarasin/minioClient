var express = require('express');
var router = express.Router();

var minio = require('minio');
var minioClient = new minio.Client({
	endPoint: '127.0.0.1',
	port: 9000,
	useSSL: false,
	accessKey: 'AiEj4haD2O0KwVOsqPcA',
	secretKey: 'b8QLLjv1MxcyRfzlv5bbVQgo3vMblvrhq42bRjrw',
});
// console.log("minioClient:", minioClient);

var response = require('../public/javascripts/response.js')

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

// 返回访问Minio的url
router.get('/api/getMinioUrl/:method', function(req, res, next) {
	const method = req.params.method;
	let jsonRes = new response.Response();
	
	if (method === 'GET') {
		const bucket_name = req.query.bucket_name;
		const object_name = req.query.object_name;
		
		minioClient.presignedGetObject(bucket_name, object_name, 24 * 60 * 60, function (err, presignedUrl) {
			if (err) {
				console.log(err);
				jsonRes.code = -1;
				res.json(jsonRes);
				return;
			}
			console.log(presignedUrl);
			jsonRes.data.url = presignedUrl;
			res.json(jsonRes);
		});
	}
	else if (method === 'POST') {
		const bucket_name = req.query.bucket_name;
		const object_name = req.query.object_name;
		
		let policy = minioClient.newPostPolicy()
		// Policy restricted only for bucket 'mybucket'.
		policy.setBucket(bucket_name)
		// Policy restricted only for hello.txt object.
		policy.setKey(object_name)
		
		minioClient.presignedPostPolicy(policy, function (err, presignedUrl) {
			if (err) {
				console.log(err);
				jsonRes.code = -1;
				res.json(jsonRes);
				return;
			}
			console.log(presignedUrl);
			jsonRes.data.url = presignedUrl.postURL;
			jsonRes.data.formData = presignedUrl.formData;
			res.json(jsonRes);
		});
	}
	else {
		res.render('error', {
			'message': 'NO SUCH METHOD'
		});
	}
});

module.exports = router;
