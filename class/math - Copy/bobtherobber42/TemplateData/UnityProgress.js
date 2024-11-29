function UnityProgress (dom) {
	this.progress = 0.0;
	this.message = "";
	this.dom = dom;
	var parent = dom.parentNode;

	var logoImage = document.createElement("img");
	logoImage.src = "TemplateData/progresslogo.png";
	logoImage.style.position = "absolute";
	parent.appendChild(logoImage);
	this.logoImage = logoImage;

	this.SetProgress = function (progress) {
		if (this.progress < progress)
			this.progress = progress;
		if (progress == 1) {
			this.SetMessage("Preparing...");
			document.getElementById("bgBar").style.display = "none";
			document.getElementById("progressBar").style.display = "none";
		}
		this.Update();
	}
	this.SetMessage = function (message) {
		this.message = message;
		this.logoImage.style.display = "inline";
		this.Update();
	}
	this.Clear = function() {
		document.getElementById("loadingBox").style.display = "none";
		this.logoImage.style.display = "none";
	}
	this.Update = function() {

		var logoImg = new Image();
		logoImg.src = this.logoImage.src;
		this.logoImage.style.top = this.dom.offsetTop + (this.dom.offsetHeight * 0.2 - logoImg.height * 0.2) + 'px';
		this.logoImage.style.left = this.dom.offsetLeft + (this.dom.offsetWidth * 0.5 - logoImg.width * 0.5) + 'px';
		this.logoImage.style.width = logoImg.width+'px';
		this.logoImage.style.height = logoImg.height+'px';

		var length = 200 * Math.min(this.progress, 1);
		bar = document.getElementById("progressBar")
		bar.style.width = length + "px";
		document.getElementById("loadingInfo").innerHTML = this.message;
	}
	this.Update ();
}
