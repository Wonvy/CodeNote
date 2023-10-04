import { uuid, getNowDate, randomNum, escapeHTML, unescapeHTML } from './func.js'
import { postJsonAdd, postJsonDel, postJsonCategory } from './data.js'
export { postJsonCategory, code_show, code_add, code_save, showScreen, sideHide, item_mouseover, code_show_keydonw, codeLoad }


//取消选择
function item_UnSelect() {
	let items = document.querySelectorAll('#container .item')
	items.forEach((item) => {
		if (item.className.includes("select")) {
			item.classList.remove('select')
			item.draggable = false
		}
	});
}


// 显示代码框
function code_show(e) {
	const path = e.path || e.composedPath();
	const container = document.querySelector('#container')

	if (e.target.id === 'container') {
		item_UnSelect()
		return
	}

	try {
		const index = path.length;
		if (path[index - 8].className.includes("item")) {
			let item = path[index - 8];
			let itemID = item.getAttribute("data-id");
			console.log('e', e)

			// 按下ctrl键
			if (e.ctrlKey) {
				if (item.className.includes("select")) {
					item.classList.remove('select')
					item.draggable = false
				} else {
					item.classList.add('select')
					item.draggable = true
				}
				return
			}

			// 按下shift键
			if (e.shiftKey) {
				// 查找第一个
				let itemstart = document.querySelector('.item.select')
				if (itemstart === null) { return }
				// 父元素中的索引
				const indexA = Array.prototype.indexOf.call(itemstart.parentElement.children, itemstart);
				const indexB = Array.prototype.indexOf.call(itemstart.parentElement.children, item);
				const itemss = document.querySelectorAll('#container > .item')
				console.log("itemss", itemss)
				console.log(Math.min(indexA, indexB), Math.max(indexA, indexB))

				for (let i = Math.min(indexA, indexB); i <= Math.max(indexA, indexB); i++) {
					if (!itemss[i].className.includes("select")) {
						itemss[i].classList.add('select')
						itemss[i].draggable = true
					}
				}
				return
			}

			if (e.target.className.includes("select")) {
				// item_UnSelect()
				return
			}

			// 点击
			if (e.target.className.includes("title")) {
				// console.log('click title')
				return
			}

			// 删除代码
			if (e.target.className.includes("close")) {
				if (confirm("是否删除这条记录")) {
					postJsonDel(itemID) // 数据库删除
					item.remove() //删除
				}
				return
			}

			item_UnSelect()

			// showScreen(true, item.innerHTML);
		}
	} catch (err) {
		console.log('code_show:', err)
	}
}

// 添加代码
function code_add(e) {
	const path = e.path || e.composedPath();
	try {
		// alert(localStorage.getItem("json")); // 从本地读取json数据
		const index = path.length - 9;
		// console.log('navul', path);
		if (path[index].nodeName === "LI") {
			let src = path[index].firstElementChild.src;
			src = src.replace(path[index].firstElementChild.baseURI, "");
			codeNew(path[index].firstElementChild.alt, src, path[index].firstElementChild.alt); //新建代码
		}
	} catch (err) {
		console.log('code_add:', err)
	}
}

// 添加代码
function codeNew(otext, imgpath, alt) {
	otext = otext || "";
	imgpath = imgpath || "";
	alt = alt || imgpath;
	let container = document.getElementById("container");
	let item = document.createElement('div');
	let contenteditable = 'true'


	item.innerHTML = `<div class="item open" draggable="true" data-id="${uuid()}"><div class="title" draggable="true"><div class="left"><img src="${imgpath}" alt="${alt}"><h3 contenteditable="true">${otext}</h3></div><p class="right"><i class="codeFormat" tip="格式化"></i><i tip="最大化"></i><i class="close" tip="删除"></i></p></div><div class="item-content"><pre spellcheck="false" contenteditable="${contenteditable}"><code class="language-${otext}"></code></pre></div></div>`
	// console.log('container.firstElementChild', container.firstElementChild)

	if (container.firstElementChild == null) {
		let newitem = container.append(item.childNodes[0]);
	} else {
		let newitem = container.firstElementChild.before(item.childNodes[0]);
	}

	let input = container.firstElementChild.querySelector("pre");
	input.focus();

	showScreen(true, container.firstElementChild.innerHTML);
}

// 保存代码
function code_save(e) {
	// console.log(this.querySelector("code"))
	let open = container.querySelector(".open");
	let codeContent = (this.querySelector("code") == null) ? '' : this.querySelector("code").innerText;

	let title = this.querySelector(".title")
	let h3 = (title.querySelector("h3") == null) ? '/' : title.querySelector("h3").innerText;
	let language = (title.querySelector("img") == null) ? '/' : title.querySelector("img").alt;

	let dataid = open.getAttribute("data-id")
	// open.querySelector("code").innerHTML = codeContent;
	open.querySelector("h3").innerText = h3;

	let txtformat = codeformat(codeContent, language)
	// console.log(codeformat(open.querySelector("code").innerText))

	// hljs.highlightElement(this.querySelector("code"))


	open.querySelector("code").innerHTML = this.querySelector("code").innerHTML;
	// hljs.highlightElement(open.querySelector("code"))
	// hljs.initLineNumbersOnLoad();
	// hljs.initHighlightingOnLoad();
	// hljs.initLineNumbersOnLoad();
	// return
	// console.log(codeContent)

	// console.log(code.innerText); //返回输入数据
	let base =
	{
		"isDeleted": false,
		"isFavorites": false,
		"folderId": "",
		"tagsIds": [],
		"description": null,
		"name": h3,
		"content": [
			{
				"label": h3,
				"language": language,
				"value": txtformat
			}
		],
		"id": dataid,
		"createdAt": Date.now(),
		"updatedAt": Date.now()
	}

	postJsonAdd(base) // 添加数据
	showScreen(false) // 关闭详情
}

// 加载代码
async function codeLoad() {
	await fetch("./db.json")
		.then((response) => {
			return response.json();
		})
		.then((res) => {
			localStorage.setItem("json", JSON.stringify(res, null, 2)); // 存储本地浏览器
			const container = document.getElementById("container");
			for (let i = res.snippets.length - 1; i >= 0; i--) {
				let item = document.createElement('div');
				let codetext = document.createTextNode(res.snippets[i].content[0].value);
				let code = document.createElement('code')
				let contenteditable = 'false'
				// console.log(codetext)

				// codetext = codeformat(codetext) //格式化
				code.append(codetext)
				item.innerHTML = `<div class="item" data-id="${res.snippets[i].id}"><div class="title" draggable="true"><div class="left"><img src="icons/${res.snippets[i].content[0].language}.svg" alt="${res.snippets[i].content[0].language}"><h3 contenteditable="true" >${res.snippets[i].content[0].label}</h3></div><p class="right"><i class="codeFormat" tip="格式化"></i><i tip="最大化"></i><i class="close" tip="删除"></i></p></div><div class="item-content"> <pre spellcheck="false" contenteditable="${contenteditable}"><code class="language-${res.snippets[i].content[0].language}">${code.innerHTML}</code></pre></div></div>`
				// console.log(item.innerHTML)
				// console.log(escapeHTML(item.innerHTML))
				// let codetest = escapeHTML('<div class="item" data-id="09184a16-4c21-4a8e-83f7-b71b1446abd3"></div>')
				// console.log(codetest)
				// document.querySelector("code").innerText
				// console.log(codeformat(document.querySelector("code").innerText))

				// console.log(item.childNodes[0])
				container.append(item.childNodes[0])
			}
		});


	document.querySelectorAll("pre code").forEach((el) => {
		hljs.highlightElement(el); 	// 高亮代码
		// hljs.highlightAll()
		// hljs.initHighlighting();
		// hljs.highlightAuto(code, languageSubset)
	});
	// hljs.highlightAll()
	// hljs.initHighlightingOnLoad();
	hljs.initLineNumbersOnLoad();

}

// 显示代码
function code_show_keydonw(e) {
	let itemOn = container.querySelector(".on");
	if (e.key !== " ") {
		return false;
	}

	if (itemOn == null) {
		return false;
	}
	itemOn.classList.add("open")
	let itemhtml = itemOn.innerHTML
	// 替换自负床
	itemhtml = itemhtml.replace('contenteditable="false"', 'contenteditable="true"')
	// console.log(itemhtml)
	showScreen(true, itemhtml);
}

// 显示全屏div
function showScreen(show, html) {
	let open = container.querySelector(".open");
	let screen = document.getElementById("screen")
	let article = document.getElementById("article")
	let wrap = document.getElementById("wrap")
	if (show) {
		html = html || ""
		article.innerHTML = html;
		screen.style.opacity = "100%"
		screen.style.zIndex = "100"
		article.querySelector("pre").focus();
		wrap.classList.add("mask")
	} else {
		// console.log(open)
		if (open !== null) { open.classList.remove("open") }
		wrap.classList.remove("mask")
		screen.style.opacity = "0"
		screen.style.zIndex = "-99"
	}
}

// 鼠标经过
function item_mouseover(e) {
	let preview = document.getElementById("preview-wrap");
	const path = e.path || e.composedPath();

	try {
		const index = path.length;
		if (path[index - 8].className === "item") {

			// console.log("mouseover", path[index - 8]);
			preview.innerHTML = path[index - 8].innerHTML;
			path[index - 8].className = "item on";
			// console.log('path', path[index - 8].className);
			path[index - 8].addEventListener("mouseleave", function (e) {
				this.classList.remove("on")
			});
		}
	} catch (err) {
		// console.log(err)
	}
}

// 鼠标长按和弹起
function mousedown2(div, time, func1, func2) {
	let pressTimer;
	let isLongPress = true;
	const mousedown = (event) => {
		pressTimer = window.setTimeout(() => {
			isLongPress = false;
		}, time);
	};

	// 鼠标长按
	div.addEventListener('mousedown', mousedown);
	div.addEventListener('mouseup', (event) => {
		window.clearTimeout(pressTimer);
		if (isLongPress) {
			//单击
			// console.log('A')
			eval(func1)
			// menu_sidebar() 
		} else {
			//长按
			eval(func2)
			// console.log('B')
		}
		isLongPress = true
	});
}

// 侧边栏隐藏
function sideHide() {
	let menu = document.getElementById("menu");
	let preview = document.getElementById("preview-wrap");
	let rz1 = menu.querySelector('.resize')

	mousedown2(rz1, 150, 'menu_sidebar()', '')

	preview.addEventListener("click", function () {
		if (preview.className.includes("on")) {
			preview.classList.remove("on")
		} else {
			preview.classList.add("on")
		}
	});

}

// 侧边栏伸缩
function menu_sidebar() {
	let menu = document.getElementById("menu");
	let menu_width = menu.style.width
	if (menu_width == '') {
		if (menu.className.includes("on")) {
			menu.classList.remove("on")
			menu.style.width = '';
		} else {
			menu.classList.add("on")
			menu.style.width = '';
		}
	} else {
		menu.classList.remove("on")
		menu.style.width = '';
	}
}

// 格式化代码
function codeformat(code, language) {
	language = (language === "javascript") ? "typescript" : language
	if (language === "typescript" || language === "html" || language === "css") {
		return prettier.format(code, {
			parser: language, //格式化语言
			plugins: prettierPlugins,
		})
	} else {
		return code
	}
}