export { uuid, randomNum, getNowDate, escapeHTML, unescapeHTML }
// export * from …

// 生成uuid
function uuid() {
	var s = [];
	var x = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = x.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";
	s[19] = x.substr((s[19] & 0x3) | 0x8, 1);
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}

// 替换html字符串
function unescapeHTML(str) {
	str = str.replace(/&gt;/g, ">")
	str = str.replace(/&lt;/g, "<")
	str = str.replace(/&amp;/g, "&")
	str = str.replace(/&quot;/g, '"')
	str = str.replace(/&apos;/g, "'")
	return str;
}

// 替换html字符串
function escapeHTML(str) {
	str = str.replace(/&/g, "&amp;")
	str = str.replace(/</g, "&lt;")
	str = str.replace(/>/g, "&gt;")
	str = str.replace(/"/g, "&quot;")
	str = str.replace(/'/g, "&apos;")
	return str
}


// 当前日期
function getNowDate() {
	var myDate = new Date();
	var year = myDate.getFullYear(); //获取当前年
	var mon = myDate.getMonth() + 1; //获取当前月
	var date = myDate.getDate(); //获取当前日
	var hours = myDate.getHours(); //获取当前小时
	var minutes = myDate.getMinutes(); //获取当前分钟
	var seconds = myDate.getSeconds(); //获取当前秒
	var now =
		year + "-" + mon + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
	return now;
}

// 字符串 转 html
function parseElement(str) {
	let o = document.createElement('div');
	o.innerHTML = str;
	return o.childNodes[0];
}

// 添加img
function addImage() {
	let items = document.querySelectorAll("div.item");
	// let img = document.getElementsByTagName("img");
	for (let i = 0; i < items.length; i++) {
		let img = document.createElement("img");
		let imgwidth = randomNum(200, 300);
		let imgheight = randomNum(100, 500);
		img.src =
			"https://source.unsplash.com/random/" + imgwidth + "x" + imgheight;
		img.style.width =
			Math.round((items[i].clientHeight / imgheight) * imgwidth) + "px";
		img.style.height = "195px";
		items[i].append(img);
	}
}
// 返回区域随机值
function randomNum(max, min) {
	const num = Math.floor(Math.random() * (max - min + 1)) + min;
	return num;
}
