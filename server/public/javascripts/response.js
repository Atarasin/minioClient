function Response() {
	this.code = 0
	this.data = {
		url: '',
		formData: {
			bucket: "",
			key: ""
		}
	}
}

module.exports = {
	Response
}