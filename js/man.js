var mixer;

function createMan(__complete) {
	var loader = new THREE.TextureLoader();
	var texture = loader.load('model/color.jpg');

	var jsloader = new THREE.JSONLoader();
	jsloader.load("model/person.json", function(geometry, materials) {
		var a = new THREE.MeshPhongMaterial({
			map: texture,
			flatShading: true,
			morphTargets: true, //是否变形目标
			morphNormals: true, //是否用了法线变形
			specular: 0,
			shininess: 0, //光亮
			skinning: true //是否使用蒙皮
		});

		mesh = new THREE.SkinnedMesh(geometry, a);
		//scene.add(mesh);
		mesh.scale.set(0.5, 0.5, 0.5);

		mixer = new THREE.AnimationMixer(mesh);
		mixer.clipAction(geometry.animations[0]).play();

		__complete(mesh);
	});
}

function manUpdate() {
	if(mixer) {
		mixer.update(delta);
	}
}