$(document).ready(function(){
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
            return ("<span>"+data.growthScores[keys].name+" : "+parseFloat(data.growthScores[keys].score).toPrecision(3)+"</span>");
        })
        el.unshift("<span>Average : "+scoresList[0].toPrecision(3)+"</span");
        $("#growth-item").after(el);

        el = Object.keys(data.liquidityScores).map(function(keys){
            return ("<span>"+data.liquidityScores[keys].name+" : "+parseFloat(data.liquidityScores[keys].score).toPrecision(3)+"</span>");
        })
        el.unshift("<span>Average : "+scoresList[1].toPrecision(3)+"</span");
        $("#liquidity-item").after(el);

        el = Object.keys(data.profitabilityScores).map(function(keys){
            return ("<span>"+data.profitabilityScores[keys].name+" : "+parseFloat(data.profitabilityScores[keys].score).toPrecision(3)+"</span>");
        })
        el.unshift("<span>Average : "+scoresList[2].toPrecision(3)+"</span");
        $("#profitability-item").after(el);

        el = Object.keys(data.trendsScore).map(function(keys){
            return ("<span>"+data.trendsScore[keys].name+" : "+parseFloat(data.trendsScore[keys].score).toPrecision(3)+"</span>");
        })
        el.unshift("<span>Average : "+scoresList[3].toPrecision(3)+"</span");
        $("#trend-item").after(el);

        el = Object.keys(data.valueScores).map(function(keys){
            return ("<span>"+data.valueScores[keys].name+" : "+parseFloat(data.valueScores[keys].score).toPrecision(3)+"</span>");
        })
        el.unshift("<span>Average : "+scoresList[4].toPrecision(3)+"</span");
        $("#value-item").after(el);
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

});
