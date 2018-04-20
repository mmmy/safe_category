
function convertData(data) {
  var categoryData = []
  var values = []
  var volumns = []
  var dataLen = data.length
  for(var i=dataLen - 1; i >= 0; i--) {
    var item = data[i]
    var date = new Date(item.id * 1000)
    var dateStr = date.toLocaleDateString() + ' ' + date.toTimeString().slice(0, 8)
    categoryData.push(dateStr)
    var kline = [item.open, item.close, item.low, item.high]
    values.push(kline)
    volumns.push(item.vol)
  }
  return {
    categoryData,
    values,
    volumns,
  }
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
	var data0 = convertData(window._dataE.data)

	function calculateMA(dayCount) {
	    var result = [];
	    for (var i = 0, len = data0.values.length; i < len; i++) {
	        if (i < dayCount) {
	            result.push('-');
	            continue;
	        }
	        var sum = 0;
	        for (var j = 0; j < dayCount; j++) {
	            sum += data0.values[i - j][1];
	        }
	        result.push((sum / dayCount).toFixed(2));
	    }
	    return result;
	}
	var option = {
    title: {
        text: '中国联通',
        left: 0
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line'
        }
    },
    legend: {
        data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
    },
    xAxis: {
        type: 'category',
        data: data0.categoryData,
        scale: true,
        boundaryGap: false,
        axisLine: {
            onZero: false
        },
        splitLine: {
            show: false
        },
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax'
    },
    yAxis: {
        scale: true,
        splitArea: {
            show: true
        }
    },
    dataZoom: [{
        type: 'inside',
        start: 50,
        end: 100
    }, {
        show: true,
        type: 'slider',
        y: '90%',
        start: 50,
        end: 100
    }],
    series: [{
            name: '日K',
            type: 'candlestick',
            data: data0.values,
            markPoint: {
                label: {
                    normal: {
                        formatter: function(param) {
                            return param != null ? Math.round(param.value) : '';
                        }
                    }
                },
                data: [{
                    name: '标点',
                    coord: ['2013/5/31', 2300],
                    value: 2300,
                    itemStyle: {
                        normal: {
                            color: 'rgb(41,60,85)'
                        }
                    }
                }, {
                    name: 'highest value',
                    type: 'max',
                    valueDim: 'highest'
                }, {
                    name: 'lowest value',
                    type: 'min',
                    valueDim: 'lowest'
                }, {
                    name: 'average value on close',
                    type: 'average',
                    valueDim: 'close'
                }],
                tooltip: {
                    formatter: function(param) {
                        return param.name + ' < br > ' + (param.data.coord || '');
                    }
                }
            },
            markLine: {
                symbol: ['none', 'none'],
                data: [
                    [{
                        name: 'from lowest to highest',
                        type: 'min',
                        valueDim: 'lowest',
                        symbol: 'circle',
                        symbolSize: 10,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        }
                    }, {
                        type: 'max',
                        valueDim: 'highest',
                        symbol: 'circle',
                        symbolSize: 10,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        }
                    }], {
                        name: 'min line on close',
                        type: 'min',
                        valueDim: 'close'
                    }, {
                        name: 'max line on close',
                        type: 'max',
                        valueDim: 'close'
                    }
                ]
            }
        }, {
            name: 'MA5',
            type: 'line',
            data: calculateMA(5),
            smooth: true,
            lineStyle: {
                normal: {
                    opacity: 0.5
                }
            }
        }, {
            name: 'MA10',
            type: 'line',
            data: calculateMA(10),
            smooth: true,
            lineStyle: {
                normal: {
                    opacity: 0.5
                }
            }
        }, {
            name: 'MA20',
            type: 'line',
            data: calculateMA(20),
            smooth: true,
            lineStyle: {
                normal: {
                    opacity: 0.5
                }
            }
        }, {
            name: 'MA30',
            type: 'line',
            data: calculateMA(30),
            smooth: true,
            lineStyle: {
                normal: {
                    opacity: 0.5
                }
            }
        },
        // {
        //     data: [1, 1, 1, 1, 1, 1, 1],
        //     type: 'bar'
        // }
    ]
	};
	myChart.setOption(option);
}