# minio客户端

测试minio基本功能，包括上传图片、图片预览与图片下载等。

## 1.minio镜像

minio开放了两个端口，9000用于API访问，9001可以在浏览器上访问控制台。

```powershell
# 拉取minio官方镜像
docker pull minio/minio
# 生成容器示例
docker run --name minio -p 9000:9000 -p 9001:9001 -v D:\docker\project\minio\data:/data minio/minio server /data --console-address ":9001"
```