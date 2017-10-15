function postAjax(url,data,onDone,onFail){
	$.ajax({
		url:url,
		data:JSON.stringify(data),
		success:onDone,
		error:onFail,
		method:"POST",
		headers: {"Content-Type": "application/json"}
	})
}

function optimizePortfolio(stockList,amount,riskPreference){
	var data={
		portfolio:stockList,
		riskPreference:parseInt(riskPreference),
		amount:amount
	}
	postAjax("http://localhost/portfolioOptimization",data,function(result){
		//console.log(result);
		$(document).trigger("optimizePortfolio",[data]);
	},function(message){
		console.error(message);
	});
}