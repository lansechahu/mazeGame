/*
 * 数学相关的功能
 */
(function() {
	var mathutils = {
		/**
		 * 计算两点间距离
		 * @param {object} [p1] 点1
		 * @param {object} [p2] 点2
		 * */
		getDistance: function(p1, p2) {
			var a = p2.x - p1.x;
			var b = p2.y - p1.y;
			var n = Math.sqrt(a * a + b * b);
			return n;
		},

		/**
		 * 计算两点间直线任意点的坐标，p1 p2为直线的两个端点，_x和_y为要求的坐标点中的一个坐标，求另一个
		 * @param {object} [p1] 点1
		 * @param {object} [p2] 点2
		 * @param {number} [_x] 要求的点的x坐标，求x坐标的话，该参数填null
		 * @param {number} [_y] 要求的点的y坐标，求x坐标的话，该参数填null
		 * */
		getOnLineXY: function(p1, p2, _x, _y) {
			var k = (p2.y - p1.y) / (p2.x - p1.x);
			var b = p1.y - k * (p1.x);
			if(_x == null) {
				_x = (_y - b) / k;
			} else if(_y == null) {
				_y = k * _x + b;
			}
			var p = {
				x: _x,
				y: _y
			};
			return p;
		},

		/**
		 * 计算两点间直线中心点坐标
		 * @param {object} [p1] 点1
		 * @param {object} [p2] 点2
		 * */
		getOnLineCenter: function(p1, p2) {
			var xx = (p1.x + p2.x) / 2;
			var yy = (p1.y + p1.y) / 2;
			var p = {
				x: xx,
				y: yy
			};
			return p;
		},

		/**
		 * 返回起点到终点的角度，以Y轴为中心，从上右下左是0,90,180,270,360
		 * @param {object} [start] 起点
		 * @param {object} [end] 终点
		 * */
		getAngle: function(start, end) {
			var x = Math.abs(start.x - end.x);
			var y = Math.abs(start.y - end.y);
			var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
			var cos = y / z;
			var radina = Math.acos(cos); //用反三角函数求弧度
			var angle = Math.floor(180 / (Math.PI / radina)); //将弧度转换成角度

			if(end.x > start.x && end.y > start.y) { //鼠标在第四象限
				angle = 180 - angle;
			}

			if(end.x == start.x && end.y > start.y) { //鼠标在y轴负方向上
				angle = 180;
			}

			if(end.x > start.x && end.y == start.y) { //鼠标在x轴正方向上
				angle = 90;
			}

			if(end.x < start.x && end.y > start.y) { //鼠标在第三象限
				angle = 180 + angle;
			}

			if(end.x < start.x && end.y == start.y) { //鼠标在x轴负方向
				angle = 270;
			}

			if(end.x < start.x && end.y < start.y) { //鼠标在第二象限
				angle = 360 - angle;
			}

			//返回角度,不是弧度
			return angle;
		},

		/**
		 * 每隔三位数加一个逗号
		 * @param {string/number} [value] 要转换的值
		 * */
		cutStr: function(value) {
			var temp = parseFloat(value).toLocaleString();
			return temp;
		},

		/**
		 * 获取椭圆内随机一点
		 * @param {number} radiusX 椭圆X轴半径
		 * @param {number} radiusY 椭圆Y轴半径
		 * @param {object} 随机点
		 * */
		getEllipseRandomPoint: function(radiusX, radiusY) {
			var angle = (Math.random() * 360);
			//正弦函数图像特点 x∈[0,2π] 5点观察值[0,1, 0,-1,0]
			//余弦函数图像特点 x∈[0,2π] 5点观察值[1,0,-1, 0,1]
			return {
				x: Math.sin(Math.PI / 180 * angle) * (Math.random() * randiusX),
				y: Math.cos(Math.PI / 180 * angle) * (Math.random() * randiusY)
			}
		},

		/**
		 * 计算斐波那契数列 递归
		 */
		fbnq: function(n) {
			if(n == 1 || n == 2) {
				return 1;
			}
			return Math.fbnq(n - 1) + Math.fbnq(n - 2);
		},

		/**
		 * 计算斐波那契数列 非递归
		 */
		fbnq2: function(n) {
			var a, b, res;
			a = b = 1;
			for(var i = 3; i <= n; i++) {
				res = a + b;
				a = b;
				b = res;
			}
			return res;
		},

		/**
		 * 生成一个范围内的随机数
		 */
		getRandomNum: function(min, max) {
			return Math.random() * (max - min) + min;
		},

		/**
		 * 求两个数的最大公约数
		 */
		gcd: function(num1, num2) {
			if(num1 % num2 == 0) {
				return num2;
			} else {
				return Math.gcd(num2, num1 % num2);
			}
		},

		/**
		 * 求两个数的最小公倍数
		 */
		lcm: function(num1, num2) {
			var num = num1 * num2 / Math.gcd(num1, num2);
			return num;
		},

		/**
		 * 根据数组里的概率元素，生成新的概率数组
		 * @例：var a=[0.5,0.1,0.2,0.2]; 就是50%个0，10%个1，20%个2，20%个3，生成的数组就是[0,0,0,0,0,1,2,2,3,3]
		 * 注：数组元素的和不要大于1，做概率相关的程序时可以用到它
		 * 因为用到了最小公倍数函数，所以就把它放到数学类里了，而没放到数组类里
		 * */
		getPro: function(__arr) {
			var p = __arr;
			var L = getLCM(p); //获取最小公倍数

			var A = [];
			var l = 0;
			for(var i = 0; i < p.length; i++) {
				var k = L * p[i] + l;
				while(l < k) {
					A[l] = i;
					l++;
				}
			}

			function getLCM(__p) {
				var n = 1;
				for(var i = 0; i < p.length; i++) {
					n = Math.lcm(n, 1 / p[i]);
				}
				return n;
			}

			return A;
		}
	};

	Object.assign(Math, mathutils);
}());