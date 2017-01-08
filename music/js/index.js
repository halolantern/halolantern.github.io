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
	var songId = 5271858;
	var playlist = [];
	var curSong = 0;
	//播放标志
	var play = false;

	//获取播放列表
	function getAPlayList() {
		$.getJSON('https://bird.ioliu.cn/netease?playlist_id=222222')
		.done(function(data) {
			playlist = data.data.result.tracks;
			getASong(playlist[curSong].id);
			setProgress();
		console.log(data);
		console.log(data.data.result.name);
		for (var i = 0; i < data.data.result.tracks.length; i++) {
			console.log(data.data.result.tracks[i].name);
		}
	});
	}
	//获取一首歌
	function getASong(songId) {
		$.ajax({
			type: "get",
			url: "https://bird.ioliu.cn/netease",
			data: {id: songId},
			dataType: "jsonp",
			success: function(obj) {
				// var obj = JSON.parse(data);
				
				if (obj.status.code != 200) {return}
				console.log(obj);
				var song = obj.data.songs[0];
				
				var songTitle = song.name;
				var artist = song.artists[0].name;
				var songUrl = song.mp3Url;
				if (songUrl == null) {
					getASong();
				}
				$oPlayer.attr('src', songUrl);
				$oPlayer.get(0).play();
				$oPlayer.prop('volume', '0.4');
				play = true;
				$oSongName.html(songTitle);
				$oArtist.html(artist);
			},
			error: function(a, b, c) {
				console.log(a, b, c);
			}
		});
	}
	
	getAPlayList();

	
	

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
		curSong++;
		if (curSong>= playlist.length) {
			curSong = 0;
		}
		getASong(playlist[curSong].id);

	});
	//上一曲按钮
	$oPrevious.on('click', function() {
		curSong--;
		if (curSong < 0) {
			curSong = playlist.length - 1;
		}
		getASong(playlist[curSong].id);
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
		curSong++;
		getASong(playlist[curSong].id);
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