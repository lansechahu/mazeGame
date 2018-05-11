//迷宫结构数组
var mazeArr = [];

var cubeWid = 6;
var cubeHei = 8;
var cubeDep = 6;

var sPoint = null;
var ePoint = null;

//迷宫阵列数
var mazeW = 9;
var mazeH = 9;

var door;

function createCube(__type) {
	var type = __type || 'wall';
	var __map;
	var hei;
	if(type == 'wall') {
		hei = cubeHei;
		__map = THREE.ImageUtils.loadTexture('model/guWall.jpg');
		__map.wrapS = THREE.RepeatWrapping;
		__map.wrapT = THREE.RepeatWrapping;
		__map.repeat.set(2.5, 2.5);
		__map.needsUpdate = true;
	} else if(type == 'door') {
		hei = cubeHei;
		__map = THREE.ImageUtils.loadTexture('model/endWall.jpg');
		__map.needsUpdate = true;
	}

	var material = new THREE.MeshPhongMaterial({
		//color:0xffffff
		map: __map,
	});

	var geom = new THREE.CubeGeometry(cubeWid, hei, cubeDep, 5, 5, 5);
	var mesh = new THREE.Mesh(geom, material);
	return mesh;
}

var roadArr = []; //记录路的数据的数组

function createMaze() {
	var a = mazeW;
	var b = mazeH;
	//房间数组，记录每个房间中空地的坐标
	var roomIndexs = new Array();
	var arr = new Array();

	//先生成一堆房间，中间是2，周围是0
	for(var i = 0; i < a; i++) {
		arr[i] = new Array();
		for(var j = 0; j < b; j++) {
			if(i % 2 && j % 2) {
				arr[i][j] = 2;
				roomIndexs.push({
					x: j,
					y: i
				});
			} else {
				arr[i][j] = 0;
			}
		}
	}

	var s = {
		x: roomIndexs[0].x,
		y: roomIndexs[0].y
	};
	var e = {
		x: roomIndexs[roomIndexs.length - 1].x,
		y: roomIndexs[roomIndexs.length - 1].y
	};
	var c = roomIndexs[0]; //参与运算的坐标点
	var backs = new Array();

	//遍历每个坐标点，打通每个房间，形成迷宫
	while(arr[e.y][e.x] != 1 || roomIndexs.length) {
		arr[c.y][c.x] = 1;
		var direct = new Array();
		//以该房间为中心，记录它四周有房的的方向。
		if(c.y - 2 > 0 && arr[c.y - 2][c.x] != 1) direct.push("up");
		if(c.x + 2 < b && arr[c.y][c.x + 2] != 1) direct.push("right");
		if(c.y + 2 < a && arr[c.y + 2][c.x] != 1) direct.push("down");
		if(c.x - 2 > 0 && arr[c.y][c.x - 2] != 1) direct.push("left");

		//从这几个有房间的方向中随机选出一个方向继续下去
		var currentDirect = direct[Math.floor(Math.random() * direct.length)];

		//遍历roomIndexs数组，将与当前坐标点一致的元素去掉，使大循环不会重复遍历一个坐标点
		roomIndexs.forEach(function(item) {
			if(item.x == c.x && item.y == c.y) {
				roomIndexs.splice(roomIndexs.indexOf(item), 1);
			}
		});

		//顺着确定的方向将当前房间和目的房间之间的墙打通，并记录和指向目的房间，在下一循环中变成当前房间，当走到某一步发现周围没有没重复过的房间了，就倒回去走另一条路
		switch(currentDirect) {
			case "up":
				arr[c.y - 1][c.x] = 1;
				c.y -= 2;
				backs.push({
					x: c.x,
					y: c.y
				});
				break;
			case "right":
				arr[c.y][c.x + 1] = 1;
				c.x += 2;
				backs.push({
					x: c.x,
					y: c.y
				});
				break;
			case "down":
				arr[c.y + 1][c.x] = 1;
				c.y += 2;
				backs.push({
					x: c.x,
					y: c.y
				});
				break;
			case "left":
				arr[c.y][c.x - 1] = 1;
				c.x -= 2;
				backs.push({
					x: c.x,
					y: c.y
				});
				break;
			default:
				//没有路时就从记录的走过的点里随机找一个继续走
				var rnd = Math.floor(Math.random() * backs.length);
				c = backs[rnd];
				backs.splice(rnd, 1);
				break;
		}
	}

	//随机设置起点终点
	var allSe = new Array(0, 1, 2, 3);
	var seArr0 = new Array();
	var seArr1 = new Array();
	var seArr2 = new Array();
	var seArr3 = new Array();
	//将迷宫外层一圈附近有空地的点分别记录下来
	for(i = 0; i < arr.length; i++) {
		var temp = arr[i];
		for(j = 0; j < temp.length; j++) {
			if(j == 0) {
				if(temp[j + 1] == 1) {
					seArr0.push({
						x: j,
						y: i
					});
				}
			}
			if(j == temp.length - 1) {
				if(temp[j - 1] == 1) {
					seArr1.push({
						x: j,
						y: i
					});
				}
			}
			if(i == 0) {
				if(arr[i + 1][j] == 1) {
					seArr2.push({
						x: j,
						y: i
					});
				}
			}
			if(i == arr.length - 1) {
				if(arr[i - 1][j] == 1) {
					seArr3.push({
						x: j,
						y: i
					});
				}
			}
		}
	}

	//随机取出起点和终点
	//取起点，从四条边的数组中随机取一条，再从这条里随机取出一个点
	//5是入口，6是出口，0是墙，1是路
	var m = Math.floor(Math.random() * allSe.length);
	var n = allSe[m];
	allSe.splice(m, 1);
	var sn = Math.floor(Math.random() * eval("seArr" + n).length);
	sPoint = eval("seArr" + n)[sn];
	//alert(this.arr[this.sPoint.x][this.sPoint.y]);
	arr[sPoint.y][sPoint.x] = 0;

	//取终点，从另三条边的数组中随机取一条，再从这条里随机取出一个点
	m = Math.floor(Math.random() * allSe.length);
	n = allSe[m];
	allSe.splice(m, 1);
	var en = Math.floor(Math.random() * eval("seArr" + n).length);
	ePoint = eval("seArr" + n)[en];
	arr[ePoint.y][ePoint.x] = 6;

	console.log(arr);

	var wallArr = [];
	var centerX = arr[0].length * cubeWid / 2;
	var centerZ = arr.length / 2 * cubeDep;

	for(var i = 0; i < arr.length; i++) {
		for(var j = 0; j < arr[i].length; j++) {
			if(arr[i][j] == 0) {
				var temp = createCube();
				temp.position.x = cubeWid * j - centerX;
				temp.position.y = cubeHei / 3;
				temp.position.z = cubeDep * i - centerZ;
				wallArr.push(temp);
			} else if(arr[i][j] == 6) {
				door = createCube('door');
				door.myType = 'door';
				console.log(j, i);
				door.position.x = cubeWid * j - centerX;
				door.position.y = cubeHei / 3;
				door.position.z = cubeDep * i - centerZ;
				if(j == 0) {
					door.near = {
						x: door.position.x - cubeWid,
						z: door.position.z
					};
				} else if(j == arr[i].length - 1) {
					door.near = {
						x: door.position.x + cubeWid,
						z: door.position.z
					};
				} else if(i == 0) {
					door.near = {
						x: door.position.x,
						z: door.position.z - cubeDep
					};
				} else if(i == arr.length - 1) {
					door.near = {
						x: door.position.x,
						z: door.position.z + cubeDep
					};
				}
				wallArr.push(door);
			} else if(arr[i][j] == 1) {
				var obj = {
					x: 0,
					z: 0
				};

				obj.x = cubeWid * j - centerX;
				obj.z = cubeDep * i - centerZ;
				roadArr.push(obj);
			}
		}
	}

	return wallArr;
}

function doorOut() {
	TweenMax.to(door.position, 1, {
		y: -5
	});
}