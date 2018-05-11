/*
 * 微信授权及分享公共方法
 */

//用户微信授权登录，__src是要回调跳转的地址，注意：这个地址的域名得是在微信公众平台设定过的
function userSign(__src) {
	var __url = __src;
	$.ajax({
		url: '/wx-help/generates-authorize-url',
		type: "POST",
		//dataType: "json",
		data: {
			'url': __url
		},
		success: function(msg) {
			//configWxShare(msg);
			console.log(msg);
			window.location.href = msg;
		}
	});
}

/*
 * 获取用户openid
 * __code是上面获取的用户的code，用这个code去获取openid等用户信息
 * __src是回调的地址，如果获取openid失败，则用它再去调用微信授权方法
 * fn是回调方法，把获取的值回调回去
 * */
function getOpenID(__code, __src, fn) {
	$.ajax({
		url: '/wx-help/get-user-info', //get-page-accesstoken  get-user-info
		type: "POST",
		data: {
			'code': __code
		},
		success: function(res) {
			res = JSON.parse(res);
			if(res.status == 'error') {
				userSign(__src);
			} else {
				if(fn) {
					fn(res);
				}
			}
		}
	});
}

//===============================================分享部分===========================================//
$.ajax({
	url: '/wx-help/get-wx-config',
	type: "POST",
	dataType: "json",
	success: function(msg) {
		configWxShare(msg);
	}
});

var shareObj = {
	sharePath: "", //分享地址
	shareImg: "", //分享图片
	shareTitle: "", //分享title
	shareDesc: "" //分享描述
};

function configWxShare(a) {
	wx.config({
		debug: false,
		appId: a.appid,
		timestamp: a.timestamp,
		nonceStr: a.nonceStr,
		signature: a.signature,
		jsApiList: [
			'checkJsApi',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo'
		]
	});

	wx.ready(function() {
		setShare();
	});
}

function setShare() {
	// 分享到朋友圈
	wx.onMenuShareTimeline({
		title: shareObj.shareTitle, // 分享标题
		link: shareObj.sharePath, // 分享链接
		imgUrl: shareObj.shareImg, // 分享图标
		success: function() {},
		cancel: function() {
			// 用户取消分享后执行的回调函数
		}
	});
	//分享给朋友
	wx.onMenuShareAppMessage({
		title: shareObj.shareTitle, // 分享标题
		desc: shareObj.shareDesc, // 分享描述
		link: shareObj.sharePath, // 分享链接
		imgUrl: shareObj.shareImg, // 分享图标
		type: 'link', // 分享类型,music、video或link，不填默认为link
		dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		success: function() {},
		cancel: function() {
			// 用户取消分享后执行的回调函数
		}
	});
}