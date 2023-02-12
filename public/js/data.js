export { postJsonAdd, postJsonDel }

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
	await fetch(hostURL + '/json/del/', {
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
