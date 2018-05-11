/*
 * PIXI的公共方法文件
 */

/*
 * 创建带图片的元件
 * @param {string} src	图片地址
 * @param {string} _from	资源来源于哪，'fromImage'和'fromFrame'
 * @param {string || number} _x	图片在Sprite里的位置，可以是'center','left','right',也可以是数字
 * @param {string || number} _y	图片在Sprite里的位置，可以是'center','top','bottom',也可以是数字
 * @param {Boolean} _interactive	是否是可点击的，默认为false
 */

function CSprite(src, _from, _x, _y, _interactive) {
	var mc;
	var anchorX = _x || 0;
	var anchorY = _y || 0;
	var interactive = _interactive || false;
	if(_from == 'fromImage') {
		mc = new PIXI.Sprite.fromImage(src);
	} else if(_from == 'fromFrame') {
		mc = new PIXI.Sprite.fromFrame(src);
	}

	switch(_x) {
		case 'left':
			anchorX = 0;
			break;
		case 'center':
			anchorX = 0.5;
			break;
		case 'right':
			anchorX = 1;
			break;
	}
	switch(_y) {
		case 'top':
			anchorY = 0;
			break;
		case 'center':
			anchorY = 0.5;
			break;
		case 'bottom':
			anchorY = 1;
			break;
	}

	mc.anchor.set(anchorX, anchorY);
	mc.interactive = interactive;
	return mc;
}

/*
 * 创建Graphics矩形
 */
function CdrawRect(__width, __height, __options) {
	var options = {
		lineWeight: __options.lineWeight || 0, //边线的粗细度，默认为0
		lineColor: __options.lineColor || '0xffffff', //边线的颜色
		lineAlpha: __options.lineAlpha || 0, //边线透明度
		fillColor: __options.fillColor || '0xffffff', //填充颜色
		fillAlpha: __options.fillAlpha || 1, //填充透明度
		interactive: __options.interacitve || false //是否可点击
	}

	var mc = new PIXI.Graphics();
	mc.lineStyle(options.lineWeight, options.lineColor, options.lineAlpha);
	mc.beginFill(options.fillColor, options.fillAlpha);
	mc.drawRect(0, 0, __width, __height);
	mc.interactive = options.interactive;

	return mc;
}

/*
 * 创建Graphics圆形
 */
function CdrawCircle(__radius, __options) {
	var options = {
		lineWeight: __options.lineWeight || 0, //边线的粗细度，默认为0
		lineColor: __options.lineColor || '0xffffff', //边线的颜色
		lineAlpha: __options.lineAlpha || 0, //边线透明度
		fillColor: __options.fillColor || '0xffffff', //填充颜色
		fillAlpha: __options.fillAlpha || 1, //填充透明度
		interactive: __options.interacitve || false //是否可点击
	}

	var mc = new PIXI.Graphics();
	mc.lineStyle(options.lineWeight, options.lineColor, options.lineAlpha);
	mc.beginFill(options.fillColor, options.fillAlpha);
	mc.drawCircle(0, 0, __radius);
	mc.interactive = options.interactive;

	return mc;
}

/*
 * 创建普通按钮
 */
function CBtnText(__txt, __width, __height, __options) {
	var options = {
		lineWeight: __options.lineWeight || 0, //边线的粗细度，默认为0
		lineColor: __options.lineColor || '0xffffff', //边线的颜色
		lineAlpha: __options.lineAlpha || 0, //边线透明度
		fillColor: __options.fillColor || '0xffffff', //填充颜色
		fillAlpha: __options.fillAlpha || 1, //填充透明度
		fontSize: __options.fontSize || 24, //字号
		fontColor: __options.fontColor || '0x000000', //字体颜色
		align: __options.align || 'left', //对齐方式
	}

	var mc = new PIXI.Graphics();
	mc.lineStyle(options.lineWeight, options.lineColor, options.lineAlpha);
	mc.beginFill(options.fillColor, options.fillAlpha);
	mc.drawRect(0, 0, __width, __height);
	mc.interactive = true;

	var fontStyle = new PIXI.TextStyle({
		fontSize: 36,
		fill: options.fontColor, // gradient
		align: options.align
	});

	var txt = new PIXI.Text(__txt, fontStyle);
	mc.addChild(txt);
	txt.x = mc.width / 2 - txt.width / 2;
	txt.y = mc.height / 2 - txt.height / 2;

	return mc;

}

/*
 * 设置序列帧
 * name：序列帧图片文件名
 * ext：序列帧图片扩展名，如果没有就为''
 * sNum：序列图的编号从几开始
 * tol：序列图最后一张的编号
 * speed：播放速度
 * onComplete：播放结束后的回调
 * loop：是否循环播放
 */
function setVideo(name, ext, sNum, tol, speed, onComplete, loop) {
	var VTextures = [],
		_mc;
	loop == undefined ? loop = false : loop;
	speed == undefined ? speed = .5 : speed;
	for(var i = sNum; i <= tol; i++) {
		var texture = PIXI.Texture.fromFrame(name + i + ext);
		VTextures.push(texture);
	}
	_mc = new PIXI.extras.AnimatedSprite(VTextures);
	_mc.animationSpeed = speed;
	_mc.loop = loop;
	if(onComplete != undefined) {
		_mc.onComplete = onComplete;
	}
	return _mc;
}

/*
 * 跳到序列帧的某一帧
 * vmc：序列帧对象
 * videotolN：总共的帧数，从0开始
 * nowN：当前要跳到哪一帧
 * loop：是否循环
 */
function VideoStop(vmc, videotolN, nowN, loop) {
	if(loop) {
		vmc.gotoAndStop(Math.floor(nowN % 14));
	} else {
		if(nowN >= videotolN) {
			vmc.gotoAndStop(videotolN);
		} else if(nowN < 0) {
			vmc.gotoAndStop(0);
		} else {
			vmc.gotoAndStop(nowN);
		}
	}
}

//三维参数
/*
 * xpos：mc的x轴的偏移量，用来设置mc的x轴位置
 * ypos：mc的y轴的偏移量，用来设置mc的y轴位置
 * zpos：mc的z轴的偏移量，用来设置mc的z轴位置，值越大离镜头越远
 * mc的x轴和y轴的坐标会跟scale成正比，可用xpos和ypos结合scale计算mc的真实坐标
 * scale与zpos成反比，zpos越值越大，scale越小
 */
var fl = 50,
	vpX = 0,
	vpY = 0;

function onPerspective(_mc) {
	var scale = fl / (fl + _mc.zpos);
	_mc.scale.x = _mc.scale.y = scale;
	_mc.x = vpX + _mc.xpos * scale;
	_mc.y = vpY + _mc.ypos * scale;
}

//设置Mc容器
function setSpriteMc(parentmc, mcx, mcy) {
	var mc = new PIXI.Sprite();
	mc.position.set(mcx, mcy);
	mc.scale.set(1);
	parentmc.addChild(mc);
	return mc;
}