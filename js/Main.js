var wid, hei;
var clock, delta;
var stats;

var gameBegin = false;

var pixi; //pixi领域
var threejs; //threejs领域

$(function() {
	shareObj = {
		sharePath: "http://h5n.180china.com/lab/mazeGame/index.html", //分享地址
		shareImg: "http://h5n.180china.com/lab/mazeGame/images/icon.jpg", //分享图片
		shareTitle: "欢乐走迷宫", //分享title
		shareDesc: "可好玩了" //分享描述
	};
	setShare();

	clock = new THREE.Clock();
	delta = clock.getDelta();

	getSize(); //获取场景大小

	//初始化threejs领域
	threejs = new ThreeArea();
	threejs.init(wid, hei);

	//初始化pixi领域
	pixi = new PixiArea();
	pixi.init(wid, hei);
	pixi.createLoading(loadingComplete);

	//initShader(); //初始化shader
	render();
});

//加载完成的回调函数
function loadingComplete() {
	threejs.create_floor(); //创建地板
	threejs.create_Maze(); //创建迷宫
	threejs.initHitBall(); //初始化碰撞球球
	threejs.initAction(); //threejs点击交互

	pixi.createRocker(setCameraBox); //创建摇杆
}

function getSize() {
	wid = window.innerWidth;
	hei = window.innerHeight;
	windowHalfX = wid / 2;
}

//改变threejs控制器状态
function controlState(__state) {
	threejs.controlState(__state);
}
//==================================================================================================//

function initStats() {
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '50px';
	stats.domElement.style.zIndex = 100;
	document.getElementById('pixiStage').appendChild(stats.domElement);
}

//===========================================指导文字=============================================//

function tipIn() {
	pixi.tipIn(); //提示文字
	pixi.btnIn(threejs.changeCamera); //改变视角按钮
	pixi.keysIcon(); //钥匙图标
}

//=============================================通过摇杆改变摄像头盒子的位置================================================//
function setCameraBox(__speedX, __speedZ) {
	threejs.setCameraBox(__speedX, __speedZ);
}

//==================================================================================================//
function render() {
	delta = clock.getDelta();
	if(pixi) {
		pixi.update(delta);
	}
	if(threejs) {
		threejs.update(delta);
	}

	requestAnimationFrame(render);
}

//=====================删除钥匙========================//
function delKey() {
	threejs.delKey();
	gameBegin = true;
	pixi.keysChange(); //改变钥匙图标状态
}