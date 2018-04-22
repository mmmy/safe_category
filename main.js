
var upColor = '#00da3c';
var downColor = '#ec0000';

function convertData(data) {
  var categoryData = []
  var values = []
  var earns = []  // 涨幅
  var volumes = []
  var dataLen = data.length
  
  var singles = []
  var singlesRed = []
  var singlesYellow = []

  for(var i=dataLen - 1; i >= 0; i--) {
    var item = data[i]
    var date = new Date(item.id * 1000)
    var dateStr = date.toLocaleDateString() + ' ' + date.toTimeString().slice(0, 8)
    categoryData.push(dateStr)
    var kline = [item.open, item.close, item.low, item.high]
    values.push(kline)
    earns.push((item.close - item.open) / item.open)
    volumes.push(item.vol)
    singles.push(0)
  }
  for (var i=1; i<dataLen; i++) {
  	var volIncrease = volumes[i] / volumes[i-1] > 2.3
  	var isEarn = earns[i] > 0
  	var earnsIncrease = Math.abs(earns[i] / earns[i-1]) > 1.1
  	if (volIncrease && isEarn && earnsIncrease) {
  		singles[i] = 1
  	}
  }

  var useLen = 5
  for (var i=0; i<dataLen - 5; i++) {
    var lastestKlines = []
    for(var j=0; j<useLen; j++) {
      lastestKlines.push(data[i+j])
    }
    var s = safe_category__escape_before_redjump(lastestKlines, 60)
    singlesRed[dataLen - i - 1] = s
    // 把暴跌的信号标识出来
    if (UTILS.getEarnRate(data[i]) < -0.018) {
      singlesYellow[dataLen - i - 1] = 0.5
    }
  }

  var mmy = {
    categoryData,
    values,
    volumes,
    singles,
    singlesRed,
    singlesYellow,
    earns,
  }
  console.log(mmy)
  return mmy
}

window.onload = function() {
	var myChart = echarts.init(document.getElementById('app'));
	// function splitData(rawData) {
 //    var categoryData = [];
 //    var values = []
 //    for (var i = 0; i < rawData.length; i++) {
 //        categoryData.push(rawData[i].splice(0, 1)[0]);
 //        values.push(rawData[i])
 //    }
 //    return {
 //        categoryData: categoryData,
 //        values: values
 //    };
	// }
   
  // var data = convertData(window._dataE.data.slice(0,1000))
	var data = convertData(window._data30eth.data)


function calculateMA(dayCount, data) {
    var result = [];
    for (var i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += data.values[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
    }
    return result;
}

  myChart.setOption(option = {
        backgroundColor: '#fff',
        animation: false,
        legend: {
            bottom: 10,
            left: 'center',
            data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            position: function (pos, params, el, elRect, size) {
                var obj = {top: 10};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            },
            formatter: function(params){
            	console.log(params)
            	var K = params[0]
            	var rate = ((K.data[2] - K.data[1]) * 100 / K.data[1]).toFixed(2) + '%'
            	return `<div>
                <div>${K.dataIndex}</div>
            		<div>${K.axisValue}</div>
            		<div>${rate}</div>
								<div>O: ${K.data[1]}</div>
								<div>C: ${K.data[2]}</div>
								<div>L: ${K.data[3]}</div>
								<div>H: ${K.data[4]}</div>
								<div>V: ${ params[5].value.toFixed && params[5].value.toFixed(0) }</div>
            	</div>`
            },
            // extraCssText: 'width: 170px'
        },
        axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#777'
            }
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: false
                },
                brush: {
                    type: ['lineX', 'clear']
                }
            }
        },
        brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
                colorAlpha: 0.1
            }
        },
        visualMap: {
            show: false,
            seriesIndex: 5,
            dimension: 2,
            pieces: [{
                value: 1,
                color: downColor
            }, {
                value: -1,
                color: upColor
            }]
        },
        grid: [
            {
                left: '10%',
                right: '8%',
                top: '5%',
                height: '50%'
            },
            {
                left: '10%',
                right: '8%',
                top: '56%',
                height: '10%'
            },
            {
                left: '10%',
                right: '8%',
                top: '70%',
                height: '10%'
            },
        ],
        xAxis: [
            {
                type: 'category',
                data: data.categoryData,
                scale: true,
                boundaryGap : false,
                axisLine: {onZero: false},
                splitLine: {show: false},
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                }
            },
            {
                type: 'category',
                gridIndex: 1,
                data: data.categoryData,
                scale: true,
                boundaryGap : false,
                axisLine: {onZero: false},
                axisTick: {show: false},
                splitLine: {show: false},
                axisLabel: {show: false},
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax'
                // axisPointer: {
                //     label: {
                //         formatter: function (params) {
                //             var seriesValue = (params.seriesData[0] || {}).value;
                //             return params.value
                //             + (seriesValue != null
                //                 ? '\n' + echarts.format.addCommas(seriesValue)
                //                 : ''
                //             );
                //         }
                //     }
                // }
            },
            {
                type: 'category',
                data: data.categoryData,
                scale: true,
                gridIndex: 2,
                boundaryGap : false,
                axisLine: {onZero: false},
                splitLine: {show: false},
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                }
              }
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: true
                }
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
            },
            {
                scale: true,
                splitArea: {
                    show: true
                },
                gridIndex: 2,
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1, 2],
                start: 0,
                end: 10
            },
            {
                show: true,
                xAxisIndex: [0, 1, 2],
                type: 'slider',
                top: '85%',
                start: 98,
                end: 100
            }
        ],
        series: [
            {
                name: 'eso-1h',
                type: 'candlestick',
                data: data.values,
                itemStyle: {
                    normal: {
                        color: upColor,
                        color0: downColor,
                        borderColor: null,
                        borderColor0: null
                    }
                },
                tooltip: {
                    formatter: function (param) {
                        param = param[0];
                        return [
                            'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                            'Open: ' + param.data[0] + '<br/>',
                            'Close: ' + param.data[1] + '<br/>',
                            'Lowest: ' + param.data[2] + '<br/>',
                            'Highest: ' + param.data[3] + '<br/>'
                        ].join('');
                    }
                }
            },
            {
                name: 'MA5',
                type: 'line',
                data: calculateMA(5, data),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA10',
                type: 'line',
                data: calculateMA(10, data),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA20',
                type: 'line',
                data: calculateMA(20, data),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'MA30',
                type: 'line',
                data: calculateMA(30, data),
                smooth: true,
                lineStyle: {
                    normal: {opacity: 0.5}
                }
            },
            {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: data.volumes
            },
            {
                name: 'single',
                type: 'bar',
                data: data.singles,
                yAxisIndex: 2,
                xAxisIndex: 2,
                itemStyle: {
                  color: 'green'
                }
            },
            {
              name: 'singleRed',
              type: 'bar',
              data: data.singlesRed,
              yAxisIndex: 2,
              xAxisIndex: 2,
                itemStyle: {
                    color: 'red',
                }
            },
            {
            	name: 'singleYellow',
            	type: 'bar',
            	data: data.singlesYellow,
            	yAxisIndex: 2,
            	xAxisIndex: 2,
                itemStyle: {
                    color: 'blue',
                }
            },
        ]
    }, true);
}