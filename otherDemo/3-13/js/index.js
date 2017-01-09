$(document).ready(function() {
           // 5日预报
           var $oSearch = $('.search');
           var $oSubmit = $('.submit');
           var $oTitle = $('.title');
           var $oOneDay = $('.oneDay');
           var $oDate = $('.date');
           var $oWea = $('.wea');
           var $oTem = $('.tem');
           var $oWin = $('.win');
           var $oWinSpeed = $('.winSpeed');
           //环境情况
           var $oCondition = $('.condition');
           var $oPm25 = $oCondition.find('.pm25');
           var $oPm10 = $oCondition.find('.pm10');
           var $oQuality = $oCondition.find('.quality');
           var $oHumidity = $oCondition.find('.humidity');
           var $oCurTem = $oCondition.find('.tem');
           var $oCurpm = $oCondition.find('.curpm');
           //生活指数
           var  $oLiftItem = $('.lifeItem');
           var $oIcon = $oLiftItem.find('i');
           var $oLiftTi = $oLiftItem.find('h3');
           var $oSpan = $oLiftItem.find('span');
           var $oP = $oLiftItem.find('p');


           //设置天气信息函数
           function setWeather(city) {
            $.get('https://bird.ioliu.cn/weather', {city:city})
            .done(function(obj) {
              var data = obj.data;
              console.log(data);
              //返回数据状态
              var status = obj.status;
              if (status.code != 200 ) {
                alert(status.message);
                return;
              }
              var weather = data.weather;
              $oDate.each(function(index) {
                  //index会超过weather.length
                if (index == 5) {return}
                  if (weather.length < 5 && index == weather.length) {
                      return;
                  }
                var date = /\d\d$/.exec(weather[index].date);
                if (date < 10) {
                  date = date - 0;
                }
                $(this).html(date + '日'); 
              });
              //设置5日天气中每一项的值
              function setValue($obj, i, unit) {
                $obj.each(function(index) {
                  //index会超过weather.length
                  if (index == 5) {return}
                  if (weather.length < 5 && index == weather.length) {
                      return;
                  }
                  var value = weather[index].info.day[i];
                  if (unit) {
                    $(this).html(value + unit + "/" + weather[index].info.night[i] + unit);
                  }else{
                    $(this).html(value)
                  }
                     
                }); 
              }
              setValue($oWea, 1);
              setValue($oTem, 2, '℃');
              setValue($oWin, 3);
              setValue($oWinSpeed, 4);
              $oTitle.html(city + "市/县 近5天天气情况");

              //设置环境情况每一项的值
              var pm25 = data.pm25.pm25.pm25;
              $oPm25.html('pm2.5: ' + pm25 + 'μg/m³');
              var pm10 = data.pm25.pm25.pm10;
              $oPm10.html('pm10: ' + pm10 + 'μg/m³');
              var quality = data.pm25.pm25.quality;
              $oQuality.html('空气质量: ' + quality);
              var humidity = data.realtime.weather.humidity;
              $oHumidity.html('当前相对湿度: ' + humidity + '%');
              var curTem = data.realtime.weather.temperature;
              $oCurTem.html('当前温度: ' + curTem + '℃');
              var curpm = data.pm25.pm25.curPm;
              $oCurpm.html('当前pm2.5: ' + curpm + 'μg/m³');


              //设置生活指数每一项的值
              function setLifeValue($obj, i) {
                $obj.each(function(index) {
                  var value = null;
                  switch (index) {
                    case 0:
                    value = data.life.info.chuanyi[i];
                    break;
                    case 1:
                    value = data.life.info.ganmao[i];
                    break;
                    case 2:
                    value = data.life.info.kongtiao[i];
                    break;
                    case 3:
                    value = data.life.info.xiche[i];
                    break;
                    case 4:
                    value = data.life.info.yundong[i];
                    break;
                    case 5:
                    value = data.life.info.ziwaixian[i];
                    break;
                  }
                  $(this).html(value);
                }); 
              }
              setLifeValue($oSpan, 0);
              setLifeValue($oP, 1);
              
            });
          }
          

          $oSubmit.on('click', function() {
            var city = $oSearch.prop('value');
            console.log(city);
            setWeather(city);
          });

          $(document).on('keyup', function(e) {
            if (e.keyCode == 13) {
              var city = $oSearch.prop('value');
              setWeather(city);
            }
          });
          setWeather('厦门');

		});