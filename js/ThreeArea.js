/*
 * Threejs领域
 */

function ThreeArea() {
	var wid, hei;
	var renderer;
	var scene;
	var camera;
	var light;
	var controls;

	var composer; //shader渲染器
	var effectGlitch; //电磁干扰shader
	var effectCopy;

	var cubeArr = [];

	var hitBall; //用来固定碰撞点的盒子，它跟随摄像机走和转
	var hitCubeArr = []; //用来存放碰撞检测的四个点的数组，它是在hitBall的四个顶点上

	var keys;
	var isKey = false; //是否收集到了钥匙

	var toolArr = []; //道具数组，钥匙或门

	var mouse = new THREE.Vector3();
	var raycaster = new THREE.Raycaster();
	var currX;
	var currY;

	var front = true; //前方是否可行
	var after = true; //后方是否可行
	var left = true; //是否可以往左走
	var right = true; //是否可以往右走

	function initThree() {
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			preserveDrawingBuffer: true
		});
		renderer.setSize(wid, hei);
		renderer.shadowMapEnabled = true;
		document.getElementById('canvas-frame').appendChild(renderer.domElement);
		renderer.setClearColor(0x666666, 1.0);
	}

	function initScene() {
		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x666666, 0.1);
	}

	function initCamera() {
		camera = new THREE.PerspectiveCamera(45, wid / hei, 0.1, 20000);
	}

	function initControl() {
		controls = new Controls(camera, scene);
		controls.init();
		var obj = {
			x: 0,
			y: 0,
			z: 50
		};
		controls.setPosition(obj);
	}

	function initLight() {
		//环境光
		light = new THREE.AmbientLight(0x666666); //dda969
		scene.add(light);
	}

	function initShader() {
		var renderPass = new THREE.RenderPass(scene, camera);

		var effectFilm = new THREE.FilmPass(0.3, 0.3, 2048, false);
		effectFilm.renderToScreen = true;

		//电磁干扰shader
		effectGlitch = new THREE.GlitchPass(16);
		effectGlitch.renderToScreen = true;

		composer = new THREE.EffectComposer(renderer);
		composer.addPass(renderPass);
		composer.addPass(effectFilm);
	}

	//===========================================创建通关墙================================//
	function createEndCube(__obj) {
		var map = new THREE.TextureLoader().load("model/end.jpg");
		map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = 4;
		var material = new THREE.MeshPhongMaterial({
			//color: 0xfff000
			map: map
		});
		var geom = new THREE.CubeGeometry(8, 6, 8);
		var mesh = new THREE.Mesh(geom, material);
		scene.add(mesh);
		mesh.position.x = __obj.x;
		mesh.position.z = __obj.z;
		mesh.position.y = 3;
	}

	//=============================创建顶点方块==================================//
	function createTopCube(_n) {
		var colorArr = [0xfff000, 0x000fff, 0x000f00, 0x0000ff];
		//因为方块的中心是在顶点位置，所以宽度要和hitBall的宽度一致，高度一致，深度小一点，让前后顶点方块有所重合，用来判断斜入时的碰撞
		//var geom = new THREE.CubeGeometry(0.5, 2, 1.0, 5, 5, 5);
		var geom = new THREE.SphereGeometry(0.25, 3, 2);
		var material = new THREE.MeshBasicMaterial({
			color: colorArr[_n],
			transparent: true,
			opacity: 0.5,
			wireframe: true //显示网格
		});
		var temp = new THREE.Mesh(geom, material);
		return temp;
	}

	//改变碰撞球球的位置
	function updateHitBall() {
		hitBall.position.x = controls.cameraBox.position.x;
		hitBall.position.y = 1.2;
		hitBall.position.z = controls.cameraBox.position.z;

		//pointCheck();
	}

	//===================================更新四个顶点方块的位置===============================================//
	var posArr = [{
		x: 0.5,
		z: 0.8
	}, {
		x: -0.5,
		z: 0.8
	}, {
		x: 0.5,
		z: -0.8
	}, {
		x: -0.5,
		z: -0.8
	}];

	function pointCheck() {
		for(var i = 0; i < hitCubeArr.length; i++) {
			var temp = hitCubeArr[i];
			temp.rotation.y = controls.cameraBox.rotation.y;
			var localVertex = hitBall.geometry.vertices[temp.pointIndex].clone();
			var globalVertex = localVertex.applyMatrix4(hitBall.matrix);
			var cx = 0; //posArr[i].x;
			var zx = 0; //posArr[i].z;
			temp.position.x = globalVertex.x + cx;
			temp.position.y = -0.5 + globalVertex.y;
			temp.position.z = globalVertex.z + zx;
		}
	}

	//===================================================碰撞检测部分===========================================//
	var wallArr = [0, 0, 0, 0]; //用来判断撞到哪一边的数组

	function isWall(__arr) {
		for(var i = 0; i < hitCubeArr.length; i++) {
			var temp = hitCubeArr[i];
			wallArr[i] = 0;
			var originPoint = temp.position.clone();
			for(var vertexIndex = 0; vertexIndex < temp.geometry.vertices.length; vertexIndex++) {
				// 顶点原始坐标
				var localVertex = temp.geometry.vertices[vertexIndex].clone();
				// 顶点经过变换后的坐标
				var globalVertex = localVertex.applyMatrix4(temp.matrix);
				var directionVector = globalVertex.sub(temp.position);

				var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
				var collisionResults = ray.intersectObjects(__arr);
				if(collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
					wallArr[i] = 1;
					//console.log(i);
					break;
				}
			}
		}

		//根据撞到的顶点，判断相邻的两个顶点，以判断是哪条边
		if(wallArr[0] == 1) {
			if(wallArr[1] == 1) {
				front = false;
			} else if(wallArr[2] == 1) {
				left = false;
			} else {
				front = false;
			}
		}
		if(wallArr[1] == 1) {
			if(wallArr[0] == 1) {
				front = false;
			} else if(wallArr[3] == 1) {
				right = false;
			} else {
				front = false;
			}
		}
		if(wallArr[2] == 1) {
			if(wallArr[3] == 1) {
				after = false;
			} else if(wallArr[0] == 1) {
				left = false;
			} else {
				after = false;
			}
		}
		if(wallArr[3] == 1) {
			if(wallArr[2] == 1) {
				after = false;
			} else if(wallArr[1] == 1) {
				right == false;
			} else {
				after = false;
			}
		}

		//解开没有碰到的边
		if(wallArr[0] == 0 && wallArr[1] == 0) {
			front = true;
		}
		if(wallArr[2] == 0 && wallArr[3] == 0) {
			after = true;
		}
		if(wallArr[0] == 0 && wallArr[2] == 0) {
			left = true;
		}
		if(wallArr[1] == 0 && wallArr[3] == 0) {
			right = true;
		}
	}

	function hitTest(__arr) {
		hitBall.rotation.y = controls.cameraBox.rotation.y;
		pointCheck();
		isWall(__arr); //碰撞检测
	}

	//===========================================创建钥匙================================//
	function createKey() {
		keys = new Key();
		keys.init();
		scene.add(keys);
		toolArr.push(keys);

		var n = Math.floor(Math.random() * roadArr.length);
		var road = roadArr[n];

		keys.position.x = road.x;
		keys.position.y = 1;
		keys.position.z = road.z;
	}

	//点击判断
	function startHandler(e) {
		if(!gameBegin) return;
		e.preventDefault();

		currX = event.targetTouches[0].pageX;
		currY = event.targetTouches[0].pageY;
		//将屏幕像素坐标转化成camare坐标
		mouse.x = (currX / renderer.domElement.clientWidth) * 2 - 1;
		mouse.y = -(currY / renderer.domElement.clientHeight) * 2 + 1;
		//设置射线的起点是相机
		raycaster.setFromCamera(mouse, camera);

		var intersects = raycaster.intersectObjects(toolArr, true);
		if(intersects.length > 0) {
			var currObj = intersects[0].object;
			//console.log(currObj);
			if(currObj.parent.myType == 'key') {
				console.log('点击了钥匙');
				if(!isKey) {
					gameBegin = false;
					isKey = true;
					keys.out();
					joinFlash();
				}
			}
			if(currObj.myType == 'door') {
				console.log('点击了门');
				if(isKey) {
					doorOut();
				}
			}
		}
	}

	//==========================================创建钥匙光子==============================//
	var flashArr = [];
	var lightArr = [];
	var system;
	var flash_texture;

	function joinFlash() {
		flash_texture = THREE.ImageUtils.loadTexture("model/particle2.png");

		//创建粒子系统
		system = new THREE.ParticleSystem();
		system.sortParticles = true; //对粒子系统进行排序，让里面的粒子互不影响

		//创建500个粒子
		for(var i = 0; i < 100; i++) {
			var geom = new THREE.Geometry(); //创建当前粒子的模型容器
			//创建粒子的材质
			var material = new THREE.ParticleBasicMaterial({
				size: 0.3,
				transparent: true,
				opacity: 1,
				map: flash_texture,
				depthWrite: false, //这个属性设为false，让各个粒子之间互不影响，透明部分不会盖住后面的粒子
				//blending: THREE.AdditiveBlending, //设置材质的混合模式
				sizeAttenuation: true //设置了就是粒子会根据远近有大小的变化
			});

			//生成粒子的位置
			var __x = keys.position.x;
			var __y = keys.position.y + Math.random() * 1;
			var __z = keys.position.z;

			//创建粒子的位置向量，并赋给它一些参数变量
			var temp = new THREE.Vector3(__x, __y, __z);

			geom.vertices.push(temp); //将创建的粒子放入该粒子的模型顶点中
			temp.initX = __x;
			temp.initZ = __z;
			//用粒子的模型和材质创建一个points，这个是真粒子
			var particle = new THREE.Points(geom, material);
			particle.speedX = getSpeed(-0.3, 0.3);
			particle.speedZ = getSpeed(-0.3, 0.3);
			//把创建的这个真粒子放入粒子系统
			system.add(particle);
			lightArr.push(particle);
		}

		scene.add(system);

	}

	function flashUpdate() {
		for(var i = lightArr.length - 1; i >= 0; i--) {
			var temp = lightArr[i];
			var vertices = temp.geometry.vertices[0];
			vertices.x += temp.speedX;
			vertices.z += temp.speedZ;
			if(Math.abs(vertices.x - vertices.initX) >= 1) {
				if(!keys.keyOut) {
					temp.speedX = getSpeed(-0.3, 0.3);
					temp.speedZ = getSpeed(-0.3, 0.3);

					vertices.x = keys.position.x;
					vertices.y = keys.position.y + Math.random() * 1;
					vertices.z = keys.position.z;

					vertices.initX = vertices.x;
					vertices.initZ = vertices.z;
				} else {
					system.remove(temp);
				}
			}
			temp.geometry.verticesNeedUpdate = true; //需要更新几何体,加上它，新给的坐标才能起效
		}
	}

	function getSpeed(__start, __end) {
		var temp = __start + (Math.random() * (__end - __start));
		while(temp == 0) {
			temp = __start + (Math.random() * (__end - __start));
		}
		return temp;
	}

	//===========================================================公共方法============================================//
	//初始化
	this.init = function(__wid, __hei) {
		wid = __wid;
		hei = __hei;

		initThree(); //初始化Threejs
		initScene(); //初始化场景
		initCamera(); //初始化摄像机
		initControl(); //初始化控制器
		initLight(); //初始化灯光
		initShader(); //初始化shader
	}

	//创建地板
	this.create_floor = function() {
		var geometry = new THREE.PlaneGeometry(500, 500);
		var material = new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('model/wall.jpg'),
		});
		var floor = new THREE.Mesh(geometry, material);
		floor.material.map.wrapS = THREE.RepeatWrapping;
		floor.material.map.wrapT = THREE.RepeatWrapping;
		floor.material.map.repeat.set(26, 26);
		floor.material.map.needsUpdate = true;

		scene.add(floor);
		floor.receiveShadow = true;
		floor.rotation.x = -90 * Math.PI / 180;
	}

	//创建迷宫
	this.create_Maze = function() {
		cubeArr = createMaze();
		for(var i = 0; i < cubeArr.length; i++) {
			var temp = cubeArr[i];
			scene.add(temp);
			if(temp.myType == 'door') {
				toolArr.push(temp);
				createEndCube(temp.near); //创建通关墙
			}
		}

		var n = Math.floor(Math.random() * roadArr.length);
		var road = roadArr[n];
		controls.begin(road.x, road.z);

		createKey(); //在迷宫中创建钥匙
	}

	//改变视角
	this.changeCamera = function() {
		controls.changeCamera();
	}

	//改变控制器状态
	this.controlState = function(__state) {
		controls.enabled = __state;
	}

	//创建碰撞刚体
	this.initHitBall = function() {
		var pointIndexArr = [4, 1, 5, 0]; //方块上面的四个顶点的索引号，用它们来固定四个碰撞检测方块，顺序是左前，右前，左后，右后
		var positionArr = []; //方块上面四个顶点的位置，用来定义四个碰撞检测方块的位置

		//创建固定方块
		var geom = new THREE.CubeGeometry(0.5, 2, 0.5);
		var material = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			transparent: true,
			opacity: 0.2
		});
		hitBall = new THREE.Mesh(geom, material);
		scene.add(hitBall);
		hitBall.position.x = controls.cameraBox.position.x;
		hitBall.position.y = 1.2;
		hitBall.position.z = controls.cameraBox.position.z;

		//创建四个碰撞检测方块在hitBall的四个顶点上，用这四个方块来判断碰撞，hitBall为这四个方块提供位置和方向信息
		for(var i = 0; i < 4; i++) {
			var temp = createTopCube(i);
			scene.add(temp);
			temp.pointIndex = pointIndexArr[i];
			hitCubeArr.push(temp);
		}
	}

	//改变摄像头盒子的位置
	this.setCameraBox = function(__speedX, __speedZ) {
		if((__speedX < 0 && left == true) || (__speedX > 0 && right == true)) {
			//controls.cameraBox.translateX(__speedX);
		}

		controls.rotationY(__speedX); //由摇杆控制镜头左右转头

		if((__speedZ < 0 && front == true) || (__speedZ > 0 && after == true)) {
			controls.cameraBox.translateZ(__speedZ);
		}
	}

	//=================================================threejs点击交互====================================//

	this.initAction = function() {
		$('body').on('touchstart', startHandler);
	}

	//===========================删除钥匙================================================//
	this.delKey = function() {
		scene.remove(keys);
		keys = null;
		scene.remove(system);
	}

	this.update = function(delta) {
		if(hitBall) {
			updateHitBall();
			hitTest(cubeArr);
		}

		if(controls) {
			controls.update(delta);
		}

		if(keys) {
			keys.update(flashUpdate);
		}

		if(composer) {
			composer.render(delta);
		} else {
			renderer.render(scene, camera);
		}
	}
}