function Rocker(__texture) {
	PIXI.Sprite.call(this, __texture);

	var self = this;

	var ballBg;
	var ball;

	var draging = false;
	var data;

	var speedZ = 0;
	var speedX = 0;

	var radius = 80;
	var centerX = 0;
	var centerY = 0;

	this.moveSpeedX = 0.02;
	this.moveSpeedZ = 0.001;

	var velocity = new THREE.Vector3();

	var fun;

	self.init = function(__fun) {
		ballBg = new PIXI.Graphics();
		ballBg.beginFill(0xffffff, 0.3);
		ballBg.drawCircle(centerX, centerY, radius);
		ballBg.endFill();

		ball = new PIXI.Graphics();
		ball.beginFill(0xffffff, 0.3);
		ball.drawCircle(centerX, centerY, 40);
		ball.endFill();

		if(__fun) fun = __fun;

		begin();
	}

	function begin() {
		self.addChild(ballBg);
		self.addChild(ball);

		ball.interactive = true;
		ball.on('touchstart', function(event) {
			if(!gameBegin) return;
			data = event.data;
			draging = true;
			controlState(false);
		});

		document.body.addEventListener('touchend', ended);

		function ended() {
			if(!gameBegin) return;
			draging = false;
			ball.x = ball.y = 0;
			speedX = 0;
			controlState(true);
		}

		ball.on('touchmove', function(event) {
			if(!gameBegin) return;
			if(draging) {
				var newPosition = data.getLocalPosition(ball.parent);

				var distance = Math.getDistance({
					x: newPosition.x,
					y: newPosition.y
				}, {
					x: 0,
					y: 0
				});
				if(distance > radius) {
					var cangle = Math.getAngle({
						x: centerX,
						y: centerY
					}, {
						x: newPosition.x,
						y: newPosition.y
					});

					cangle -= 90;
					newPosition.x = Math.cos(cangle * Math.PI / 180) * radius;
					newPosition.y = Math.sin(cangle * Math.PI / 180) * radius;
				}

				ball.x = newPosition.x;
				ball.y = newPosition.y;

				speedZ = (ball.y - centerY) * self.moveSpeedZ;
				speedX = (ball.x - centerX) * self.moveSpeedX;

			}
		});
	}

	this.update = function(delta) {
		if(draging) {
			fun(speedX, speedZ);
		}
	}
}

Rocker.prototype = new PIXI.Sprite();
Rocker.prototype.constructor = Rocker;