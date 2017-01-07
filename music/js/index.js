$(document).ready(function() {
	var $oPlayer = $('#player');
	var oPlayer = document.getElementById('player');
	var $oStart = $('#start_pause');
	var $oPrevious = $('#previous');
	var $oNext = $('#next');
	var $oMinVolume = $('#min_volume');
	var $oMaxVolume = $('#max_volume');
	var $oSongName = $('#song_name');
	var $oArtist = $('#artist');
	var $oVolumeBar = $('#volume_bar');
	var $oVolume = $oVolumeBar.find('span');
	var $oProgress = $('#progress');
	var $oCurrentPro = $oProgress.find('span');
	var $oTime = $('#time');
	var timer = null;
	//播放标志
	var play = false;
	function getSong(data) {
		console.log('getSong');
		console.log(data);
	}
	//获取一首歌
	function getASong() {
		$.ajax(
		{
			type: "get",
			url: "http://api.jirengu.com/fm/getSong.php?callback=?&channel=1",
			// data: "channel: 'public_aaa_bbb'",
			dataType: "jsonp",
			jsonpCallback: "getSong",
			success: function(data) {
				console.log('ajax');
				console.log(data);
				// var obj = JSON.parse(data);
				//一首歌曲对象
				var song = data.song[0];
				console.log(song);
				var songTitle = song.title;
				var artist = song.artist;
				var songUrl = song.url;
				if (songUrl == null) {
					getASong();
				}
				$oPlayer.attr('src', songUrl);
				$oPlayer.get(0).play();
				$oPlayer.prop('volume', '0.8');
				play = true;
				$oSongName.html(songTitle);
				$oArtist.html(artist);
			},
			error: function(a, b, c) {
				console.log(a, b, c);
			}
		}
		);

		// $.get('http://api.jirengu.com/fm/getSong.php',{channel: 'public_aaa_bbb'})
		// .done(function(data){
		// var obj = JSON.parse(data);
		// //一首歌曲对象
		// var song = obj.song[0];
		// console.log(song);
		// var songTitle = song.title;
		// var artist = song.artist;
		// var songUrl = song.url;
		// if (songUrl == null) {
		// 	getASong();
		// }
		// $oPlayer.attr('src', songUrl);
		// $oPlayer.get(0).play();
		// $oPlayer.prop('volume', '0.8');
		// play = true;
		// $oSongName.html(songTitle);
		// $oArtist.html(artist);
		// });
	}
	//加载完后播放
	getASong();
	setProgress();

	//前度条和时间设置
	function setProgress() {
		timer = setInterval(function() {
			var currentTime = $oPlayer.prop('currentTime');
			var duration = $oPlayer.prop('duration');
			var currentTimePer = (currentTime / duration * 100) + '%';
			$oCurrentPro.css('width', currentTimePer);
			var min =Math.floor(currentTime / 60) ;
			var sec =Math.floor(currentTime % 60);
			sec = sec<10 ? '0' + sec : sec;
			$oTime.html(min + ":" + sec);
		}, 500);
	}

	//开始暂停按钮
	$oStart.click(startPause);
	function startPause() {
		if (!play) {
			$oPlayer.get(0).play();
			play = !play;
			$oStart.attr('class', 'pause');
			setProgress();
		}else {
			$oPlayer.get(0).pause();
			play = !play;
			$oStart.attr('class', 'start');
			clearInterval(timer);
		}
	}

	//下一曲按钮
	$oNext.on('click', function() {
		getASong();
	});
	//上一曲按钮
	$oPrevious.on('click', function() {
		getASong();
	});
	//静音
	$oMinVolume.click(function() {
		// console.log($oPlayer.attr('volume')); 
		// console.log($oPlayer.get(0).volume);
		$oPlayer.prop('volume', '0');
		$oVolume.css('width', '0');
	});
	//最大音量
	$oMaxVolume.click(function() {
		$oPlayer.prop('volume', '1');
		$oVolume.css('width', '100%');
	});
	//音量条
	$oVolumeBar.click(function(event) {
		//计算点击的位置换成小数和百分比
		var volumeFloat = (event.pageX - $(this).offset().left) / $(this).width();
		var volumePercent = Math.ceil( volumeFloat * 100) + '%';
		$oVolume.css('width', volumePercent);
		$oPlayer.prop('volume', volumeFloat);
		
	});
	//在进度条直接点击选取进度
	$oProgress.click(function(e) {
		var timeFloat = (e.pageX - $(this).offset().left) / $(this).width();
		var duration = $oPlayer.prop('duration');
		var clickTime = timeFloat * duration;
		var timePercent = timeFloat * 100 + '%';
		$oPlayer.prop('currentTime', clickTime);
		$oCurrentPro.css('width', timePercent);
	});


	//播放结束时继续随机播放
	$oPlayer.on('ended', function() {
		getASong();
	});

	//键盘控制播放
	$(document).on('keyup', function(e) {
		switch (e.keyCode)
		{
			case 32:
			startPause();
			break;
			case 37:
			gofast(-5);
			break;
			case 39:
			gofast(5);
			break;
			case 38:
			volumeChange(0.1);
			break;
			case 40:
			volumeChange(-0.1);
			break;

		}
		
	});

	//快进快退
	function gofast(time) {
		var currentTime = $oPlayer.prop('currentTime');
		currentTime += time;
		var duration = $oPlayer.prop('duration');
		var timePercent = currentTime / duration * 100 + '%';
		$oPlayer.prop('currentTime', currentTime);
		$oCurrentPro.css('width', timePercent);

	}
	//音量加减
	function volumeChange(volume) {
		var currentVolume = $oPlayer.prop('volume');
		currentVolume += volume;
		if (currentVolume >= 1) {
			currentVolume = 1;
		}if (currentVolume <= 0) {
			currentVolume = 0;
		}
		var volumePercent = currentVolume * 100 + "%";
		$oPlayer.prop('volume', currentVolume);
		$oVolume.css('width', volumePercent);
		
	}
});