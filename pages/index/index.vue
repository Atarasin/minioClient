<template>
	<view class="content">
		<image class="images" src="/static/upload.png" @click="upload"></image>
		<image class="images" src="/static/download.png" @click="download"></image>
		<image class="images" src="/static/preview.png" @click="preview"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				minioClient: {},
				bucketName: 'images'
			}
		},
		onLoad() {
			// 初始化minio客户端
			this.minioClient = new this.Minio.Client(this.minioConfig)
			console.log("minioClient:", this.minioClient)
		},
		methods: {
			upload() {
				console.log("upload")
				
				let me = this
				
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						console.log("files:", res)
						
						let filePath = res.tempFilePaths[0]
						let file = res.tempFiles[0]
						
						// #ifdef H5
						let fileName = file.name;
						// #endif
						
						// #ifndef H5
						let fileName = 'test.png';
						// #endif
						
						console.log("file:", fileName, filePath)
						
						// 前端获得url
						// let policy = me.minioClient.newPostPolicy()
						// // Policy restricted only for bucket 'mybucket'.
						// policy.setBucket(me.bucketName)
						// // Policy restricted only for hello.txt object.
						// policy.setKey(fileName)
						
						// me.minioClient.presignedPostPolicy(policy, function (err, data) {
						// 	if (err) return console.log("err:", err)
						// 	console.log("presignedPostPolicy:", data)
							
						// 	// 上传图片
						// 	uni.uploadFile({
						// 		url: data.postURL,
						// 		filePath: filePath,
						// 		name: 'file',
						// 		formData: {
						// 			...data.formData
						// 		},
						// 		success: (uploadFileRes) => {
						// 			console.log(uploadFileRes);
						// 		}
						// 	})
						// })
						
						// 通过后端获取url
						me.getMinioUrl(me.bucketName, fileName, 'POST', function(res) {
							let data = res.data.data;
							uni.uploadFile({
								url: data.url,
								filePath: filePath,
								name: 'file',
								formData: {
									...data.formData
								},
								success: (uploadFileRes) => {
									console.log(uploadFileRes);
								}
							})
						})
					}
				})
			},
			download() {
				console.log("download")
				this.getMinioUrl(this.bucketName, 'test.png', 'GET', function(res) {
					// 下载图片
					uni.downloadFile({
						url: res.data.data.url,
						success: function(data) {
							console.log(data);
						},
					});
				})
			},
			preview() {
				console.log("preview")
				this.getMinioUrl(this.bucketName, 'test.png', 'GET', function(res) {
					// 预览图片
					uni.previewImage({
						urls: [res.data.data.url],
						longPressActions: {
							itemList: ['发送给朋友', '保存图片', '收藏'],
							success: function(data) {
								console.log(data);
							},
							fail: function(err) {
								console.log(err.errMsg);
							}
						}
					});
				})
			},
			// 访问服务器获得minio url
			getMinioUrl(bucket_name, object_name, method, cb) {
				uni.request({
					url: this.devUrl + `/api/getMinioUrl/${method}?bucket_name=${bucket_name}&object_name=${object_name}`,
					success: (res) => {
						console.log(res);
						cb(res);
					}
				})
			}
		}
	}
</script>

<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.images {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
</style>
