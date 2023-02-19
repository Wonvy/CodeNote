

import { codeLoad, code_add, code_save, showScreen, item_mouseover, sideHide, code_show, code_show_keydonw } from '/js/event.js'
import { Resize } from '/js/ui.js'
import { postJsonCategory } from './data.js'



const navul = document.getElementsByClassName("navul");
const container = document.getElementById("container");

new Resize('.rz1').main()
new Resize('.rz2').main()






// 拖拽移动
container.addEventListener("dragstart", (event) => {
	// 设置数据
	event.target.parentElement.classList.add("drag")
	let data_id = event.target.parentNode.getAttribute("data-id")
	event.dataTransfer.setData('text/plain', data_id);
}, false)



// 拖拽结束，鼠标左键释放
container.addEventListener("dragend", (e) => {
	e.target.parentElement.classList.remove("drag")
	for (let node of navul[0].childNodes) {
		if (node.className === 'drag') {
			node.classList.remove('drag')
		}
	}
}, false)




navul[0].addEventListener("dragover", (e) => {
	let lastNode = e.target
	e.preventDefault();

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


navul[0].addEventListener("drop", (event) => {
	event.preventDefault();
	const data = event.dataTransfer.getData('text/plain');

	if (event.target.nodeName === 'IMG') {
		postJsonCategory(data, event.target.alt) //修改分类
		// let item = document.querySelector('div[data-id="' + data + '"]')
		let img = document.querySelector('div[data-id="' + data + '"] .left img')
		img.src = "icons/" + event.target.alt + ".svg"
		img.alt = event.target.alt
	}
}, false)



// navul[0].addEventListener("dragleave", (e) => {
// 	for (let node of navul[0].childNodes) {
// 		if (node.className === 'drag') {
// 			node.classList.remove('drag')
// 		}
// 	}
// })




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
navul[0].addEventListener("click", code_add, false);


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