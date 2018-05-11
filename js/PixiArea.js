/*
 * PIXI部分的程序
 */

function PixiArea() {
	//私有变量
	var wid;
	var hei;

	var app, stage, container;
	var pixiControl;
	var btn;
	var keyIcon1, keyIcon2;
	var loading;

	var tipMc;

	//public变量
	this.name = 'PixiArea';

	//初始化pixi
	this.init = function(__wid, __hei) {
		wid = __wid;
		hei = __hei;
		
		app = new PIXI.Application(640, 640 / (wid / hei), {
			backgroundColor: 0x000000,
			transparent: true
		});
		document.getElementById('pixiStage').appendChild(app.view);

		stage = app.stage;

		container = new PIXI.Container();

		stage.addChild(container);
	}

	//loading资源
	this.createLoading = function(__complete) {

		var loading_file = [];
		loading_file.push('images/key1.png');
		loading_file.push('images/key2.png');
		loading_file.push('model/end.jpg');
		loading_file.push('model/endWall.jpg');
		loading_file.push('model/guWall.jpg');
		loading_file.push('model/particle2.png');
		loading_file.push('model/wall.jpg');
		loading_file.push('model/key/key.obj');

		var loadingArr = [loading_file];

		loading = new Loading(null, {
			loadFileArr: loadingArr,
			progress: progress,
			complete: complete,
			easing: 1
		});
		loading.start();

		function progress(__pro) {
			console.log(__pro);
			/*$('#loading_tiao').css('transform', 'scaleX(' + (__pro / 100) + ')');
			$('#loading_txt').html(__pro + '%');*/
		}

		function complete() {
			console.log('加载完成');
			loading = null;
			if(__complete) {
				__complete();
			}
		}
	}

	//创建摇杆
	this.createRocker = function(__callback) {
		//摇杆
		pixiControl = new Rocker();
		container.addChild(pixiControl);
		pixiControl.init(__callback);

		pixiControl.x = app.view.width * 0.8 - 0;
		pixiControl.y = app.view.height * 0.9 - 0;
	}

	//提示文字
	this.tipIn = function() {
		tipMc = CBtnText('在迷宫中找到钥匙打开大门\n(点击关闭)', 500, 200, {
			fillColor: '0xffffff',
			fontSize: 16,
			fontColor: '0x000000',
			align: 'center'
		});

		stage.addChild(tipMc);
		tipMc.x = 320 - 250;
		tipMc.y = window.innerHeight / 2;
		tipMc.alpha = 0;
		TweenMax.to(tipMc, 0.5, {
			alpha: 1
		});
		tipMc.on('pointerdown', function() {
			stage.removeChild(tipMc);
			gameBegin = true;
		});
	}

	//改变视角按钮
	this.btnIn = function(__callback) {
		btn = CBtnText('改变视角', 150, 50, {
			fillColor: '0xffffff',
			fontSize: 16,
			fontColor: '0x000000'
		});
		stage.addChild(btn);
		btn.on('pointerdown', function() {
			__callback();
		});
	}

	//钥匙图标
	this.keysIcon = function() {
		keyIcon1 = new PIXI.Sprite.fromImage('images/key1.png');
		container.addChild(keyIcon1);
		keyIcon1.x = 200;
		keyIcon1.y = 10;

		keyIcon2 = new PIXI.Sprite.fromImage('images/key2.png');
		container.addChild(keyIcon2);
		keyIcon2.x = 200;
		keyIcon2.y = 10;
		keyIcon2.alpha = 0;
	}

	//钥匙变状态
	this.keysChange = function() {
		keyIcon2.alpha = 1;
		keyIcon1.alpha = 0;
	}

	this.update = function(delta) {
		if(loading) {
			loading.update();
		}

		if(pixiControl) {
			pixiControl.update(delta);
		}
	}
}