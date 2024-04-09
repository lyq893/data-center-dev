import Vue from 'vue';

/*
*  使用方法
*  将以下代码复制到一个js文件中，然后在入口文件main.js中import引入即可；
*  给elementUI的dialog上加上 v-dialogDrag 指令就可以实现弹窗的全屏和拉伸了。
*  给dialog设置 :close-on-click-modal="false" , 禁止点击遮罩层关闭弹出层
*  如果是form表单，不要将提交等按钮放置el-form-item，以免在上下拉伸时被隐藏
*/
// v-dialogDrag: 弹窗拖拽+水平方向伸缩
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    // 弹框可拉伸最小宽高
    const minWidth = 400;
    const minHeight = 300;
    // 初始非全屏
    const isFullScreen = false;
    // 当前宽高
    const nowWidth = 0;
    const nowHight = 0;
    // 当前顶部高度
    const nowMarginTop = 0;
    // 获取弹框头部（这部分可双击全屏）
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    // 弹窗
    const dragDom = el.querySelector('.el-dialog');
    // 给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
    dragDom.style.overflow = 'auto';
    // 清除选择头部文字效果
    // dialogHeaderEl.onselectstart = new Function("return false");
    // 头部加上可拖动cursor
    dialogHeaderEl.style.cursor = 'move';
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
    const moveDown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;
      // 获取到的值带px 正则匹配替换
      let styL, styT;
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100);
        styT = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/\px/g, '');
        styT = +sty.top.replace(/\px/g, '');
      }
      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX;
        const t = e.clientY - disY;
        // 移动当前元素
        dragDom.style.left = `${l + styL}px`;
        dragDom.style.top = `${t + styT}px`;
        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
        // 鼠标往上移动 弹窗header不超出页面最顶
        if (dialogHeaderEl.getBoundingClientRect().top <= 0) {
          dragDom.style.top = dragDom.style.top.replace(/\px/g, '') - dialogHeaderEl.getBoundingClientRect().top + 'px';
        }
        // 鼠标往下移动，弹窗header不超出页面最底
        if (window.innerHeight - dragDom.getBoundingClientRect().top - dragDom.getBoundingClientRect().height <= 0) {
          dragDom.style.top = window.innerHeight - dragDom.getBoundingClientRect().height + (dragDom.style.top.replace(/\px/g, '') - dialogHeaderEl.getBoundingClientRect().top) + 'px';
        }
        // 鼠标往左移动，弹窗header不超出页面最左
        if (dialogHeaderEl.getBoundingClientRect().left <= 0) {
          dragDom.style.left = dragDom.style.left.replace(/\px/g, '') - dialogHeaderEl.getBoundingClientRect().left + 'px';
        }
        // 鼠标往右移动，弹窗header不超出页面最右
        if (dialogHeaderEl.getBoundingClientRect().left + dialogHeaderEl.getBoundingClientRect().width >= window.innerWidth) {
          dragDom.style.left = ((window.innerWidth - dialogHeaderEl.getBoundingClientRect().width) / 2) + 'px';
        }
      };
      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
    dialogHeaderEl.onmousedown = moveDown;
    // 双击头部全屏效果
    /*
        dialogHeaderEl.ondblclick = (e) => {
          if (isFullScreen == false) {
            nowHight = dragDom.clientHeight;
            nowWidth = dragDom.clientWidth;
            nowMarginTop = dragDom.style.marginTop;
            dragDom.style.left = 0;
            dragDom.style.top = 0;
            dragDom.style.height = "100VH";
            dragDom.style.width = "100VW";
            dragDom.style.marginTop = 0;
            isFullScreen = true;
            dialogHeaderEl.style.cursor = 'initial';
            dialogHeaderEl.onmousedown = null;
          } else {
            dragDom.style.height = "auto";
            dragDom.style.width = nowWidth + 'px';
            dragDom.style.marginTop = nowMarginTop;
            isFullScreen = false;
            dialogHeaderEl.style.cursor = 'move';
            dialogHeaderEl.onmousedown = moveDown;
          }
        }*/
    el.onmousemove = function(e) {
      const moveE = e;
      // if (e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 || dragDom.offsetLeft + 10 > e.clientX) {
      //   dragDom.style.cursor = 'w-resize';
      // } else if (el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight - 10) {
      //   dragDom.style.cursor = 's-resize';
      // } else {
      //   dragDom.style.cursor = 'default';
      //   dragDom.onmousedown = null;
      // }
      if (sty.marginLeft !== sty.marginRight) {
        if (sty.marginLeft && sty.marginLeft.includes('px') && dragDom.style.marginLeft !== 'auto') {
          dragDom.style.left = sty.marginLeft.replace(/\px/g, '') - (document.body.clientWidth - sty.width.replace(/\px/g, '')) / 2 + 'px';
          dragDom.style.marginLeft = 'auto';
          dragDom.style.marginRight = 'auto';
        } else if (sty.marginRight && sty.marginRight.includes('px') && dragDom.style.marginRight !== 'auto') {
          dragDom.style.left = (document.body.clientWidth - sty.width.replace(/\px/g, '')) / 2 - sty.marginRight.replace(/\px/g, '') + 'px';
          dragDom.style.marginLeft = 'auto';
          dragDom.style.marginRight = 'auto';
        }
      }
      if ((e.clientX >= dragDom.offsetLeft + dragDom.clientWidth) && (e.clientX < dragDom.offsetLeft + dragDom.clientWidth + 10)) { // 右
        if ((el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight - 10) && (el.scrollTop + e.clientY < dragDom.offsetTop + dragDom.clientHeight + 10)) {
          el.style.cursor = 'se-resize';
          dragDom.style.cursor = 'se-resize';
        } else {
          el.style.cursor = 'w-resize';
          dragDom.style.cursor = 'w-resize';
        }
      } else if ((e.clientX > dragDom.offsetLeft - 10) && (e.clientX <= dragDom.offsetLeft)) { // 左
        if ((el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight - 10) && (el.scrollTop + e.clientY < dragDom.offsetTop + dragDom.clientHeight + 10)) {
          el.style.cursor = 'sw-resize';
          dragDom.style.cursor = 'sw-resize';
        } else {
          el.style.cursor = 'w-resize';
          dragDom.style.cursor = 'w-resize';
        }
      } else if ((el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight) && (el.scrollTop + e.clientY < dragDom.offsetTop + dragDom.clientHeight + 10)) {
        el.style.cursor = 's-resize';
        dragDom.style.cursor = 's-resize';
      } else {
        el.style.cursor = 'default';
        dragDom.style.cursor = 'default';
        dragDom.onmousedown = null;
      }
      el.onmousedown = (e) => {
        const clientX = e.clientX;
        const clientY = e.clientY;
        const elW = dragDom.clientWidth;
        const elH = dragDom.clientHeight;
        const EloffsetLeft = dragDom.offsetLeft;
        const EloffsetTop = dragDom.offsetTop;
        dragDom.style.userSelect = 'none';
        const ELscrollTop = el.scrollTop;
        let isInnerEle = false;
        if (e.path) {
          for (let i = 0; i < e.path.length; i++) {
            if (e.path[i].className) {
              if (e.path[i].className.toString().indexOf('el-tree') != -1) {
                isInnerEle = true;
              }
            }
          }
        }
        // 判断点击的位置是不是为头部
        if (clientX > EloffsetLeft && clientX < EloffsetLeft + elW && clientY > EloffsetTop && clientY < EloffsetTop + 100) {
          // 如果是头部在此就不做任何动作，以上有绑定dialogHeaderEl.onmousedown = moveDown;
        } else if (isInnerEle) {
          // 如果鼠标拖动的是el-tree，则不做处理
        } else {
          document.onmousemove = function(e) {
            // fix-bug 开启弹窗拖拽时，里面的树组件无法拖拽排序
            // e.preventDefault(); // 移动时禁用默认事件
            // 左侧鼠标拖拽位置
            // if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
            //   //往左拖拽
            //   if (clientX > e.clientX) {
            //     dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px';
            //   }
            //   //往右拖拽
            //   if (clientX < e.clientX) {
            //     if(dragDom.clientWidth < minWidth){
            //     }else{
            //       dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px';
            //     }
            //   }
            // }
            let alterNum = 1; // 弹出层的变更高度的份数
            const elCss = window.getComputedStyle(el, null); // 获取元素经浏览器计算后的css样式值
            // 弹性垂直居中时，上下同时变更高度
            if (elCss.display === 'flex' && elCss['flex-direction'] === 'column' && elCss['justify-content'] === 'center') {
              alterNum = 2;
            }
            if (clientX > EloffsetLeft - 10 && clientX <= EloffsetLeft) {
              if (ELscrollTop + clientY > EloffsetTop + elH - 10 && ELscrollTop + clientY < EloffsetTop + elH + 10) {
                // 往上拖拽
                if (clientY > e.clientY) {
                  if (dragDom.clientHeight < minHeight) {
                  } else {
                    dragDom.style.height = elH - (clientY - e.clientY) * alterNum + 'px';
                  }
                }
                // 往下拖拽
                if (clientY < e.clientY) {
                  dragDom.style.height = elH + (e.clientY - clientY) * alterNum + 'px';
                }
                // 往左拖拽
                if (clientX > e.clientX && dialogHeaderEl.getBoundingClientRect().left + dialogHeaderEl.getBoundingClientRect().width <= window.innerWidth) {
                  dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px';
                }
                // 往右拖拽
                if (clientX < e.clientX) {
                  if (dragDom.clientWidth < minWidth) {
                  } else {
                    dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px';
                  }
                }
              } else {
                // 往左拖拽
                if (clientX > e.clientX && dialogHeaderEl.getBoundingClientRect().left + dialogHeaderEl.getBoundingClientRect().width <= window.innerWidth) {
                  dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px';
                }
                // 往右拖拽
                if (clientX < e.clientX) {
                  if (dragDom.clientWidth < minWidth) {
                  } else {
                    dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px';
                  }
                }
              }
            }
            // 右侧鼠标拖拽位置
            // if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
            //   //往左拖拽
            //   if (clientX > e.clientX) {
            //     if (dragDom.clientWidth < minWidth) {
            //     } else {
            //       dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px';
            //     }
            //   }
            //   //往右拖拽
            //   if (clientX < e.clientX) {
            //     dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px';
            //   }
            // }
            if (clientX > EloffsetLeft + elW && clientX < EloffsetLeft + elW + 10) {
              if (ELscrollTop + clientY > EloffsetTop + elH - 10 && ELscrollTop + clientY < EloffsetTop + elH + 10) {
                // 往上拖拽
                if (clientY > e.clientY) {
                  if (dragDom.clientHeight < minHeight) {
                  } else {
                    dragDom.style.height = elH - (clientY - e.clientY) * alterNum + 'px';
                  }
                }
                // 往下拖拽
                if (clientY < e.clientY) {
                  dragDom.style.height = elH + (e.clientY - clientY) * alterNum + 'px';
                }
                // 往左拖拽
                if (clientX > e.clientX) {
                  if (dragDom.clientWidth < minWidth) {
                  } else {
                    dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px';
                  }
                }
                // 往右拖拽
                if (clientX < e.clientX && dialogHeaderEl.getBoundingClientRect().left >= 0) {
                  dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px';
                }
              } else {
                // 往左拖拽
                if (clientX > e.clientX) {
                  if (dragDom.clientWidth < minWidth) {
                  } else {
                    dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px';
                  }
                }
                // 往右拖拽
                if (clientX < e.clientX && dialogHeaderEl.getBoundingClientRect().left >= 0) {
                  dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px';
                }
              }
            }
            // 底部鼠标拖拽位置
            // if (ELscrollTop + clientY > EloffsetTop + elH - 20 && ELscrollTop + clientY < EloffsetTop + elH) {
            //   //往上拖拽
            //   if (clientY > e.clientY) {
            //     if (dragDom.clientHeight < minHeight) {
            //     } else {
            //       dragDom.style.height = elH - (clientY - e.clientY) * 2 + 'px';
            //     }
            //   }
            //   //往下拖拽
            //   if (clientY < e.clientY) {
            //     dragDom.style.height = elH + (e.clientY - clientY) * 2 + 'px';
            //   }
            // }
            if (ELscrollTop + clientY > EloffsetTop + elH && ELscrollTop + clientY < EloffsetTop + elH + 10) {
              // 往上拖拽
              if (clientY > e.clientY) {
                if (dragDom.clientHeight < minHeight) {
                } else {
                  dragDom.style.height = elH - (clientY - e.clientY) * alterNum + 'px';
                }
              }
              // 往下拖拽
              if (clientY < e.clientY) {
                if (window.innerHeight - dragDom.getBoundingClientRect().top - dragDom.getBoundingClientRect().height >= 0) {
                  dragDom.style.height = elH + (e.clientY - clientY) * alterNum + 'px';
                }
              }
            }
          };
          // 拉伸结束
          document.onmouseup = function(e) {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        }
      };
    };
  }
});
