/*粒子类*/
function Particles() {
	THREE.Object3D.call(this);

	this.myType = 'particle';

	var scope = this;

	/*var geom;
	var material;*/
	var texture; //贴图
	var system; //粒子系统
	var arr;

	this.init = function() {
		arr = new Array();
		texture = THREE.ImageUtils.loadTexture("model/particle1.png");

		scope.join();
	}

	this.join = function() {
		//创建粒子系统
		system = new THREE.ParticleSystem();
		system.sortParticles = true; //对粒子系统进行排序，让里面的粒子互不影响

		//创建500个粒子
		for(var i = 0; i < 1000; i++) {
			var geom = new THREE.Geometry(); //创建当前粒子的模型容器
			//创建粒子的材质
			var material = new THREE.ParticleBasicMaterial({
				size: 4,
				transparent: true,
				opacity: 1,
				map: texture,
				depthWrite: false, //这个属性设为false，让各个粒子之间互不影响，透明部分不会盖住后面的粒子
				sizeAttenuation: true //设置了就是粒子会根据远近有大小的变化
			});

			//生成粒子的位置
			var __x = -10 + Math.random() * 20;
			var __y = Math.random() * 1;
			var __z = 10 - Math.random() * 20;

			//创建粒子的位置向量，并赋给它一些参数变量
			var temp = new THREE.Vector3(__x, __y, __z);
			temp.angle = Math.floor(Math.random() * 360); //粒子的初始角度，用它来计算粒子的初始位置
			temp.angleSpeed = 0.005; //粒子角度运动的速度
			temp.radius = Math.random() * 30 + 5; //粒子运动的半径
			temp.z_radius = Math.random() * 20 + 10; //粒子深度运动的半径
			//粒子x,y,z轴运动的方向，1或-1
			temp.__x_dir = getDir();
			temp.__y_dir = getDir();
			temp.__z_dir = getDir();

			//将刚才生成的粒子的位置设为圆周运动的圆心
			temp.initX = __x;
			temp.initY = __y;
			temp.initZ = __z;

			//根据x,y,z的方向和角度，计算得出粒子的真●位置
			temp.x = temp.__x_dir * Math.cos(temp.angle) * temp.radius + temp.initX;
			temp.y = temp.__y_dir * Math.sin(temp.angle) * temp.radius + temp.initY;
			temp.z = temp.__z_dir * Math.sin(temp.angle) * temp.z_radius + temp.initZ;

			material.opacity = Math.sin(temp.angle); //重新设置透明度
			material.needsUpdate = true; //需要更新材质,加上它，新给的材质属性才能起效

			geom.vertices.push(temp); //将创建的粒子放入该粒子的模型顶点中
			//用粒子的模型和材质创建一个points，这个是真粒子
			var particle = new THREE.Points(geom, material);
			//把创建的这个真粒子放入粒子系统
			system.add(particle);
			arr.push(particle);
		}

		scope.add(system);

	}

	this.aa = function() {
		var vertices = system.geometry.vertices;
		vertices.forEach(function(v) {
			v.x = 0;
			v.y = 0;
			v.z = 0;
		});
		geom.verticesNeedUpdate = true; //需要更新几何体,加上它，新给的坐标才能起效
	}

	function bb() {
		for(var i = 0; i < arr.length; i++) {
			var temp = arr[i];

			temp.material.opacity = Math.sin(temp.geometry.vertices[0].angle);
			console.log(1 - temp.material.opacity);

			temp.material.needsUpdate = true;
		}
	}

	function getDir() {
		var aa = Math.floor(Math.random() * 2);
		var __dir = 0;
		if(aa == 0) {
			__dir = -1;
		} else {
			__dir = 1;
		}
		return __dir;
	}

	this.update = function() {
		/*var vertices = system.geometry.vertices;
		vertices.forEach(function(v) {
			v.angle += v.angleSpeed;
			v.x = v.__x_dir * Math.cos(v.angle) * v.radius + v.initX;
			v.y = v.__y_dir * Math.sin(v.angle) * v.radius + v.initY;
			v.z = v.__z_dir * Math.sin(v.angle) * v.radius + v.initZ;
		});
		geom.verticesNeedUpdate = true; //需要更新几何体*/

		//粒子运动
		for(var i = 0; i < arr.length; i++) {
			var temp = arr[i];
			var vertices = temp.geometry.vertices[0];
			vertices.angle += vertices.angleSpeed;
			vertices.x = vertices.__x_dir * Math.cos(vertices.angle) * vertices.radius + vertices.initX;
			vertices.y = vertices.__y_dir * Math.sin(vertices.angle) * vertices.radius + vertices.initY;
			vertices.z = vertices.__z_dir * Math.sin(vertices.angle) * vertices.z_radius + vertices.initZ;

			temp.material.opacity = Math.sin(vertices.angle); //粒子的透明度变化

			//temp.material.needsUpdate = true; //需要更新几何体
			temp.geometry.verticesNeedUpdate = true; //需要更新几何体,加上它，新给的坐标才能起效

		}
	}
}

Particles.constructor = Particles;
Particles.prototype = Object.create(THREE.Object3D.prototype);