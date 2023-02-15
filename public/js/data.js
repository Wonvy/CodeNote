export { postJsonAdd, postJsonDel }

// const hostURL = ''
// const hostURL = 'http://192.168.6.126:3000'
// const hostURL = 'http://127.0.0.1:3000'
const hostURL = ''

// 添加数据
async function postJsonAdd(data) {
	await fetch(hostURL + '/json/add/', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((response) => {
			console.log(response)
		})
}

// 删除数据
async function postJsonDel(id) {
	let data = {
		"delete": [
			{
				"id": id
			}
		]
	}
	// console.log(hostURL + '/json/del/')
	// console.log(data)
	let URL = hostURL + '/json/del/'
	await fetch(URL, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((response) => {
			return response
		})
}



// 返回json
function getfetch(url) {
	fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((res) => {
			readJson(res);
		});
}

// 读取json文件
function readJson(obj) {
	// console.log("obj", obj);
	for (let i = 0; i < obj.snippets.length; i++) {
		// console.log(obj.snippets[i].content[0].value);
	}
}

// 写入json
function writeJson(obj) {
	console.log("obj", obj);
	for (let i = 0; i < obj.snippets.length; i++) {
		console.log(obj.snippets[i].content[0].value);
	}
}
