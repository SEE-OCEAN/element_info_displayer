(function() {
  const _id = 'element_info_displayer';
  const option = {
    // 盒子偏移量
    boxOffset: 3,
    // 显示dom的布局
    showeleBox: true,
    // 显示dom的attr,
    showeleAttr: true
  };
  const boxStyle = `
    #${_id}{
      position: fixed;
      z-index: 999999;
      min-width: 180px;
      max-width: 48%;
      overflow-wrap: break-word;
      background: rgba(0, 0, 0, .72);
      color: white;
      border-radius: 5px;
      padding: 5px 10px 10px;
      display: none;
    }
    #${_id} h3{
      font-size: 15px;
      margin: 5px 0;
    }
    #${_id} span{
      font-size: 13px;
      border-bottom: 1px solid #444;
    }
  `;
  // 开关键（F7）
  window.onload = () => {
    document.body.addEventListener('keyup', e => {
      if (e.keyCode == 118) toggle();
    });
  };

  function toggle() {
    if (window.Spy === undefined) { // 创建
      window.Spy = {
        hide: function(e) {
          document.getElementById(_id).style.display = 'none';
        },
        show: function(e) {
          document.getElementById(_id).style.display = 'block';
        },
        glide: function(e) {
          let spyContainer = document.getElementById(_id);
          let left = e.clientX + option.boxOffset;
          let top = e.clientY + option.boxOffset;
          if (left + spyContainer.offsetWidth > window.innerWidth) {
            left -= spyContainer.offsetWidth;
            if (left < 0) {
              spyContainer.offsetWidth = spyContainer.offsetWidth + left - 23;
            }
          }
          if (top + spyContainer.offsetHeight > window.innerHeight) {
            top -= spyContainer.offsetHeight;
          }
          spyContainer.style.left = left + 'px';
          spyContainer.style.top = top + 'px';
          spyContainer.innerHTML = window.Spy.getInfoOf(e.target);
        },
        getInfoOf: function(ele) {
          if (ele == window.Spy.container) return;
          let str = '';
          const nodeName = window.Spy.createDom(ele.nodeName.toLowerCase(), 'h3', 'white');
          str += nodeName;
          // 布局和边框
          if (option.showeleBox) {
            let data = {
              width: ele.offsetWidth + 'px',
              height: ele.offsetHeight + 'px',
              margin: window.getComputedStyle(ele, null).margin,
              padding: window.getComputedStyle(ele, null).padding,
              'font-size': window.getComputedStyle(ele, null).fontSize,
              color: window.getComputedStyle(ele, null).color,
              background: window.getComputedStyle(ele, null).background,
              border: window.getComputedStyle(ele, null).border,
              scrollTop: ele.scrollTop
            };
            str += Object.keys(data).reduce((s, key) => {
              if (!data[key]) return s;
              s += window.Spy.createDom(window.Spy.createDom(key, 'span', '#fe9a9a') + (data[key] ? window.Spy.createDom('= ', 'span', 'rgba(255,255,255,0.75)') + data[key] : '')) + '<br>'
              return s;
            }, '');
          }
          // 属性
          if (option.showeleAttr) {
            str += Array.from(ele.attributes).reduce((s, attr) => {
              s += window.Spy.createDom(window.Spy.createDom(attr.nodeName, null, '#ffffcc') + (attr.nodeValue ? window.Spy.createDom('= ', 'span', 'rgba(255,255,255,0.75)') + '"' + attr.nodeValue + '"' : '')) + '<br>';
              return s;
            }, '');
          }
          // 返回信息
          return str;
        },
        createDom: function(msg, nodeType = 'span', color = '#fff') {
          return `<${nodeType} style="color: ${color};">${msg}</${nodeType}>`;
        },
        create: function() {
          // 创建信息窗口
          const box = document.createElement('div');
          box.id = _id;
          document.body.appendChild(box);
          // 窗口样式
          const styleElement = document.createElement('style');
          styleElement.innerHTML = boxStyle;
          $('head').appendChild(styleElement);
          return box;
        },
        open: function() {
          document.body.addEventListener('mousemove', window.Spy.glide);
          document.body.addEventListener('mouseover', window.Spy.show);
          document.body.addEventListener('mouseleave', window.Spy.hide);
          window.Spy.show();
          window.isSpyOpen = true;
        },
        close: function() {
          document.body.removeEventListener('mouseover', window.Spy.show);
          document.body.removeEventListener('mouseleave', window.Spy.hide);
          window.Spy.hide();
          window.isSpyOpen = false;
        }
      };
      window.Spy.create();
      window.Spy.open();
    } else { // 开关
      window.isSpyOpen = !window.isSpyOpen;
      window.isSpyOpen ? window.Spy.open() : window.Spy.close();
    }
    // 打印状态
    console.log('观察元素：' + {
      'true': '已打开',
      'false': '已关闭'
    } [window.isSpyOpen]);
  };

  function $(ele) {
    return document.querySelector(ele);
  };

})()
