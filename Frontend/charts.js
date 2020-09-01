// var cors = require('cors')
// app.use(cors())
Chart.defaults.global.defaultFontSize = 18;

var ctx = document.getElementById('covidChart');
var covidChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['May', 'June', 'July', 'Aug'],

    datasets: [

      {
        label: 'deaths',
        data: [235892, 235899, 138939, 238993],
        backgroundColor: 'Teal'
      },
      {
        label: 'recovered',
        data: [532982, 892382, 783293, 623892],
        backgroundColor: 'Blue'
      }

    ],
    borderWidth: 1
  },

  options: {
    title: {
      display: true,
      fontStyle: 'bold',
      fontFamily: 'Helvetica Neue',
      text: 'Covid 19 Deaths'
    },
    scales: {
      xAxes: [{
        stacked: true
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});
var ctx2 = document.getElementById('increaseChart').getContext("2d");
var increaseChart = new Chart(ctx2, {
  type: 'bar',
  data: {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Positive Increase",
        backgroundColor: "Blue",
        data: [5023883, 3238482, 2398382, 4809328, 1838478, 1827382, 2938578]
      },
      {
        label: "Negative Increase",
        backgroundColor: "Red",
        data: [2382934, 2938488, 1838490, 2938581, 2834910, 2893874, 1288034]
      }
    ],
  },
  options: {
    title: {
      display: true,
      fontStyle: 'bold',
      fontFamily: 'Helvetica Neue',
      text: 'Daily Increase/Decrease in cases'
    },
    barValueSpacing: 20,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }

});

var ctx3 = document.getElementById('pieChart').getContext("2d");
var pieChart = new Chart(ctx3, {
  type: 'doughnut',
  data: {
    labels: ['On Ventilator Cumulative', 'On Ventilator Currently'],
    datasets: [{
      labels: ['On Ventilator Cumulative', 'On Ventilator Currently'],
      data: [2055, 1870],
      backgroundColor: ['rgba(255,99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
      borderWidth: 1
    }],
  },
  options: {
    title: {
      display: true,
      text: 'Covid Cases on Ventilators',
      cutoutPercentage: 30
    },
    legend: {
      display: true,
      position: 'right'
    },
    layout: {
      tooltips: {
        enabled: true
      }
    }
  }
});
var ctx4 = document.getElementById('pieChart2').getContext("2d");
var pieChart2 = new Chart(ctx4, {
  type: 'pie',
  data: {
    labels: ['Hospitalized Cumulative', 'Hospitalized Currently'],
    datasets: [{
      labels: ['Hospitalized Cumulative', 'Hospitalized Currently'],
      data: [369564, 35726],
      backgroundColor: ['rgba(133,222, 125, 0.6)', 'rgba(88, 192, 423, 0.6)'],
      borderWidth: 1
    }],
  },
  options: {
    title: {
      display: true,
      text: 'Covid Cases that are Hospitalized',

    },
    legend: {
      display: true,
      position: 'right'
    },
    layout: {
      tooltips: {
        enabled: true
      }
    }
  }
});

