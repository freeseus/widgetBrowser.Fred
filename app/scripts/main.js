var apiKey = '147e280bf158656f15b498dcf66aac3f';
var dataURL = '' //'http://api.stlouisfed.org/fred/series/observations?series_id=GNPCA&observation_start=1776-07-04&api_key=' + apiKey + '&observation_end=2013-05-25';
var dataSet = {};
var urlData = {};
var browser = {};
var console;

//dataURL = 'http://data.treasury.gov/feed.svc/DailyTreasuryYieldCurveRateData?$filter=year(NEW_DATE)%20eq%202013';

function processData(data){
	console.log(data);
	//console.log(data.query.results.observations);

	//console.log(urlData);

	data.observation = data.observations;

	dataSet = {};
	dataSet.chart = data;
	dataSet.chart.settings = {};
	dataSet.chart.settings.title = urlData.title;
	dataSet.chart.settings.subtitle = urlData.subtitle;
	dataSet.chart.settings.graphType = urlData.graphtype;
	dataSet.chart.settings.colors = {};
	dataSet.chart.settings.colors.line = ['#bb6d82', '#ecafaf', '#d7706c', '#76acb8', '#81d0e6', '#4e86b6', '#b8b1a9'],
	dataSet.chart.settings.colors.bar = ['#af516c', '#ecafaf', '#d7706c', '#df8f87', '#af857f', '#d8a69a', '#b8b1a9'],
	dataSet.chart.settings.opacity = .25;
	dataSet.chart.settings.yAxis = {};
	dataSet.chart.settings.yAxis.min = null,
	dataSet.chart.settings.yAxis.max = null;
	dataSet.chart.settings.tooltip = {};
	dataSet.chart.settings.tooltip.fontColor = '#333';
	dataSet.chart.settings.tooltip.backgroundColor = '#fff';
	dataSet.chart.settings.tooltip.borderColor = null;
	dataSet.chart.settings.tooltip.ie8BackgroundColor = '#fff';
	dataSet.chart.settings.tooltip.ie8FontColor = '#333';
	dataSet.chart.settings.legend = {};
	dataSet.chart.settings.animTime = 1000;
	dataSet.chart.settings.stretchgraph = urlData.stretchgraph;

	createHighchart(dataSet.chart.settings.graphType);
}

function createHighchart(graphType){
	var htmlChartLocation = 'chart';

	$('.content').append('<div id="' + htmlChartLocation + '" style="position:relative; top:-14px; width:' + urlData.width + '; height:' + urlData.height + '; opacity:0;"></div>');
	
	var mArr = {Jan: 0,Feb: 1,Mar: 2,Apr: 3,May: 4,Jun: 5,Jul: 6,Aug: 7,Sep: 8,Oct: 9,Nov: 10,Dec: 11};
	var yearID = 0;
	var FT = {}; FT.interactive = {}; FT.interactive.chartdata = dataSet.chart;

	FT.interactive.options = {
		chart:{
			renderTo: htmlChartLocation,
			y:20,
			marginTop: dataSet.chart.settings.subtitle !== null ? 65 : 50,
			marginBottom: 50,
			marginRight: 5
		},
		title:{
			text: dataSet.chart.settings.title
		},
		credits:{
			enabled:true,
			text: 'Sources: ' + urlData.sourcetext,
			href: null, //urlData.sourceurl <--- this won't work open in a new window
			position: {
				align: 'left',
				x: 5,
				verticalAlign: 'bottom',
				y: -3
			},
			style:{
				color: '#74736c',
				font: '10px BentonSans, Arial, Helvetica, sans-serif',
				fontStyle: 'normal',
				fontFamily: 'BentonSans',
				fontSize: '10px'
			}
		},
		xAxis:{
			y:0,
			offset: 10, //vertical spacing pushing the x-axis down/up
			lineWidth: 1,
			tickWidth: 1,
			maxPadding: 25,
			tickPosition: 'outside',
			labels:{
				style:{
					color: '#74736c',
					font: '12px BentonSans, Arial, Helvetica, sans-serif',
					fontFamily: 'BentonSans',
					fontSize: '12px'
				}
			}
		},
		plotOptions:{
			 series:{
				animation:{
					  duration: 0
				},
				shadow:false,
				marker:{
					enabled: true,
					radius: 0,
					//fillColor: '#fff9f1',
					//lineColor: 'rgba(0,0,0,.15)',
					lineColor: null,
					fillColor: null,
					//lineWidth: 2,
					symbol: 'circle',
					states:{
						hover:{
							radius: 6,
							fillColor: '#fff1e0',
							lineColor: null,
							lineWidth: 3,
						}
					}
				},
				states:{
					hover:{
						halo:{
							size: 0
						}
					}
				}
			 }
		},
		exporting:{
			enabled: false
		}
	};

	FT.interactive.data = [];	 
	FT.interactive.options.xAxis = {
		plotBands:[],
		dateTimeLabelFormats:{
			month: '%b' + " '" + '%y',
			week: '%b %e',
			day: '%b %e',
			hour: '%l %P',
			minute: '%l:%M %P'
		}
	};

	FT.interactive.options.tooltip = {
		useHTML: true,
		formatter: function(){
			if(FT.interactive.chartdata.settings.tooltip.backgroundColor === null){
				$($('.highcharts-tooltip')[0].childNodes[0]).css('fill', this.point.series.color); //hack, if you want a dark background and light text
			}
		
			var str = '', tDate = new Date(this.total[0]);
				str = String(tDate).split(' ');
			
			//console.log(str);
			
			//console.log(this.total);

			if(this.percentage !== 'no'){
				//alert(str[4]);
				
				if(str[3].length > 4){
					str.splice(3,0,str[5]);
				}
			
				var tz = parseInt(str[4].substring(0, 5));
				var a = str[1] + ' ' + str[2] + ', ' + str[3] + ' ' + tz;
				
				//str = '<b>'+ this.total[1] + '</b><br/>' + a;
				//console.log(this.total);

				if(!urlData.unitsBefore || urlData.unitsBefore === null || urlData.unitsBefore === undefined){
					urlData.unitsBefore = '';
				}

				if(!urlData.unitsAfter || urlData.unitsAfter === null || urlData.unitsAfter === undefined){
					urlData.unitsAfter = '';
				}

				if(urlData.unitsAfter === 'per cent'){
					urlData.unitsAfter = ' per cent';
				}

				//console.log(this.total[2]);

				var indexOfPeriod = String(this.total[2]).indexOf('.');

				if(indexOfPeriod > 0){
					if(this.total[2].length - indexOfPeriod > 3){
						//console.log('long decimal');
						this.total[2] = this.total[2].substring(0, indexOfPeriod + 4);
						this.total[2] = Number(this.total[2]);
					}
				}

				//this.total[2] = parseFloat(this.total[2]);

				//console.log(this.total[2] = parseInt(this.total[2]).toFixed(2));


				return urlData.unitsBefore + prettyNumber(this.total[2]) + urlData.unitsAfter;

				
			}else{
				//return '<b>'+ 'Unhealthy' + '</b><br/>' + 'An AQI of 150 or greater is considered unhealthy';
				return 'block';
			}
		}
	};
	
	if(graphType){
		FT.interactive.chartdata.settings.graphType = graphType;
	}
	
	if(FT.interactive.chartdata.settings.graphType === 'line'){
		//FT.interactive.chartdata.settings.graphType = 'spline';
	}

	FT.interactive.chartdata.sections = [];

	if(FT.interactive.chartdata.entry && FT.interactive.chartdata.entry[0]){
		delete FT.interactive.chartdata.entry[0].content.properties['Id'];
		delete FT.interactive.chartdata.entry[0].content.properties['NEW_DATE'];
		delete FT.interactive.chartdata.entry[0].content.properties['BC_30YEARDISPLAY'];

		//console.log(Object.keys(FT.interactive.chartdata.entry[0].content.properties).length);

		FT.interactive.chartdata.sections = Object.keys(FT.interactive.chartdata.entry[0].content.properties);
	}

	//console.log(FT.interactive.chartdata.observation);

	var section = {
		name: FT.interactive.chartdata.sections[i],
		data: [],
		type: FT.interactive.chartdata.settings.graphType,
		lineWidth: 2,
		fillOpacity: dataSet.chart.settings.opacity,
		color: FT.interactive.chartdata.settings.graphType === 'column' || FT.interactive.chartdata.settings.graphType === 'bar' ? dataSet.chart.settings.colors.bar[0] : dataSet.chart.settings.colors.line[0],
		shadow: false,
		connectNulls: false
	};
	//console.log(FT.interactive.chartdata);
	var totalEntries = FT.interactive.chartdata.observation.length;
	//console.log(totalEntries / 1000);

	var adjustedArray = [];

	for(var i = 0; i < FT.interactive.chartdata.observation.length; i++){
		var date = FT.interactive.chartdata.observation[i].date;
		var dateArray = date.split('-');

		if(date === '.'){
			date = null;
		}else{
			date = Date.parse(dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0]);
		}


		if(urlData.startDate){
			if(urlData.endDate){
				if(date >= urlData.startDate && date <= urlData.endDate){
					adjustedArray.push(FT.interactive.chartdata.observation[i]);
				}
			}else{
				if(date >= urlData.startDate){
					adjustedArray.push(FT.interactive.chartdata.observation[i]);
				}
			}
		}else{
			if(urlData.endDate){
				if(date <= urlData.endDate){
					adjustedArray.push(FT.interactive.chartdata.observation[i]);
				}
			}
		}
	}

	if(adjustedArray.length > 0){
		FT.interactive.chartdata.observation = adjustedArray;
	}

	for(i = 0; i < FT.interactive.chartdata.observation.length; i += Math.floor(FT.interactive.chartdata.observation.length / 1000) + 1){
	//for(var i = 0; i < FT.interactive.chartdata.observation.length; i++){
		var date = FT.interactive.chartdata.observation[i].date;
		var value = Number(FT.interactive.chartdata.observation[i].value);
		var dateArray = date.split('-');

		if(FT.interactive.chartdata.observation[i].value !== 0 && FT.interactive.chartdata.observation[i].value !== '0' && value === 0){
			value = null;
		}


		/*
		if(value.length > 3){
			var zeros = '1';
			for(var j = 0; j < value.length - 3; j++){
				zeros += '0';
			}
			value /= zeros;

			value = Math.round(value * 100) / 100;
		}
		*/

		if(dataSet.chart.settings.yAxis.min === null){
			dataSet.chart.settings.yAxis.min = value;
		}else if(value < dataSet.chart.settings.yAxis.min){
			dataSet.chart.settings.yAxis.min = value;
		}

		if(dataSet.chart.settings.yAxis.max === null){
			dataSet.chart.settings.yAxis.max = value;
		}else if(value > dataSet.chart.settings.yAxis.max){
			dataSet.chart.settings.yAxis.max = value;
		}

		if(date === '.' || value === '.'){
			date = null;
			value = null;
		}else{
			//console.log(date);
			date = Date.parse(dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0]);
			//console.log(date);
		}

		//console.log(value);

		if(value){
			section.data.push({
				x: date,
				y: Math.round(value * 100) / 100,
				total: [date,value,FT.interactive.chartdata.observation[i].value]
			});
		}
	}

	var verticalAdjustment = 2.5 * (dataSet.chart.settings.yAxis.max - dataSet.chart.settings.yAxis.min) / parseFloat(urlData.height);

	dataSet.chart.settings.yAxis.min -= verticalAdjustment;
	dataSet.chart.settings.yAxis.max += verticalAdjustment;

	dataSet.chart.settings.yAxis.max = Math.ceil(dataSet.chart.settings.yAxis.max) + ((dataSet.chart.settings.yAxis.max - dataSet.chart.settings.yAxis.min) / 6);

	console.log(dataSet.chart.settings.yAxis.max);

	FT.interactive.data.push(section);

	//var dateInterval =  20 * 12 * 30  * 24 * 3600 * 1000;
	var dateInterval = 30  * 24 * 3600;
	
	//dateInterval = dateInterval * (count / 100) * Number(FT.interactive.chartdata.settings.dateSpacer);
	
	FT.interactive.options.xAxis.type = 'datetime';
	//FT.interactive.options.xAxis.tickPixelInterval = 50;
	/*
	FT.interactive.options.xAxis.tickPositioner = function(min, max) {
        // specify an interval for ticks or use max and min to get the interval
        console.log(this);
        return this.tickInterval;
    }
    */
    //FT.interactive.options.xAxis.showFirstLabel = false,
    //FT.interactive.options.xAxis.showLastLabel = false,

	FT.interactive.options.series = FT.interactive.data;

	//console.log(FT.interactive.options.series[0].data.length / parseInt(urlData.width));

	applyTheme();
	
	var highchart = new Highcharts.Chart(FT.interactive.options, function(c){chartLoaded(c)});
	
	function convertDate(string){
		array = string.split(',');
		
		if(array.length === 1){
			while(array.length < 3){
				array.push(0);
			}
			
			array[2] = 1;
		}else if(array.length === 2){
			array.push(1);
			array[1] -= 1;
		}else if(array.length > 2){
			array[1] -= 1;
		}
		
		return Date.UTC(array[0],array[1], array[2]);
	}

	function prettyNumber(x){
    	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
	function applyTheme(){
		//console.log(FT.interactive.options.series);
		//console.log(dataSet.chart.settings.yAxis.min, console.log(dataSet.chart.settings.yAxis.max);
		Highcharts.theme = {
			//colors: ['#9e2f50', '#4781aa', '#eda45e', '#a6a471', '#736e7e', '#94826b', '#936971', '#c36256', '#8ab5cd'],
			//colors:['#c36256', '#75a5c2', '#eda45e', '#a6a471', '#736e7e', '#94826b', '#936971', '#819e9a', '#c1b8b4', '#eed485'],
			colors:FT.interactive.chartdata.settings.colors,
			chart:{
				backgroundColor: 'none',
				borderWidth: 0,
				plotBackgroundColor: 'none',
				plotShadow: false,
				plotBorderWidth: 0,
				spacingRight: 3,
				spacingLeft: 5,
				spacingBottom:55
			},
			
			title:{
				align: 'left',
				floating: false,
				x: 0,
				y: 10,
				style:{ 
					color: '#43423e',
					font: '18px BentonSans, Arial, Helvetica, sans-serif',
					fontFamily: 'BentonSans',
					fontSize: '18px',
					fontWeight: 'normal'
				}
			},
			subtitle: {
	            text: dataSet.chart.settings.subtitle,
	            floating: false,
	            align: 'left',
	            x: 0,
	            y: 30,
	            style:{ 
					color: '#74736c',
					font: '12px BentonSans, Arial, Helvetica, sans-serif',
					fontFamily: 'BentonSans',
					fontSize: '12px'
				}
	        },
	        xAxis:{
				lineColor: '#a7a59b',
				lineWidth: 1,
				tickColor: 'rgba(0,0,0,0.15)',
				tickLength: -10,
				minPadding: 0.01, //this is the spacing of the drawn chart from the left-hand edge
				maxPadding: 250 / parseFloat(urlData.width) / 15, //.01, //this is the spacing of the drawn chart from right-hand edge
				tickPosition: 'inside',
				labels:{
					x:-2,
					y:25,
					style:{
						color: '#74736c',
						font: '12px BentonSans, Arial, Helvetica, sans-serif',
						fontFamily: 'BentonSans',
						fontSize: '12px'
					}
				}
			},
			yAxis: {
				title: '',
				min:dataSet.chart.settings.yAxis.min,
				//max:dataSet.chart.settings.yAxis.max,
				startOnTick: true, //bottom
				offset: 26,
				tickLength: 26,
				tickWidth: 1,
	            endOnTick: dataSet.chart.settings.stretchgraph === true ? true : false, //top
	        	tickColor: 'rgba(0,0,0,.15)',
	        	tickPosition: 'inside',
	        	gridLineColor: 'rgba(0,0,0,.15)',
	        	gridLineDashStyle: 'ShortDot',
				labels: {
	                align: 'left',
	                x: 0,
	                y: -2,
	                style:{
						color: '#74736c',
						font: '12px BentonSans, Arial, Helvetica, sans-serif',
						fontFamily: 'BentonSans',
						fontSize: '12px'
					}
	            }
			},
			plotOptions:{
				column:{
					borderWidth: 0,
					shadow: false
				},	
				bar:{
					borderWidth: 0,
					shadow: false
				},
				line:{
					shadow: false,
					lineWidth:3,
					series:{
						animation:{
							duration: dataSet.chart.settings.animTime
						},
						shadow:false,
						marker:{
							radius: 1,
						}
					}
				},
				pie:{
					lineWidth:1,
					slicedOffset:15,
					shadow:false,
					showInLegend:true,
					center: ['50%', '45%'],
					size: '85%',
					series:{
						showCheckbox: true,
					},
					dataLabels:{
						enabled: false,
						color: '#74736c',		
						softConnector: false,					
						connectorColor: '#74736c',
						style:{
							font: '12px BentonSans, Arial, Helvetica, sans-serif',
							fontFamily: 'BentonSans',
							fontSize: '12px'
						},	
					}
				}
			},
			legend:{
				enabled: false,
				layout: 'horizontal',
				backgroundColor: 'rgba(255,241,224,.0)',
				borderColor: 'rgba(0,0,0,0)',
				align: 'left',
				verticalAlign:'bottom',
				floating: true,
				shadow: false,
				borderRadius: 0,
				borderWidth:1,
				margin: 10,
				x:0 + Number(FT.interactive.chartdata.settings.legend.offsetX),
				y:35 + Number(FT.interactive.chartdata.settings.legend.offsetY),
				itemMarginBottom:3,
				padding: 6,
				itemMarginTop: 0,
				itemMarginBottom: 0,
				//width:773,
				//itemWidth:150,
				itemStyle:{
					lineHeight: '14px',
					font: '12px BentonSans, Arial, Helvetica, sans-serif',
					fontFamily: 'BentonSans',
					fontSize: '12px',
					color: '#74736c'
				},
				itemHiddenStyle:{
					color: '#74736c'
				},
				itemHoverStyle:{
					color: '#4781aa'
				}
			},
			labels:{
				style:{
					color: '#74736c',
				}
			},
			tooltip:{
				style:{
					color: browser.type === 'Internet Explorer' && parseFloat(browser.version) < 9 ? FT.interactive.chartdata.settings.tooltip.ie8FontColor : FT.interactive.chartdata.settings.tooltip.fontColor, //#fff9f1 for hack to do dark background
					font: '12px BentonSans, Arial, Helvetica, sans-serif',
					fontFamily: 'BentonSans',
					fontSize: '12px'
				},
				backgroundColor: browser.type === 'Internet Explorer' && parseFloat(browser.version) < 9 ? FT.interactive.chartdata.settings.tooltip.ie8BackgroundColor : FT.interactive.chartdata.settings.tooltip.backgroundColor,
				borderColor: FT.interactive.chartdata.settings.tooltip.borderColor,
				borderRadius: 4,
				borderWidth: 0,
				shadow: true,
			}
		};
		
		var highchartsOptions = Highcharts.setOptions(Highcharts.theme);

		if(urlData.updatedText){
			$('body').append('<div id="updatedText" style="position:absolute; top:2px; color:#74736c; font-size:12px; font-family:BentonSans, Arial, Helvetica, sans-serif; font-style:italic;">Updated: ' + urlData.updatedText + '</div>');

			$('#updatedText').css('pointer-events','none').css('left', (parseInt(urlData.width) - ($('#updatedText').width() + 5)) + 'px');
		}
	}
	
	$('#' + htmlChartLocation).stop().animate({opacity: 1}, 
		250, function(){}
	)
}

if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
	var ieversion = new Number(RegExp.$1); // capture x.x portion and store as a number
	if(ieversion <= 9){
		browser.version = 8;
		browser.type = 'Internet Explorer';
		console = {};
		console.log = function(t){/* alert(t); */};
	}
}else{
	browser.type = 'Chrome';
}

if(document.URL.indexOf('?') > -1){		
	var str = document.URL.slice(document.URL.indexOf('?') + 1, document.URL.length);
	var arr = str.split('&');
	var series;
	
	for(var i = 0; i < arr.length; i++){
		if(arr[i].indexOf('g0r1a2p3h4t5y6p7e8') > -1){
			urlData.graphtype = arr[i].split('g0r1a2p3h4t5y6p7e8').join('').substring(1).split('%20').join(' ');
		}else if(arr[i].indexOf('t0i1t2l3e4') > -1){
			urlData.title = convertSpecialCharacters(arr[i].split('t0i1t2l3e4').join('').substring(1).split('%20').join(' '));
		}else if(arr[i].indexOf('y0a1x2i3s4') > -1){
			urlData.subtitle = convertSpecialCharacters(arr[i].split('y0a1x2i3s4').join('').substring(1).split('%20').join(' '));
		}else if(arr[i].indexOf('w0i1d2t3h4') > -1){
			urlData.width = arr[i].split('w0i1d2t3h4').join('').substring(1);			
		}else if(arr[i].indexOf('h0e1i2g3h4t5') > -1){
			urlData.height = arr[i].split('h0e1i2g3h4t5').join('').substring(1);
		}else if(arr[i].indexOf('s0o1u2r3c4e5t6e7x8t9') > -1){
			urlData.sourcetext = convertSpecialCharacters(arr[i].split('s0o1u2r3c4e5t6e7x8t9').join('').substring(1).split('%20').join(' '));
		}else if(arr[i].indexOf('s0o1u2r3c4e5u6r7l8') > -1){
			urlData.sourceurl = arr[i].split('s0o1u2r3c4e5u6r7l8').join('').substring(1);
		}else if(arr[i].indexOf('s0t1r2e3t4c5h6') > -1){
			//urlData.stretchgraph = Boolean(arr[i].split('stretch').join('').substring(1));
		}else if(arr[i].indexOf('f0e1e2d3') > -1){
			dataURL = arr[i].split('f0e1e2d3').join('').substring(1);
			series = dataURL;
			dataURL = 'http://api.stlouisfed.org/fred/series/observations?series_id=' + arr[i].split('f0e1e2d3').join('').substring(1) + '&api_key=' + apiKey;
			//console.log(dataURL);
		}else if(arr[i].indexOf('u0p1d2a3t4e5d6') > -1){
			urlData.updatedText = convertSpecialCharacters(arr[i].split('u0p1d2a3t4e5d6').join('').substring(1).split('%20').join(' '));
		}else if(arr[i].indexOf('r0e1a2l3t4i5m6e7_8s9t0a1r2t3') > -1){
			var date = arr[i].split('r0e1a2l3t4i5m6e7_8s9t0a1r2t3').join('').substring(1);
			var dateArray = date.split('-');

			if(date === '.'){
				date = null;
			}else{
				if(Number(dateArray[1]) < 9){
					dateArray[1] = '0' + (Number(dateArray[1]) + 1);

					//console.log(dateArray[1]);
				}else{
					dateArray[1] = Number(dateArray[1]) + 1;
				}

				date = dateArray.join('-');
			}

			start = date;
			dataURL += '&observation_start=' + date;

			urlData.startDate = date;
		}else if(arr[i].indexOf('r0e1a2l3t4i5m6e7_8e9n0d1') > -1){
			var date = arr[i].split('r0e1a2l3t4i5m6e7_8e9n0d1').join('').substring(1);
			var dateArray = date.split('-');

			if(date === '.'){
				date = null;
			}else{
				if(Number(dateArray[1]) < 9){
					dateArray[1] = '0' + (Number(dateArray[1]) + 1);

					//console.log(dateArray[1]);
				}else{
					dateArray[1] = Number(dateArray[1]) + 1;
				}

				date = dateArray.join('-');
			}

			dataURL += '&observation_end=' + date;

			urlData.endDate = date;
		}else if(arr[i].indexOf('g0u1n2i3t4b') > -1){
			urlData.unitsBefore = convertSpecialCharacters(arr[i].split('g0u1n2i3t4b').join('').substring(1));
		}else if(arr[i].indexOf('g0u1n2i3t4a') > -1){
			urlData.unitsAfter = convertSpecialCharacters(arr[i].split('g0u1n2i3t4a').join('').substring(1));
		}
	}

	if(!urlData.graphtype){
		urlData.graphtype = 'spline';
	}

	var api = {};
		api.proxy = 'http://jsonp.herokuapp.com/?url=';
		api.key = '147e280bf158656f15b498dcf66aac3f';
		api.series = [];
		api.seriesData = [];
		api.url = api.proxy + encodeURIComponent('http://api.stlouisfed.org/fred/series/observations?series_id=') + series + encodeURIComponent('&api_key=' + api.key + '&file_type=json&') + 'observation_start=' + urlData.startDate + encodeURIComponent('&') + 'observation_end=' + urlData.endDate;
	
		//console.log(series, urlData.startDate, urlData.endDate);

		//console.log(api.proxy + dataURL);

		//console.log(api.url);
		getChartData(api.url);
	//$.getJSON('http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from xml where url='" + dataURL + "'") + '&format=json&diagnostics=true&callback=?', function(ds){}).success(processData);
	
}else{
	$('#chart').remove();
	$('.content').append('<div>No feed specified</div>');
}

var tries = 0;

function getChartData(u){
	var url = u;
	$.getJSON(u, function(ds){
		console.log('should always happen', ds);
	}).success(processData).fail(function (e){
		//console.log('this failed????');
		tries++;

		if(tries === 3){
			alert('Could not graph data - something wrong with data');
		}else{
			getChartData(url);
		}
	});
}

function captureChart(){
	highchart.exportChart({scale:1, type:'image/png'});
}

function convertSpecialCharacters(s){
	return s.split('%C2%A3').join('£')
			.split('[$pound]').join('£')
			.split('%E2%82%AC').join('€')
			.split('[$euro]').join('€')
			.split('%C2%A5').join('¥')
			.split('[$yen]').join('¥')
			.split('%C2%A2').join('¢')
			.split('[$cent]').join('¢')
			.split('[$amperand]').join('&')
			.split('%3C').join('<')
			.split('[$lessthan]').join('<')
			.split('%3E').join('<')
			.split('[$greaterthan]').join('<')
			.split('%C2%A9').join('©')
			.split('[$copyright]').join('©')
			.split('%C2%AE').join('®')
			.split('[$registeredtrademark]').join('®')
			.split('%E2%84%A2').join('™')
			.split('[$trademark]').join('™')
			.split('%C2%B0').join('°')
			.split('[$degree]').join('°')
			.split('%C2%B5').join('µ')
			.split('[$micro]').join('µ')
			.split('%20').join(' ')
			.split('%E2%9C%88').join('"')
			.split('%27').join("'")
			;
}

function chartLoaded(chart){
	//console.log('chart has loaded');
	//console.log('drawing stuff');

	/*
	chart.renderer.path(['M', 0, 0, 'L', 100, 100, 200, 50, 300, 100])
		.attr({
			'stroke-width': 1,
			stroke: 'red'
		}).add();
	*/

	$('.highcharts-axis:eq(1)').children().attr('stroke-dasharray', '1,1');
	$('.highcharts-axis:eq(1)').children('path:last-child').attr('stroke-dasharray', '').css('stroke', '#a7a59b').attr('stroke-opacity',1);
}