$(document).ready(function(){
    var el = tickerList.map(function(o){
        return("<option value='"+o+"'>"+o+"</option>")
    })
    $("#search-data").append(el);

    $("#search-bar").on("change",function(){
        $("#search-btn").attr("href", "/searchResult.html?ticker="+$("#search-bar").val());
    });
    
    var query = querystring.parse();
    console.log(query);

    if(typeof query["ticker"] !== 'undefined'){
        getAllAttribute(query["ticker"]);
    }

    var ctx = $("#myChart")[0].getContext('2d');
    

    $(document).on("getAllAttributes", function(e,data){
        console.log(data);
        var scoresList = [];
        scoresList[0] = data.scoreList["growthScores"];
        scoresList[1] = data.scoreList["liquidityScores"];
        scoresList[2] = data.scoreList["profitabilityScores"];
        scoresList[3] = data.scoreList["trendsScore"];
        scoresList[4] = data.scoreList["valueScores"];

        myChart.data.datasets[0].data = scoresList;
        myChart.update();

        var el = Object.keys(data.growthScores).map(function(keys){
            return ("<span>\
                <label class='counter-key'>"+data.growthScores[keys].name+" :</label>\
                <label class='counter-value'>"+parseFloat(data.growthScores[keys].score).toPrecision(3)+"</label>\
            </span>");
        })
        el.unshift("<span>\
            <label class='counter-key'>Average :</label>\
            <label class='counter-value'>"+scoresList[0].toPrecision(3)+"</label>\
        </span>");
        $("#growth-item").after(el);

        el = Object.keys(data.liquidityScores).map(function(keys){
            return ("<span>\
                <label class='counter-key'>"+data.liquidityScores[keys].name+" :</label>\
                <label class='counter-value'>"+parseFloat(data.liquidityScores[keys].score).toPrecision(3)+"</label>\
            </span>");
        })
        el.unshift("<span>\
            <label class='counter-key'>Average :</label>\
            <label class='counter-value'>"+scoresList[1].toPrecision(3)+"</label>\
        </span>");
        $("#liquidity-item").after(el);

        el = Object.keys(data.profitabilityScores).map(function(keys){
            return ("<span>\
                <label class='counter-key'>"+data.profitabilityScores[keys].name+" :</label>\
                <label class='counter-value'>"+parseFloat(data.profitabilityScores[keys].score).toPrecision(3)+"</label>\
            </span>");
        })
        el.unshift("<span>\
            <label class='counter-key'>Average :</label>\
            <label class='counter-value'>"+scoresList[2].toPrecision(3)+"</label>\
        </span>");
        $("#profitability-item").after(el);

        el = Object.keys(data.trendsScore).map(function(keys){
            return ("<span>\
                <label class='counter-key'>"+data.trendsScore[keys].name+" :</label>\
                <label class='counter-value'>"+parseFloat(data.trendsScore[keys].score).toPrecision(3)+"</label>\
            </span>");
        })
        el.unshift("<span>\
            <label class='counter-key'>Average :</label>\
            <label class='counter-value'>"+scoresList[3].toPrecision(3)+"</label>\
        </span>");
        $("#trend-item").after(el);

        el = Object.keys(data.valueScores).map(function(keys){
            return ("<span>\
                <label class='counter-key'>"+data.valueScores[keys].name+" :</label>\
                <label class='counter-value'>"+parseFloat(data.valueScores[keys].score).toPrecision(3)+"</label>\
            </span>");
        })
        el.unshift("<span>\
            <label class='counter-key'>Average :</label>\
            <label class='counter-value'>"+scoresList[0].toPrecision(4)+"</label>\
        </span>");
        $("#value-item").after(el);

        $(".searchResult-icon").attr("src", data["logo"]);

        $("#company-name").text(data.companyProfile["name"]);
        $("#company-desc").text(data.companyProfile["description"]);

        $(".loader").fadeOut();

        companyProfile = data.companyProfile;
    });

    var myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ["Growth", "Liquidity", "Profitability", "Trend", "Value"],
            datasets: [{
                label: 'Scores',
                data: [0,0,0,0,0]
            }]
        },
        options:{
            responsive:true,
            scale: {
                display: true,
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 5.0,
                    stepSize: 1.0
                }
            }
        }
    });

    $("#addPortfolio-btn").on('click', function(){
        try
        {
            var portfolio = JSON.parse(cookie.get("@binaryStock/Portfolio"));
            portfolio.unshift(companyProfile);
            cookie.set("@binaryStock/Portfolio", 
                JSON.stringify(portfolio));
            window.location.href="/portfolioList.html";
        }
        catch(e)
        {
            var portfolio = [];
            portfolio.unshift(companyProfile);
            cookie.set("@binaryStock/Portfolio", 
                JSON.stringify(portfolio));
            window.location.href="/portfolioList.html";
        }
    });

});

var companyProfile = {};