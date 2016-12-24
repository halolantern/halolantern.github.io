
window.onload = function() {
	var dls = document.getElementsByTagName('dl');
	var dts = document.getElementsByTagName('dt');
	//给每一课绑定事件
	for (var i = 0; i < dls.length; i++) {
		(function(i){
			dts[i].onclick = function(){
				var cont = dls[i].getElementsByTagName('dd')[0];
				if (cont.className == "hide") {
					for (var n = 0; n < dls.length; n++) {
						dls[n].getElementsByTagName('dd')[0].className = "hide";
					}
					cont.className = "show";

				}else {
					cont.className = "hide";
				}
			};
		})(i);
		
	}

}