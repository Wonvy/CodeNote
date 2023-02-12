


// 配置解析表单请求体：application/json
app.use(express.json())

// 解析解析表单请求体：application/x-www-form-urlencoded
app.use(express.urlencoded())

// 路由
app.post('/add', (req, res) => {
	console.log('body', req.body); // body undefined
})
