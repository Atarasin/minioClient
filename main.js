import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { Minio } from 'minio-js'

export function createApp() {
  const app = createSSRApp(App)
  
  app.config.globalProperties.Minio = Minio
  app.config.globalProperties.minioConfig = {
	endPoint: '127.0.0.1',
	port: 9000,
	useSSL: false,
	accessKey: 'AiEj4haD2O0KwVOsqPcA',
	secretKey: 'b8QLLjv1MxcyRfzlv5bbVQgo3vMblvrhq42bRjrw',
  }
  
  app.config.globalProperties.mockUrl = 'http://127.0.0.1:4523/m1/3907110-0-default'
  app.config.globalProperties.devUrl = 'http://127.0.0.1:3000'
  
  return {
    app
  }
}
// #endif