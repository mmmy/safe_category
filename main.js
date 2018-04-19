window.onload = function() {
	var myChart = echarts.init(document.getElementById('app'));
	function splitData(rawData) {
    var categoryData = [];
    var values = []
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i])
    }
    return {
        categoryData: categoryData,
        values: values
    };
	}
	var data0 =
    splitData([
        ['2016-01-04', 6.084, 5.681, 5.671, 6.104],
        ['2016-01-05', 5.592, 5.631, 5.425, 5.779],
        ['2016-01-06', 5.641, 5.671, 5.622, 5.769],
        ['2016-01-07', 5.641, 5.218, 5.179, 5.641],
        ['2016-01-08', 5.336, 5.375, 5.051, 5.494],
        ['2016-01-11', 5.307, 4.952, 4.923, 5.336],
        ['2016-01-12', 5.011, 4.952, 4.883, 5.041],
        ['2016-01-13', 5.001, 4.913, 4.893, 5.169],
        ['2016-01-14', 4.726, 4.932, 4.676, 4.982],
        ['2016-01-15', 4.903, 4.647, 4.598, 4.903],
        ['2016-01-18', 4.548, 4.647, 4.509, 4.745],

    ]);
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