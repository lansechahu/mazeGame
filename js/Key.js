function Key() {
	THREE.Object3D.call(this);

	this.myType = 'key';
	this.myId = 0;
	this.keyOut = false;

	var scope = this;
	var mesh;
	var angle = 0;
	var speed = 1;
	var isOut = false;
	var spotLight;

	this.init = function() {
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath('model/key/');
		mtlLoader.load('key.mtl', function(materials) {

			materials.preload();

			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.setPath('model/key/');
			objLoader.load('key.obj', function(object) {
				mesh = object;
				mesh.scale.multiplyScalar(0.1);
				mesh.myType = 'key';
				scope.add(mesh);
				mesh.castShadow = true;

				spotLight = new THREE.SpotLight('0xffffff');
				scope.add(spotLight);
				spotLight.target = mesh;
				spotLight.position.x = mesh.position.x;
				spotLight.position.y = 3;
				spotLight.position.z = mesh.position.z;
				spotLight.distance = 5;
				spotLight.angle = Math.PI * 0.1;
				spotLight.castShadow = true;
			});
		});
	}

	this.out = function() {
		isOut = true;

		setTimeout(function() {
			scope.remove(mesh);
			scope.keyOut = true;
		}, 1000);
	}

	this.update = function(__flashUpdate) {
		if(mesh) {
			if(isOut) {
				speed += 1;
				if(speed >= 20) {
					speed = 20;
				}
				__flashUpdate();
				if(spotLight.angle >= 0) {
					spotLight.angle -= Math.PI * 0.001;
				} else {
					delKey();
				}
			}
			angle += speed;
			mesh.rotation.y = angle * Math.PI / 180;
		}
	}
}

Key.constructor = Key;
Key.prototype = Object.create(THREE.Object3D.prototype);