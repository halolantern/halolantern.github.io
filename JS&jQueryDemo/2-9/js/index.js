$(document).ready(function(){
	waterfall();
	$(window).resize(function() {
		waterfall();
	});
	var first = true;
	var dataInt = {"data":[{"src":'1.jpg'},{"src":'2.jpg'},{"src":'3.jpg'},{"src":'4.jpg'},{"src":'5.jpg'},{"src":'6.jpg'},{"src":'7.jpg'},{"src":'8.jpg'},{"src":'9.jpg'},{"src":'10.jpg'},{"src":'11.jpg'},{"src":'12.jpg'},{"src":'13.jpg'},{"src":'14.jpg'},{"src":'15.jpg'},{"src":'16.jpg'}]};

	$(document).scroll(function(){
		if (checkScrollSlide()) {
			addImg();
			waterfall();
		}
	});

	function addImg() {
		$.each(dataInt.data, function(index, value) {
		var oBox = $('<div>').addClass('box').appendTo($('#main'));
		var oPic = $('<div>').addClass('pic').appendTo($(oBox)); 
		var oImg = $('<img>').prop('src', 'images/' + value.src ).appendTo($(oPic));	
		})
	};


	function waterfall() {
		var $boxs = $('#main>div');
		var w = $boxs.eq(0).outerWidth();
		var cols = Math.floor($(window).width() / w);
		$('#main').width(w*cols).css("margin", "0 auto");
		var hArr = [];

	$boxs.each(function(index, value){//这里的value是DOM对象
		var h = $boxs.eq(index).outerHeight();//每一个照片盒子的高度包括padding border
		if (index < cols) {
			hArr[index] = h;
		}else {
			var minH = Math.min.apply(null, hArr);
			var minHindex = $.inArray(minH, hArr);
			$(value).css ({
				'position': 'absolute',
				'top': minH + 'px',
				'left': minHindex * w + 'px'
			})
			hArr[minHindex] += $boxs.eq(index).outerHeight();
		}

	});
}

function checkScrollSlide() {
	var $lastBox = $('#main>div').last();
	var lastBoxDis = $lastBox.offset().top + Math.floor($lastBox.outerHeight()) -10;
	var scrollTop = $(document).scrollTop();
	var documentH = $(window).height();
	// console.log('documentH    '+documentH+'    scrollTop'+scrollTop+ '    lastBoxDis'+lastBoxDis);
	return (lastBoxDis < scrollTop + documentH) ? true : false; 
}

});