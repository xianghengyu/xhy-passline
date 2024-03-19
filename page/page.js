let recode = false;
function isIPv4(ip) {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
}
function getIP(callback) {
  let RTCPeerConnection =
    window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection;
  if (!RTCPeerConnection) {
    let win = iframe.contentWindow;
    RTCPeerConnection =
      win.RTCPeerConnection ||
      win.mozRTCPeerConnection ||
      win.webkitRTCPeerConnection;
  }
  //创建实例，生成连接
  let pc = new RTCPeerConnection();
  // 匹配字符串中符合ip地址的字段
  function handleCandidate(candidate) {
    let ip_regexp =
      /([0-9]{1,3}(\.[0-9]{1,3}){3}|([a-f0-9]{1,4}((:[a-f0-9]{1,4}){7}|:+[a-f0-9]{1,4}){6}))/;
      
    let ip_isMatch = candidate.match(ip_regexp)[1];
    if (!recode && isIPv4(ip_isMatch)) {
      callback(ip_isMatch);
      recode = true;
    }
  }
  //监听icecandidate事件
  pc.onicecandidate = (ice) => {
    if (ice.candidate) {
      handleCandidate(ice.candidate.candidate);
    }
  };
  //建立一个伪数据的通道
  pc.createDataChannel("");
  pc.createOffer(
    (res) => {
      pc.setLocalDescription(res);
    },
    () => {}
  );

  //延迟，让一切都能完成
  // setTimeout(() => {
  //   let lines = pc.localDescription.sdp.split("\n");
  //   lines.forEach((item, index) => {
  //     if (item.indexOf("a=candidate:") === 0) {
  //       handleCandidate(item);
  //     }
  //   });
  //   }, 1000);
}
var qrcodeWidth = 200;
var qrcodeHeight = 200;
function showList() {
  getIP(function (newIp) {
    if(newIp){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var activeTab = tabs[0];
          if (activeTab) {
              const parsedUrl = new URL(activeTab.url);
              var qrcode = new QRCode(document.getElementById('result'),{width:qrcodeWidth,height:qrcodeHeight});
              if(parsedUrl.hostname == 'localhost' || parsedUrl.hostname == '127.0.0.1') {
                parsedUrl.hostname = newIp;
                qrcode.makeCode(parsedUrl.toString());
              } else {
                qrcode.makeCode(parsedUrl.toString());
              }
              
          }
      })
    } else {
      alert('IP获取失败～')
    }
  });
}
showList();

function dashang() {
    document.getElementById('dashang').addEventListener('click', function () {
        chrome.tabs.create({ url: 'https://xianghengyu.github.io/xhy-react/components/foo' });
    });
}
dashang();
