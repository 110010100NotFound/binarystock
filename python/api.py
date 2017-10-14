
from bottle import run,get,post,request,response
import requests
import pandas as pd
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import scipy.optimize as sco




@post ("/portfolioOptimization")

def portfolioOptimization():
	def statistics(weights):
	    weights = np.array(weights)
	    port_returns = np.sum(returns.mean()*weights)*252
	    port_variance = np.sqrt(np.dot(weights.T, np.dot(returns.cov()*252,weights)))
	    return np.array([port_returns, port_variance, port_returns/port_variance])

	def min_sharpe(weights):
	    return -statistics(weights)[2]

	response.headers['Content-Type'] = 'application/json'
	tickers=request.json.get("portfolio")
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
	for p in range(400):
	    weights = np.random.random(noa)
	    weights /=np.sum(weights)
	    port_returns.append(np.sum(returns.mean()*252*weights))
	    port_variance.append(np.sqrt(np.dot(weights.T, np.dot(returns.cov()*252, weights))))

	port_returns = np.array(port_returns)
	port_variance = np.array(port_variance)

	#expected risk_free = 0.04
	plt.figure(figsize = (8,4))
	plt.scatter(port_variance, port_returns, c=(port_returns-0.04)/port_variance, marker = 'o')
	plt.grid(True)
	plt.xlabel('expected volatility')
	plt.ylabel('expected return')
	plt.colorbar(label = 'Sharpe ratio')

	cons = ({'type':'eq', 'fun':lambda x: np.sum(x)-1})
	bnds = tuple((0,1) for x in range(noa))
	opts = sco.minimize(min_sharpe, noa*[1./noa,], method = 'SLSQP', bounds = bnds, constraints = cons)
	
	highestSharpeWeightRatio={}
	for i in range(len(tickers)):
		highestSharpeWeightRatio[tickers[i]]=opts.x[i]

	return (highestSharpeWeightRatio)

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
