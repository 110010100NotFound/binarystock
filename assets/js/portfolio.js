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

    var ctx = $("#myChart")[0].getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            datasets: [{
                data: [100],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ]
            }],
            labels: ['']
        },
        options:{}
    });

    $(document).on('optimizePortfolio', function(e,data){
        console.log(data);
        var colors=[];
        var value;

        var labels = portfolio.map(function(o,i){
            colors.push(getRandomColor());
            data.investAmount[i] = data.investAmount[i].toFixed(2);
            return o.name+"\n"+(data.weightage[i]*100).toPrecision(2)+"%";
        });
        myChart.data.datasets[0].data = data.investAmount;
        myChart.data.datasets[0].backgroundColor = colors;
        myChart.data.labels = labels;
        myChart.update();

        $('#risk-item').text( (data["risk"]*100).toFixed(2) +" %");
        $('#return-item').text( (data["return"]*100).toFixed(2) +" %");
        $('#sharpe-item').text( data["sharpeRatio"].toFixed(2));
        $('.loader').fadeOut();
    });

});

var portfolio =[];

function removePortfolio(index) {
    portfolio.splice(index, 1);
    window.location.reload();
    cookie.set("@binaryStock/Portfolio", 
        JSON.stringify(portfolio));
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }