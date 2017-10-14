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
        console.log(myChart);
        myChart.update();
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
