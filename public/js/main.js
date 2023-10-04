import { codeLoad, code_add, code_save, showScreen, item_mouseover, sideHide, code_show, code_show_keydonw } from '/js/event.js'
import { Resize } from '/js/ui.js'
import { postJsonCategory } from './data.js'

const navul = document.querySelector(".navul");
const container = document.getElementById("container");


new Resize('.rz1').main()
new Resize('.rz2').main()


// 拖拽移动
const dragMove = (event) => {
	console.log(event)
}


// dragMousedown()

function dragMousedown() {
	let pressTimer;
	let isLongPress = true;

	const mousedown = (event) => {
		pressTimer = window.setTimeout(() => {
			if (!isLongPress) {
				container.addEventListener('mousemove', dragMove)
				isLongPress = true;
				window.clearTimeout(pressTimer);
			}
			isLongPress = false;
		}, 500);
	};


	// 鼠标长按
	container.addEventListener('mousedown', mousedown);
	container.addEventListener('mouseup', (event) => {
		// container.removeEventListener('mousemove', dragMove)
	});
}











// 拖拽移动
container.addEventListener("dragstart", (event) => {
	let item
	let jsonData = { "ids": [] }



	if (event.target.className.includes('select')) {
		console.log(event.target)
		item = event.target
	} else {
		if (event.target.className.includes('title')) {
			item = event.target.parentNode
		} else {
			return
		}
	}


	// 设置数据
	if (item.className.includes('select')) {
		let items = document.querySelectorAll('#container .item')
		items.forEach((subitem) => {
			if (subitem.className.includes('select')) {
				jsonData.ids.push(subitem.getAttribute("data-id"))
			}
		})
	} else {
		// item.classList.add("drag")
		jsonData.ids.push(item.getAttribute("data-id"))
	}
	// console.log("jsonData", jsonData)
	event.dataTransfer.setData("application/json", JSON.stringify(jsonData));
}, false)


// 拖拽结束，鼠标左键释放
container.addEventListener("dragend", (event) => {
	let item

	if (event.target.className.includes('select')) {
		item = event.target
	} else {
		item = event.target.parentNode
	}
	item.classList.remove("drag")
	for (let node of navul.childNodes) {
		if (node.className === 'drag') {
			node.classList.remove('drag')
		}
	}
}, false)

navul.addEventListener("dragover", (e) => {
	e.preventDefault();
	let lastNode = e.target

	if (e.target.nodeName === 'IMG') {
		// 遍历当前节点的父节点的所有子节点
		let currentItem = e.target.parentNode
		for (let node of currentItem.parentNode.childNodes) {
			if (node.isSameNode(currentItem)) {
				node.classList.add('drag')
			} else {
				if (node.className === 'drag') {
					node.classList.remove('drag')
				}
			}
		}
	}
})

navul.addEventListener("drop", (event) => {
	event.preventDefault();
	console.log("drop", event)
	// 获取数据
	const jsonData = JSON.parse(event.dataTransfer.getData("application/json"));
	const randomParam = Math.random().toString(36).substring(7);

	if (event.target.nodeName === 'IMG') {

		// 服务器修改分类
		postJsonCategory(jsonData, event.target.alt)

		// 修改图标
		for (let i = 0; i < jsonData.ids.length; i++) {
			let img = document.querySelector('div[data-id="' + jsonData.ids[i] + '"] .left img')
			img.src = "/icons/" + event.target.alt + ".svg?" + randomParam
			img.alt = event.target.alt
		}
	}
}, false)


// 加载代码
codeLoad()

// 侧边栏隐藏
sideHide()

// 布局
document.querySelector(".btgrid").addEventListener("click", function (e) {
	container.className = "layout-grid";
	// console.log("btgrid");
})
document.querySelector(".btlist").addEventListener("click", function (e) {
	container.className = "layout-list";
	// console.log("btgrid")
})
document.querySelector(".btflow").addEventListener("click", function (e) {
	container.className = "layout-flow";
	// console.log("btgrid");
})


// 显示代码
container.addEventListener("click", code_show, false)

// 点击软件图标
navul.addEventListener("click", code_add, false);


// 鼠标经过
container.addEventListener("mouseover", item_mouseover, false)

function logSelection(event) {
	const log = document.getElementById('log');
	const selection = event.target.value.substring(event.target.selectionStart, event.target.selectionEnd);
	log.textContent = `You selected: ${selection}`;
}

const input = document.querySelector('code');
input.addEventListener('select', logSelection);

// 按下空格
document.addEventListener("keydown", code_show_keydonw, false)

// 保存代码
document.getElementById("screen").addEventListener("click", code_save, false);

// 关闭 Esc
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		showScreen(false);
	}
});

// 阻止捕获
document.getElementById("article").addEventListener("click", function (e) {
	e.stopImmediatePropagation();
});

window.onload = function () { }