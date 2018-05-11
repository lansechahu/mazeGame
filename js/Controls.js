//摄像机控制器，手指左右划动控制盒子左右转，上下划动控制盒子里的摄像头上下转

var Controls = function(__camera, __scene) {
	this.speed = 1; //移动速度
	this.enabled = true; //是否启用
	this.panY = 0; //Y轴的偏移量，让镜头不是正对着对象
	this.cameraBox = null; //摄像机盒子
	var hitBall; //碰撞用的球球

	var scope = this;
	var myCamera = __camera;
	var myScene = __scene;

	//var radius = Math.abs(camera.position.z - this.target.z); //移动半径，为目标到摄像机的距离
	var angle = 0;
	var angleY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var mouseX = 0;
	var mouseY = 0;
	var mouseXOnMouseDown = 0;
	var mouseYOnMouseDown = 0;
	var targetX = 0;
	var targetY = 0;
	var targetXOnMouseDown = 0;
	var targetYOnMouseDown = 0;

	var man;
	var fly = false;

	this.init = function() {
		scope.cameraBox = new THREE.Object3D();
		scope.cameraBox.add(myCamera);

		myCamera.position.y = 2;
		myCamera.position.z = 0;

		/*createMan(function(__mc) {
			man = __mc;
			scope.cameraBox.add(man);
			man.rotation.y = 180 * Math.PI / 180;
		});*/

		myScene.add(scope.cameraBox);
		document.addEventListener('touchstart', onMouseDown, false);
	}

	//镜头进入迷宫的某一个位置，模仿從空中落下的效果，然后再開始遊戲
	this.begin = function(__x, __z) {
		scope.cameraBox.position.x = 0;
		scope.cameraBox.position.y = 300;
		scope.cameraBox.position.z = 0;

		targetY = -90;
		angleY = targetY * Math.PI / 180;
		myCamera.rotation.x = angleY;

		TweenMax.to(scope.cameraBox.position, 2, {
			x: __x,
			y: 0,
			z: __z,
			ease: Cubic.easeInOut,
			delay: 0.5,
			onUpdate: function() {
				if(scope.cameraBox.position.y < 300) {
					targetY += 0.8;
					angleY = targetY * Math.PI / 180;
					myCamera.rotation.x = angleY;
				}
			},
			onComplete: function() {
				targetY = 0;
				angleY = targetY * Math.PI / 180;
				TweenMax.to(myCamera.rotation, 0.2, {
					x: angleY
				});
				tipIn();
			}
		});
	}

	this.changeCamera = function() {
		if(fly == false) {
			fly = true;
			TweenMax.to(myCamera.position, 0.3, {
				y: 50
			});
		} else {
			fly = false;
			TweenMax.to(myCamera.position, 0.3, {
				y: 2
			});
		}
	}

	this.setTarget = function(__target) {
		targetX = 45;
	}

	this.setPosition = function(__obj) {
		scope.cameraBox.position.x = __obj.x;
		scope.cameraBox.position.y = __obj.y;
		scope.cameraBox.position.z = __obj.z;
	}

	function onMouseDown(event) {
		event.preventDefault();
		if(!scope.enabled || gameBegin == false) return;
		mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
		targetXOnMouseDown = targetX;

		mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
		targetYOnMouseDown = targetY;

		document.addEventListener('touchmove', onMouseMove, false);
		document.addEventListener('touchend', onMouseUp, false);
	}

	function onMouseMove(event) {
		event.preventDefault();
		if(!scope.enabled || !gameBegin) return;

		mouseX = event.touches[0].pageX - windowHalfX;
		targetX = targetXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.08;

		mouseY = event.touches[0].pageY - windowHalfY;
		targetY = targetYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.08;

		angle = targetX * Math.PI / 180;
		angleY = targetY * Math.PI / 180;

		myCamera.rotation.x = angleY;
		//scope.cameraBox.rotation.y = angle;
	}

	function onMouseUp() {
		document.removeEventListener('touchmove', onMouseMove, false);
		document.removeEventListener('touchend', onMouseUp, false);
	}

	this.update = function(__delta) {
		if(!scope.enabled || !gameBegin) {
			return;
		}

		if(man) {
			manUpdate();
		}

	}

	//让摄像机容器左右转头
	this.rotationY = function(__speed) {
		scope.cameraBox.rotation.y -= __speed * Math.PI / 180;
	}

};