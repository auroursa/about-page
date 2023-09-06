const menu = document.querySelector('.menu-div');
let isScrolling = false;

// 添加 touchmove 事件监听器
document.addEventListener("touchmove", () => {
    isScrolling = true;
    // 在 iOS 上，开始滑动时执行的操作
    ScrollStart();
}, false);

// 添加 scroll 事件监听器
document.addEventListener("scroll", () => {
    // 在 iOS 上，滚动结束时执行的操作
    if (isScrolling) {
        Scroll();
    }
    // 在其他浏览器上，滚动时执行的操作
    else {
        const rect = menu.getBoundingClientRect();
        if (rect.top === 0) {
            menu.classList.add('at-top');
        } else {
            menu.classList.remove('at-top');
        }
    }
}, false);

function ScrollStart() {
    // 在 iOS 上，开始滑动时执行的操作
    // 可以在这里添加一些 iOS 特定的逻辑
}

function Scroll() {
    // 在 iOS 上，滚动结束时执行的操作
    // 在这里可以处理 iOS 上的滚动停止后的逻辑
    // 例如，添加或移除 'at-top' 类
    const rect = menu.getBoundingClientRect();
    if (rect.top === 0) {
        menu.classList.add('at-top');
    } else {
        menu.classList.remove('at-top');
    }
}

// 重置滑动状态
function ResetScrolling() {
    isScrolling = false;
}

// 添加 touchend 事件监听器，以确保滑动状态被正确重置
document.addEventListener("touchend", ResetScrolling, false);