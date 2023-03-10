export { Resize }

class Resize {
	constructor(name) {
		this.name = name;
	}
	main() {
		let start_screenX = 0
		let start_clientWidth = 0; // 开始宽度
		let start_leftX = 0 // 最左边
		let end_clientWidth = 0 // 结束宽度
		let resize = getelement(this.name)
		let parent = resize.parentNode

		resize.addEventListener("mousedown", mousedown, false)

		// 获取元素
		function getelement(name) {
			if (name.indexOf(".") != -1) {
				let resize = document.getElementsByClassName(name.substr(1))[0]
				return resize
			}
			if (name.indexOf("#") != -1) {
				let resize = document.getElementById(name.substr(1))
				return resize
			}
		}

		// 判断点击位置
		function mousehas(x, y) {
			if (x < parent.offsetLeft) {
				// console.log(1)
				return false
			}
			if (x > parent.offsetLeft + parent.offsetWidth) {
				// console.log(2)
				return false
			}
			if (y < parent.offsetTop) {
				// console.log(3)
				return false
			}
			if (y > parent.offsetTop + parent.offsetHeight) {
				// console.log(parent.offsetTop, parent.offsetHeight)
				// console.log(4)
				return false
			}
			return true
		}
		// 鼠标按下
		function mousedown(event) {
			if (!mousehas(event.clientX, event.clientY)) {
				return false
			}
			parent.classList.remove('mg')
			start_clientWidth = parent.offsetWidth
			start_screenX = event.clientX
			start_leftX = parent.offsetLeft
			document.addEventListener("mousemove", mousemove, false)
			document.addEventListener("mouseup", mouseup, false)
		}
		// 鼠标移动
		function mousemove(event) {
			end_clientWidth = start_clientWidth + (event.clientX - start_screenX)
			if (end_clientWidth <= 0) { end_clientWidth = resize.offsetWidth / 2 }
			parent.style.flex = 'none';
			parent.style.width = end_clientWidth + 'px';
		}
		// 鼠标弹起
		function mouseup(event) {
			parent.classList.add('mg');
			document.removeEventListener("mousemove", mousemove, false)
		}

	}

}