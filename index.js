const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const { getDb } = require('./db')
const { SetDb } = require('./db')


const port = 3333


// 静态资源目录 最好使用绝对路径
// app.use('/public', express.static(path.join(__dirname, 'public'), {
// 	index: 'index.html'
// }));

app.use('/public', express.static(__dirname + '/public'));

// 配置解析表单请求体：application/json
app.use(express.json())
// 解析解析表单请求体：application/x-www-form-urlencoded
app.use(express.urlencoded())
// 中间件
app.use((req, res, next) => {
	if (req.method === 'POST') {
		console.log('Received POST request with parameters:', req.body);
	}
	console.log('app.use', req.method, req.url, Date.now())
	// console.log(req.method, req.url, req.body, Date.now())
	// 继续走
	next()//调用下个匹配的中间件
})

// 路由 有 顺序
app.get('/mycode', (req, res) => {
	console.log('app.get', req.method, req.url, Date.now())
	// res.send('Hello, mycode!');
	// return;
	fs.readFile('./public/index.html', (err, data) => {
		if (err) {
			return res.status(404).send('404错误找不到文件index23.html')
		}
		res.end(data)
	})
})

// 路由-添加
app.post('/mycode/json/add', async (req, res) => {
	// console.log('params', req.params);
	// console.log('body', req.body);
	let jsonData = req.body;  //获取请求 体参数json
	let hasId = false;

	try {
		// 读取数据
		let db = await getDb()
		let text = '修改'

		for (let i = 0; i < db.snippets.length; i++) {
			if (db.snippets[i].id === jsonData.id) {
				hasId = true;
				// 保留创建时间
				console.log(db.snippets[i])
				jsonData.createdAt = db.snippets[i].createdAt
				db.snippets[i] = jsonData
				console.log(db.snippets[i])
				break
			}
		}

		if (!hasId) {
			text = '添加'
			db.snippets.push(jsonData) // 添加对象
		}

		// 写入数据
		fs.writeFileSync('./public/db.json', JSON.stringify(db, null, 2), 'utf8', err => {
			console.log(err)
		})
		db = await getDb()
		res.status(200).json(text)

	} catch (err) {
		res.status(499).json({
			error: err.message
		})
	}
})


// 路由-分类
app.post('/mycode/json/category', async (req, res) => {
	// console.log('params', req.params);
	// console.log('body', req.body);
	const jsonData = req.body;  //获取请求体参数json
	try {
		// 读取数据
		let db = await getDb()
		let State = false

		// 加工数据
		for (let i = 0; i < db.snippets.length; i++) {
			// 根据snippets
			for (let o = 0; o < jsonData.category.length; o++) {
				if (db.snippets[i].id === jsonData.category[o].id) {
					db.snippets[i].content[0].language = jsonData.category[o].language
					State = true //有修改
					break
				}
			}
		}

		//写入数据
		if (State) {
			fs.writeFileSync('./public/db.json', JSON.stringify(db, null, 2), 'utf8', err => {
				console.log(err)
			})
			res.status(200).json("修改分类成功")
		} else {
			res.status(200).json("找不到")
		}
	} catch (err) {
		res.status(499).json({
			error: err.message
		})
	}
})


// 路由-删除
app.post('/mycode/json/del', async (req, res) => {
	// console.log('params', req.params);
	// console.log('body', req.body);
	console.log('删除成功');
	const jsonData = req.body;  //获取请求体参数json
	// console.log(jsonData)
	try {
		// 读取数据
		let db = await getDb()
		let delState = false


		// 加工数据
		for (let i = 0; i < db.snippets.length; i++) {
			if (db.snippets[i].id === jsonData.delete[0].id) {
				db.snippets.splice(i, 1)
				delState = true;
				break
			}
		}

		//写入数据
		if (delState) {
			fs.writeFileSync('./public/db.json', JSON.stringify(db, null, 2), 'utf8', err => {
				console.log(err)
			})
			res.status(200).json("修改成功")
		} else {
			res.status(200).json("找不到")
		}

	} catch (err) {
		res.status(499).json({
			error: err.message
		})
	}
})

// 路由
app.get('/mycode/list/add/:id', (req, res) => {
	res.send(req.params); //返回输入的参数，参数是json
})

// 路由-添加
app.post('/mycode/add', async (req, res) => {
	// console.log('params', req.params);
	console.log('body', req.body);
	const url = req.body;  //获取请求体参数
	// 数据验证
	// if (!url.title) {
	// 	return res.status(501).json({
	// 		error: 'The fieidssssssssssss title is required'
	// 	})
	// }

	try {
		const db = await getDb()
		res.status(200).json(db)
	} catch (err) {
		res.status(499).json({
			error: err.message
		})
	}
	// fs.readFile('./public/title.json', 'utf8', (err, data) => {
	// 	// 如果错误
	// 	if (err) {
	// 		console.log('err 2.1')
	// 		return res.status(500).json({
	// 			error: err.messange
	// 		})
	// 	}
	// 	const db = JSON.parse(data)
	// 	res.status(200).json(db.urls)
	// })
	// res.send(req.body); //返回输入的参数，参数是json
})

app.listen(port, () => {
	console.log(`监听端口${port}示例应用`)
})