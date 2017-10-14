function getAjax(url,onDone,onFail){
	$.ajax({
		url:url,
		success:onDone,
		error:onFail,
		method:"GET"
	})
}




//  <0 ; 0-13 ; 14-20 ; 21-28 ; 28+
function getPE(result){
	peRatio=result.peRatio;
	var peScore;
	if (peRatio<10){
		peScore=5
	}
	else if (peRatio>30 || peRatio<0){
		peScore=0
	}
	else{
		peScore=5-(peRatio/6)
	}
	peScore=peScore.toFixed(2);
	var returnPe={
		data:peRatio,
		score:peScore,
		name:"P/E"
	}
	return (returnPe);
}

function getROE(result){
	var quarterData=result.financials;
	totalNetIncome=quarterData[0].netIncome+quarterData[1].netIncome+quarterData[2].netIncome+quarterData[3].netIncome;
	var roe=totalNetIncome/quarterData[0].shareholderEquity*100;
	var roeScore;
	if (roe>30){
		roeScore=5
	}
	else if (roe<5){
		roeScore=0;
	}
	else{
		roeScore=(roe-5)*4/20
	}
	roeScore=roeScore.toFixed(2);
	var returnRoe={
		score:roeScore,
		data:roe,
		name:"ROE"
	}
	return returnRoe;
}

function getIncreaseRateOfRevenue(result){
	var increaseRateOfRevenueScore;
	var quarterData=result.financials;
	var increaseRate1=(quarterData[2].operatingRevenue-quarterData[3].operatingRevenue)/quarterData[3].operatingRevenue;
	var increaseRate2=(quarterData[1].operatingRevenue-quarterData[2].operatingRevenue)/quarterData[2].operatingRevenue;
	var increaseRate3=(quarterData[0].operatingRevenue-quarterData[1].operatingRevenue)/quarterData[1].operatingRevenue;
	var averageIncreaseRate=(increaseRate3+increaseRate2+increaseRate1)/3*100;
	if (averageIncreaseRate>15){
		increaseRateOfRevenueScore=5
	}
	else if (averageIncreaseRate<0){
		increaseRateOfRevenueScore=0
	}
	else{
		increaseRateOfRevenueScore=(averageIncreaseRate*6.66667)/20
	}
	var returnIncreaseRateOfRevenue={
		score:increaseRateOfRevenueScore,
		data:averageIncreaseRate,
		name:"Increase Rate Of Revenue"
	}
	return (returnIncreaseRateOfRevenue)
}

function getIncreaseRateOfProfit(result){
	var quarterData=result.financials;
	var increaseRate1=(quarterData[2].netIncome-quarterData[3].netIncome)/quarterData[3].netIncome;
	var increaseRate2=(quarterData[1].netIncome-quarterData[2].netIncome)/quarterData[2].netIncome;
	var increaseRate3=(quarterData[0].netIncome-quarterData[1].netIncome)/quarterData[1].netIncome;
	var averageIncreaseRate=(increaseRate3+increaseRate2+increaseRate1)/3*100;
	console.log("Profit increase rate is: "+averageIncreaseRate);
}

function getROA(result){
	var roaScore;
	var roa=result.returnOnAssets

	if (roa>12){
		roaScore=5
	}
	else if (roa<0){
		roaScore=0
	}
	else{
		roaScore=roa*25/3/20
	}
	var returnRoa={
		score:roaScore,
		data:roa,
		name:"ROA"
	}
	return returnRoa
}



//in $$
function getEPS(result){
	result=result.earnings;
	var eps=result[0].actualEPS+result[1].actualEPS+result[2].actualEPS+result[3].actualEPS;
	console.log("The EPS is :"+eps);
}

//40-60%, lower better
function getLA(result){
	result=result.financials;
	var la=result[0].totalLiabilities/result[0].totalAssets*100;
	var laScore;
	if (la>80){
		laScore=0;
	}
	else if (la<40){
		laScore=5;
	}
	else {
		laScore=(5-(la-40)*2.5/20).toFixed();
	}
	var returnLa={
		score:laScore,
		data:la,
		name:"Liabilities to Assets ratio"
	}
	return returnLa;
}

//latest quarter
function getProfitMargin(result){
	result=result.financials[0];
	var profitMargin=result.netIncome/result.operatingRevenue*100;
	console.log("The profit Margin is :"+ profitMargin);
}

// Goof if >2, Bad if <1
function getCurrentRatio(result){
	result=result.financials[0];
	var currentRatio=result.currentAssets/result.currentDebt;
	console.log("The Current Ratio is: "+currentRatio);
}

function getQuickRatio(result){
	result=result.financials[0];
	var quickRatio=result.currentCash/result.currentDebt;
	console.log("The Quick Ratio is: "+quickRatio);
}

// PB is smaller better
function getPB(result){
	var pbScore;
	pbRatio=result.priceToBook;
	if (pbRatio<1){
		pbScore=5
	}
	else if (pbRatio>=15){
		pbScore=0
	}
	else{
		pbScore=(5-(pbRatio/3))
	}
	returnPb={
		score:pbScore.toFixed(2),
		data:pbRatio,
		name:"P/B ratio"
	}
	return (returnPb);
}

function getNetProfitGrowth(result){
	thisQuarter=result.financials[0].netIncome;
	lastQuarter=result.financials[1].netIncome;
	netProfitGrowth=(thisQuarter-lastQuarter)/lastQuarter;
	var netProfitGrowthScore;
	if (netProfitGrowth>100){
		netProfitGrowthScore=5;
	}
	else if (netProfitGrowth<0){
		netProfitGrowthScore=0;
	}
	else{
		netProfitGrowthScore=netProfitGrowth/20;
	}
	netProfitGrowthScore=netProfitGrowthScore.toFixed(2)
	returnNetProfitGrowth={
		score:netProfitGrowthScore,
		data:netProfitGrowth
	}
	return (returnNetProfitGrowth)
}

function getCashFlowCoverageRatio(result){
	result=result.financials[0]
	var cashFlowCoverageRatioScore;
	var cashFlowCoverageRatio=result.cashFlow/result.totalDebt
	if (result.totalDebt==null){
		cashFlowCoverageRatioScore=5
	}
	else{
		if (cashFlowCoverageRatio>1){
			cashFlowCoverageRatioScore=5
		}
		else if (cashFlowCoverageRatio<0){
			cashFlowCoverageRatioScore=0
		}
		else{
			cashFlowCoverageRatioScore=cashFlowCoverageRatio
		}
	}
	var reuturnCashFlowCoverageRatio={
		score:cashFlowCoverageRatioScore,
		data:cashFlowCoverageRatio,
		name:"Cash Flow Coverage Ratio"
	}
	return reuturnCashFlowCoverageRatio
}


function getShortRatio(result){
	var shortInterestRatio=result.shortRatio;
	var shortInterestRatioScore;
	if (shortInterestRatio>5){
		shortInterestRatioScore=0
	}
	else if (shortInterestRatio<0){
		shortInterestRatioScore=5
	}
	else {
		shortInterestRatioScore=5-(shortInterestRatio-1)
	}
	var returnShortInterestRatio={
		data:shortInterestRatio,
		score:shortInterestRatioScore,
		name:"Short Interest Ratio"
	}
	return returnShortInterestRatio;
}

function calculateAttributeScore(data){
	
	var totalValueScore=0;
	var dataKey=Object.keys(data);
	var scoreList={}
	for (var b=0;b<dataKey.length;b++){
		var currentScore=Object.keys(data[dataKey[b]]);
		var currentAttributeScore=0;
		for (var a=0;a<currentScore.length;a++){
			totalValueScore+=parseFloat(data[dataKey[b]][currentScore[a]].score);
			currentAttributeScore+=parseFloat(data[dataKey[b]][currentScore[a]].score);
		}
		scoreList[dataKey[b]]=currentAttributeScore/currentScore.length;
	}
	data["scoreList"]=scoreList;
}

function getEpsGrowth(result){
	var quarter1=result.earnings[3].actualEPS;
	var quarter2=result.earnings[2].actualEPS;
	var quarter3=result.earnings[1].actualEPS;
	var quarter4=result.earnings[0].actualEPS;

	var increment1=(quarter3-quarter4)/quarter4;
	var increment2=(quarter2-quarter3)/quarter3;
	var increment3=(quarter1-quarter2)/quarter2;

	var epsGrowth=(increment1+increment2+increment3)/3*100
	var epsGrowthScore;

	if (epsGrowth>20){
		epsGrowthScore=5
	}
	else if(epsGrowth<0){
		epsGrowthScore=0
	}
	else{
		epsGrowthScore=epsGrowth/4
	}
	if (epsGrowth==Infinity){
		epsGrowth=0;
	}
	var returnEpsGrowth={
		data:epsGrowth,
		score:epsGrowthScore,
		name:"EPS growth rate"
	}
	return returnEpsGrowth
}

function getAllAttribute(ticker){
	var data={};
	var valueScores={};
	var growthScores={};
	var liquidityScores={};
	var trendsScore={};
	var profitabilityScores={};
	var companyProfile={}
	getAjax("https://api.iextrading.com/1.0/stock/"+ticker+"/company",function(result){
		companyProfile["ticker"]=result.symbol;
		companyProfile["name"]=result.companyName;
		companyProfile["description"]=result.description;
		companyProfile["sector"]=result.sector;
		getAjax("https://api.iextrading.com/1.0/stock/"+ticker+"/financials",function(result){
			profitabilityScores["roeScore"]=getROE(result);
			liquidityScores["laScore"]=getLA(result);
			growthScores["increaseRateOfRevenueScore"]=getIncreaseRateOfRevenue(result);
			liquidityScores["cashFlowCoverageRatioScore"]=getCashFlowCoverageRatio(result)
			//getProfitMargin(result);
			//getCurrentRatio(result);
			//getQuickRatio(result);
			growthScores["netProfitGrowthScore"]=getNetProfitGrowth(result);

			getAjax("https://api.iextrading.com/1.0/stock/"+ticker+"/stats",function(result){
				profitabilityScores["roaScore"]=getROA(result);
				trendsScore["shortInterestRatio"]=getShortRatio(result);
				valueScores["pbScore"]=getPB(result);

				getAjax("https://api.iextrading.com/1.0/stock/"+ticker+"/earnings",function(result){
					//getEPS(result);
					growthScores["epsGrowthScore"]=getEpsGrowth(result);

					getAjax("https://api.iextrading.com/1.0/stock/"+ticker+"/quote",function(result){
						valueScores["peScore"]=getPE(result);
						data["valueScores"]=valueScores;
						data["growthScores"]=growthScores;
						data["liquidityScores"]=liquidityScores;
						data["trendsScore"]=trendsScore;
						data["profitabilityScores"]=profitabilityScores;
						data["companyProfile"]=companyProfile;
						calculateAttributeScore(data);

						getAjax("https://api.iextrading.com/1.0/stock/"+ticker+"/logo",function(result){
							data["logo"]=result.url;
							console.log(data);
						},function(message){
							console.error(message)
						})
					},function(message){
						console.error(message)
					});

				},function(message){
					console.log(message)
				});

			},function(message){
				console.log(message)
			});
		},function(message){
			console.log(message)
		})	
	},function(message){
		console.log(message)
	})
	
}