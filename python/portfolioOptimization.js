function getAnnualReturnRateByTicker(ticker){

	getAjax("https://api.iextrading.com/1.0/stock/"+ticker+"/chart/1y",function(result){
		var daydiff=[];
		var annualReturnRate,totalReturn=0;
		for (var day=0;day<result.length-1;day++){
			var eachdiff=Math.log(result[day+1].close/result[day].close);
			daydiff.push(eachdiff);
		}
		for (var day=0;day<daydiff.length;day++){
			totalReturn+=daydiff[day];
		}
		annualReturnRate=(totalReturn/daydiff.length)*252;
		console.log("Annualized log return of "+ticker+" is "+annualReturnRate);
	});
}

function portfolioOptimization(tickers,totalInvestment){
	var data=[
		{
			ticker:"aapl",
			return:29.72
		},
		{
			ticker:"cost",
			return:4.44
		},
		{
			ticker:"googl",
			return:21.68
		}
	];


	for (var a=0;a<tickers.length;a++){
		getAnnualReturnRateByTicker(tickers[a]);
	}
}
