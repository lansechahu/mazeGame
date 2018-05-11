function Loading(texture, obj) {
	PIXI.Sprite.call(this, texture, obj);

	var self = this;

	self.easing = obj.easing || 1; //加载进度的缓冲值
	self.currpg = 0;
	self.realpg = 0;
	self.loadEnd = false;

	self.progress = obj.progress;
	self.complete = obj.complete;
	self.loadFileArr = obj.loadFileArr;

	this.start = function() {
		self.loader = new PIXI.loaders.Loader();
		for(var i = 0; i < self.loadFileArr.length; i++) {
			self.loader.add(self.loadFileArr[i]);
		}

		self.loader.once('complete', onLoaded);
		self.loader.load();
	}

	function onLoaded() {
		//alert('加载完了！');
		//onloadComplete();
		self.loadEnd = true;
	}

	this.update = function() {
		if(self.loadEnd == true) {
			self.realpg = 100;
			if(self.currpg >= 95) {
				self.currpg = 100;
				if(self.complete) {
					self.complete();
				}
			}
		}

		self.realpg = self.loader.progress;
		self.currpg += (self.realpg - self.currpg) * self.easing;

		if(self.progress) {
			self.progress(Math.floor(self.currpg));
		}
	}
}

Loading.constructor = Loading;
Loading.prototype = Object.create(PIXI.Sprite.prototype);