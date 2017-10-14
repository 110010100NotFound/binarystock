from bottle import run, route, hook, request,response
import urllib.request
import requests
import pandas as pd
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import scipy.optimize as sco

@hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'



@route ("/portfolioOptimization", method=['OPTIONS', 'POST'])
def portfolioOptimization():
	if request.method == 'OPTIONS':
		return ()
	else:
		def statistics(weights):
			weights = np.array(weights)
			port_returns = np.sum(returns.mean()*weights)*252
			port_variance = np.sqrt(np.dot(weights.T, np.dot(returns.cov()*252,weights)))
			return np.array([port_returns, port_variance, port_returns/port_variance])

		def min_sharpe(weights):
			return -statistics(weights)[2]

		response.content_type  = 'application/json'
		tickers=request.json.get("portfolio")
		amount=request.json.get("amount")
		riskPreference=request.json.get("riskPreference")
		risk_free=0.04

		noa=len(tickers)
		dfData={};
		index=[];
		firstTime=0

		for ticker in tickers:
			result=requests.get("https://api.iextrading.com/1.0/stock/"+ticker+"/chart/1y").json()
			everydayClose=[]
			for everyday in result:
				everydayClose.append(everyday["close"])
				if firstTime==0:
					index.append(everyday["date"])
			firstTime+=1
			dfData[ticker]=everydayClose
		
		df=pd.DataFrame(index=index,data=dfData)

		returns=np.log(df/df.shift(1))

		port_returns = []
		port_variance = []
		port_sharpe=[]
		weight_list=[]
		for p in range(10000):
			weights = np.random.random(noa)
			weights /=np.sum(weights)
			returnVal=np.sum(returns.mean()*252*weights)
			variance=np.sqrt(np.dot(weights.T, np.dot(returns.cov()*252, weights)))
			weight_list.append(weights)
			port_returns.append(returnVal)
			port_variance.append(variance)
			port_sharpe.append((returnVal-risk_free)/variance)

		port_returns = np.array(port_returns)
		port_variance = np.array(port_variance)

		#expected risk_free = 0.04
		"""plt.figure(figsize = (8,4))
		plt.scatter(port_variance, port_returns, c=(port_returns-0.04)/port_variance, marker = 'o')
		plt.grid(True)
		plt.xlabel('expected volatility')
		plt.ylabel('expected return')
		plt.colorbar(label = 'Sharpe ratio')
		plt.plot(min(port_variance), port_returns[port_variance.tolist().index(min(port_variance))], 'b*', markersize = 15.0)
		plt.plot(port_variance[port_returns.tolist().index(max(port_returns))],max(port_returns), 'r*', markersize = 15.0)
		plt.plot(port_variance[port_sharpe.index(max(port_sharpe))],port_returns[port_sharpe.index(max(port_sharpe))], 'r+', markersize = 15.0)"""
		
		blackRockString=""
		returnData={}
		"""cons = ({'type':'eq', 'fun':lambda x: np.sum(x)-1})
		bnds = tuple((0,1) for x in range(noa))
		opts = sco.minimize(min_sharpe, noa*[1./noa,], method = 'SLSQP', bounds = bnds, constraints = cons)
		#print(weight_list[port_variance.tolist().index(min(port_variance))])
		#print(port_sharpe[port_variance.tolist().index(min(port_variance))])
		#max(port_sharpe)
		returnData={}
		for i in range(len(tickers)):
			returnData[tickers[i]]={
				"highestSharpeWeightRatio":opts.x[i]
			}"""

		# 0= min risk
		if riskPreference==0:
			for i in range(len(tickers)):
				blackRockString+=tickers[i]+"~"+str(weight_list[port_variance.tolist().index(min(port_variance))][i])+"|"
			blackrockResult=requests.get("https://www.blackrock.com/tools/hackathon/portfolio-analysis?calculateExposures=true&calculatePerformance=true&positions="+blackRockString).json()
			blackrockResult=blackrockResult["resultMap"]["PORTFOLIOS"][0]["portfolios"][0]["returns"]["latestPerf"]
			returnData["weightage"]=weight_list[port_variance.tolist().index(min(port_variance))].tolist()
			returnData["investAmount"]=(weight_list[port_variance.tolist().index(min(port_variance))]*amount).tolist()

		# 1= highest sharpe
		elif riskPreference==1:
			for i in range(len(tickers)):
				blackRockString+=tickers[i]+"~"+str(weight_list[port_sharpe.index(max(port_sharpe))][i])+"|"
			blackrockResult=requests.get("https://www.blackrock.com/tools/hackathon/portfolio-analysis?calculateExposures=true&calculatePerformance=true&positions="+blackRockString).json()
			blackrockResult=blackrockResult["resultMap"]["PORTFOLIOS"][0]["portfolios"][0]["returns"]["latestPerf"]
			returnData["weightage"]=weight_list[port_sharpe.index(max(port_sharpe))].tolist()
			returnData["investAmount"]=(weight_list[port_sharpe.index(max(port_sharpe))]*amount).tolist()

		#
		elif riskPreference==2:
			for i in range(len(tickers)):
				blackRockString+=tickers[i]+"~"+str(weight_list[port_returns.tolist().index(max(port_returns))][i])+"|"
			blackrockResult=requests.get("https://www.blackrock.com/tools/hackathon/portfolio-analysis?calculateExposures=true&calculatePerformance=true&positions="+blackRockString).json()
			blackrockResult=blackrockResult["resultMap"]["PORTFOLIOS"][0]["portfolios"][0]["returns"]["latestPerf"]
			returnData["weightage"]=weight_list[port_returns.tolist().index(max(port_returns))].tolist()
			returnData["investAmount"]=(weight_list[port_returns.tolist().index(max(port_returns))]*amount).tolist()

		returnData["return"]=blackrockResult["oneYearAnnualized"]
		returnData["risk"]=blackrockResult["oneYearRisk"]
		returnData["sharpeRatio"]=blackrockResult["oneYearSharpeRatio"]

		lowestRisk={}
		highestSharpe={}
		highestReturn={}

		lowestRisk["risk"]=min(port_variance)
		lowestRisk["sharpe"]=port_sharpe[port_variance.tolist().index(min(port_variance))]
		lowestRisk["return"]=port_returns[port_variance.tolist().index(min(port_variance))]

		highestSharpe["risk"]=port_variance[port_sharpe.index(max(port_sharpe))]
		highestSharpe["sharpe"]=max(port_sharpe)
		highestSharpe["return"]=port_returns[port_sharpe.index(max(port_sharpe))]

		highestReturn["risk"]=port_variance[port_returns.tolist().index(max(port_returns))]
		highestReturn["sharpe"]=port_sharpe[port_returns.tolist().index(max(port_returns))]
		highestReturn["return"]=max(port_returns)
		
		print(lowestRisk)
		print (highestSharpe)
		print (highestReturn)

		return (returnData)

run (host='0.0.0.0',reloader=True,debug=True,port=80)


"""portfolioPerformance=[]
	df=pd.DataFrame(inchartdex=portfolio)
	print (df)
	for ticker in portfolio:
		result=json.loads(urllib.request.urlopen("https://api.iextrading.com/1.0/stock/"+ticker+"/chart/1y").read())
		stockPerformance=[]

		for everyday in result:
			stockPerformance.append(everyday["close"])

		returns=np.log(pd.DataFrame(stockPerformance)/pd.DataFrame(stockPerformance).shift(1))

		#stockPerformanceArr=np.asarray(stockPerformance)
		#portfolioPerformance.append(stockPerformanceArr.mean()*252)

	return (json.dumps(portfolioPerformance))"""