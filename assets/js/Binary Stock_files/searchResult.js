$(document).ready(function(){
    var query = querystring.parse();
    console.log(query);

    getAllAttribute("googl");

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
        console.log(scoresList);
        myChart.update();
    });

    var myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ["Growth", "Liquidity", "Profitability", "Trend", "Value"],
            datasets: [{
                label: 'Scores',
                data: [0,0,0,0,0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

});
