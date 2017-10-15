$(document).ready(function(){
    var el = tickerList.map(function(o){
        return("<option value='"+o+"'>"+o+"</option>")
    })
    $("#search-data").append(el);

    $("#search-bar").on("change",function(){
        $("#search-btn").attr("href", "/searchResult.html?ticker="+$("#search-bar").val());
    });
    
    try
    {
        portfolio = JSON.parse(cookie.get("@binaryStock/Portfolio"));
        console.log(portfolio);
        var el = portfolio.map(function(o,i){
            return("<li class='list-li'>\
                <img src='"+o.logo+"' />\
                <label onClick='removePortfolio("+i+")' class='list-remove'> X </label>\
                <h3 class='listHead'>"+o.name+"</h3>\
                <p>"+o.description+"</p>\
            </li>");
        })
       $('#portfolio-list').append(el);

       var query = querystring.parse();
       if(typeof query["amount"] !== 'undefined' && typeof query["risk"] !== 'undefined'){
           var tickers = portfolio.map(function(o){
               return o.ticker;
           });
           //console.log(query);
           optimizePortfolio(tickers, parseFloat(query["amount"]), parseInt(query["risk"]) );
       }
    }
    catch(e)
    {
        cookie.set("@binaryStock/Portfolio", 
            JSON.stringify(portfolio));
    }

});

var portfolio =[];

function removePortfolio(index) {
    portfolio.splice(index, 1);
    window.location.reload();
    cookie.set("@binaryStock/Portfolio", 
        JSON.stringify(portfolio));
}