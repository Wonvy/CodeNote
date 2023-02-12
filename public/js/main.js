
import { codeLoad, code_add, code_save, showScreen, item_mouseover, sideHide, code_show, code_show_keydonw } from '/js/event.js'


// const hostURL = 'http://localhost:3000'
const navul = document.getElementsByClassName("navul");
const container = document.getElementById("container");

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