const symptomsTab = document.getElementById("symptoms");
const stopSpread = document.getElementById("stop-spread");
const coughimage = document.getElementById("cough-image");
const lightBreathImage = document.getElementById("light-breath-image");
const lightFeverImage = document.getElementById("light-fever-image");
const wearMaskImage = document.getElementById("wear-mask-image");

const statePaths = document.getElementsByTagName("path");
const posIncreaseArr = [];

//populates pos increaseArr with objects {state(2 letters): Positive Test Increases from previous day}
axios
  .get(`https://api.covidtracking.com/v1/states/current.json`)
  .then((response) => {
    for (i = 0; i < statePaths.length; i++) {
      let pathID = statePaths[i].getAttribute("id");
      for (j = 0; j < response.data.length; j++) {
        if (response.data[j].state == pathID) {
          posIncreaseArr.push(response.data[j].positiveIncrease);
          break;
        }
      }
    }
    for (i = 0; i < statePaths.length; i++) {
      let color = "black";
      if (posIncreaseArr[i] < 500) {
        color = "green";
      }
      if (posIncreaseArr[i] >= 500 && posIncreaseArr[i] < 1000) {
        color = "yellow";
      }
      if (posIncreaseArr[i] >= 1000 && posIncreaseArr[i] < 3000) {
        color = "brown";
      }
      if (posIncreaseArr[i] >= 3000) {
        color = "red";
      }
      statePaths[i].setAttribute("fill", color);
    }
  });

document.getElementById("HI").setAttribute("fill", "red");
//sets the color for the heatmap

symptomsTab.addEventListener("click", () => {
  coughimage.style.display = "block";
  lightBreathImage.style.display = "block";
  lightFeverImage.style.display = "block";
  wearMaskImage.style.display = "none";
});

stopSpread.addEventListener("click", () => {
  wearMaskImage.style.display = "block";
  coughimage.style.display = "none";
  lightBreathImage.style.display = "none";
  lightFeverImage.style.display = "none";
});

/*This portion of code is for the US map */
$("path, circle").hover(function (e) {
  $("#info-box").css("display", "block");
  $("#info-box").html($(this).data("info"));
});

$("path, circle").mouseleave(function (e) {
  $("#info-box").css("display", "none");
});

$(document)
  .mousemove(function (e) {
    $("#info-box").css("top", e.pageY - $("#info-box").height() - 30);
    $("#info-box").css("left", e.pageX - $("#info-box").width() / 2);
  })
  .mouseover();

var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (ios) {
  $("a").on("click touchend", function () {
    var link = $(this).attr("href");
    window.open(link, "_blank");
    return false;
  });
}

// ~~~~~~~~~~~~~~~~~~~~ DIDI'S CODE ~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~ Varibles to change ~~~~~~~~~~~~~~~

let searchButton = document.getElementById("search"); //button for the action lisenter
// let timeButton = document.getElementById("CHANGE");
// let heatMapButton = document.getElementById("CHANGE");
let infoContainer = document.getElementById("display-head"); // element where all the search stuff will return to
let cardContainer = document.getElementById("display-cards");
let chartContainer = document.getElementById("display-graphs");

let stateBox = document.getElementById("state"); //element with the state's entry
let timeBoxs = document.getElementsByName("radio-button-time"); // element with the time frame's entry

//~~~~~~~~~~~~~~~ FUNCTIONS ~~~~~~~~~~~~~~~~~~~
let searchValidateMap = (state) => {
  searchValidate(state);
};

let searchValidateButton = () => {
  let state = stateBox.value; //takes the value in the search box after you click search
  searchValidate(state);
};

let searchValidate = (state) => {
  let timeFrame = "bleh";
  for (let i = 0; i < timeBoxs.length; i++) {
    if (timeBoxs[i].checked) {
      timeFrame = timeBoxs[i].value;
      break;
    }
  }
  infoContainer.innerHTML = ""; //clear the containers
  cardContainer.innerHTML = "";
  chartContainer.innerHTML = "";
  axios
    .get("https://api.covidtracking.com/v1/states/info.json")
    .then((response) => {
      let stateIndex = "State not found!";
      if (state.length != 2) {
        stateIndex = response.data.findIndex(
          (ele) => ele.name.toLowerCase() === state.toLowerCase()
        );
      } else {
        stateIndex = response.data.findIndex(
          (ele) => ele.state.toUpperCase() === state.toUpperCase()
        );
      }
      //finds the index of the object that contains the state we're searching for
      let stateInfo = response.data[stateIndex];

      let stateHeader = document.createElement("div");
      let header = document.createElement("h1");
      header.style.textAlign = "center";

      if (stateIndex === -1) {
        header.innerHTML = "No State Found!";
        infoContainer.appendChild(header);
      } else {
        let stateLetters = stateInfo.state;
        header.innerHTML = stateInfo.name;
        let notes = document.createElement("p");
        notes.innerHTML = `${stateInfo.notes} <br>
        State Covid-19 Information site: ${stateInfo.covid19Site} `;
        stateHeader.appendChild(header);
        stateHeader.appendChild(notes);
        infoContainer.appendChild(stateHeader);
        searchState(stateLetters, timeFrame);
      }

      // some other stuff here
    });
};

let searchState = (letters, time) => {
  axios
    .get(`https://api.covidtracking.com/v1/states/${letters}/daily.json`)
    .then((response) => {
      console.log(response);
      //standard axios promise

      if (time == 0) {
        addCard([response.data[0]]);
      } // pass an ARRAY of just 1 element to create the initial info card

      //pass different numbers depending on the timeframe
      else if (time == 1) {
        addCard(response.data.slice(0, 7));
      } else if (time == 2) {
        //takes ever 4th day for the monthly display
        let monthlyCardDays = [];
        for (let i = 0; i < 33; i += 4) {
          monthlyCardDays.push(response.data[i]);
        }
        addCard(monthlyCardDays);
      }

      //for current stat of day
    });
};

let addCard = (data) => {
  //chart stuff~~~~~~~~
  let dateArr = [];
  let hosCurrArr = [];
  let hosTotalArr = [];
  let ventCurrArr = [];
  let ventTotalArr = [];
  let testPosTotalArr = [];
  let testNegTotalArr = [];
  let testedTotalArr = [];

  let postIncArr = [];
  let negIncArr = [];
  let totalTestIncArr = [];
  let deathsIncArr = [];
  let deathsTotalArr = [];

  //~~~~~~~~~~~~~~~~
  for (let i = 0; i < data.length; i++) {
    // cardID++;
    let date = data[i].date.toString();
    date = new Date(
      `${date.slice(4, 6)}/${date.slice(6, 8)}/${date.slice(0, 4)}`
    ); // change to date format
    let { hospitalizedCurrently } = data[i];
    let { hospitalizedCumulative } = data[i];
    let { onVentilatorCurrently } = data[i];
    let { onVentilatorCumulative } = data[i];
    let { positive } = data[i];
    let { negative } = data[i];
    let { totalTestResults } = data[i];
    let { positiveIncrease } = data[i];
    let { negativeIncrease } = data[i];
    let { deathIncrease } = data[i];
    let { death } = data[i];

    //~~~~~~~~~~ add data for each iteration to the dataset to build the chart
    dateArr.unshift(date.toDateString());

    hosCurrArr.unshift(hospitalizedCurrently);
    hosTotalArr.unshift(hospitalizedCumulative);

    ventCurrArr.unshift(onVentilatorCurrently);
    ventTotalArr.unshift(onVentilatorCumulative);

    testPosTotalArr.unshift(positive);
    testNegTotalArr.unshift(negative);
    testedTotalArr.unshift(totalTestResults);

    postIncArr.unshift(positiveIncrease);
    negIncArr.unshift(negativeIncrease);
    totalTestIncArr.unshift(positiveIncrease + negativeIncrease);

    deathsIncArr.unshift(deathIncrease);
    deathsTotalArr.unshift(death);

    //~~~~~~~

    let card = document.createElement("div");
    card.setAttribute("class", "card");
    card.style.maxWidth = "20%";

    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    let header = document.createElement("h4");
    header.setAttribute("class", "card-title");
    header.style.textAlign = "center";
    header.innerHTML = date.toDateString();

    let cardPara = document.createElement("p");
    cardPara.setAttribute("class", "card-text");
    cardPara.innerHTML = `Hospitalized Currently: ${hospitalizedCurrently} <br>
    Hospitalized Total: ${hospitalizedCumulative} <br> <hr> 
    On Ventilators Currently: ${onVentilatorCurrently} <br>
    On Ventilators Total: ${onVentilatorCumulative} <br> <hr> 
    Tested Positve Total: ${positive} <br>
    Tested Negative Total: ${negative} <br>
    Tested Total: ${totalTestResults} <hr>
    Tested Positive since the Day Before: ${positiveIncrease} <br>
    Tested Negative since the Day Before: ${negativeIncrease} <br> <hr> 
    Deaths since the day before: ${deathIncrease} <br>
    Deaths Total: ${death}
    `;

    cardBody.appendChild(header);
    cardBody.appendChild(document.createElement("hr"));
    cardBody.appendChild(cardPara);
    card.appendChild(cardBody);

    let editBtn = document.createElement("button");
    editBtn.setAttribute("class", "btn btn-primary");
    editBtn.setAttribute("type", "button");
    editBtn.innerHTML = "Edit";
    editBtn.addEventListener("click", editCard);

    let delBtn = document.createElement("button");
    delBtn.setAttribute("class", "btn btn-danger");
    delBtn.setAttribute("type", "button");
    delBtn.innerHTML = "Delete";
    delBtn.addEventListener("click", deleteCard);

    card.appendChild(editBtn);
    card.appendChild(delBtn);

    cardContainer.appendChild(card);
  }
  Chart.defaults.global.defaultFontSize = 18;

  let canvas1 = document.createElement("canvas");
  canvas1.setAttribute("id", "ventHospitalDeaths");
  canvas1.setAttribute("width", "800");
  canvas1.setAttribute("height", "800");

  let canvas2 = document.createElement("canvas");
  canvas2.setAttribute("id", "increaseChart");
  canvas2.setAttribute("width", "800");
  canvas2.setAttribute("height", "800");

  //~~~~~~~~~~~ chris chart stuff
  var ctx1 = canvas1;
  var ventHospitalDeaths = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: dateArr,

      datasets: [
        {
          label: "hospitalized currently",
          data: hosCurrArr,
          stack: "hos",
          backgroundColor: "rgba(255, 242, 0, 0.5)",
        },
        {
          label: "hospitalized total",
          data: hosTotalArr,
          stack: "hos",
          backgroundColor: "rgba(108, 122, 137, 1)",
        },
        {
          label: "on ventilator currently",
          data: ventCurrArr,
          stack: "vent",
          backgroundColor: "rgba(105, 242, 0, 0.5)",
        },
        // {
        //   label: "on ventilator total",
        //   data: ventTotalArr,
        //   stack: "vent",
        //   backgroundColor: "rgba(8, 162, 137, 1)",
        // },
        {
          label: "deaths since day before",
          data: deathsIncArr,
          stack: "death",
          backgroundColor: "rgba(205, 102, 0, 0.5)",
        },
        {
          label: "deaths total",
          data: deathsTotalArr,
          stack: "death",
          backgroundColor: "rgba(208, 122, 137, 1)",
        },
      ],
      borderWidth: 1,
    },

    options: {
      title: {
        display: true,
        fontStyle: "bold",
        fontFamily: "Helvetica Neue",
        text: "Hospital Statistics",
      },
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            type: 'logarithmic',
            stacked: false,
            ticks: {
              beginAtZero: true,
              autoSkip: true,
              callback: function (value, index, values) {
                if (value == 10 || value == 100 || value == 1000 || value == 10000 || value == 100000 || value == 1000000) {
                  return value;
                }
              }
            },
            scaleLabel: {
              display: true,

            }

          },
        ],
      },
    },
  });
  var ctx2 = canvas2.getContext("2d");
  var increaseChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: dateArr,
      datasets: [
        {
          label: "Positive Test Increase",
          backgroundColor: "rgba(255,100,30,1)",
          data: postIncArr,
        },
        {
          label: "Negative Test Increase",
          backgroundColor: "rgba(255,0,0,1)",
          data: negIncArr,
        },
        {
          label: "Total Test Increase",
          backgroundColor: "rgba(0,255,255,1)",
          data: totalTestIncArr,
        },
        {
          label: "Total Positive Tests",
          backgroundColor: "rgba(0, 323, 123, 2)",
          data: testPosTotalArr
        },
        {
          label: "Total Negative Tests",
          backgroundColor: "rgba( 238, 123, 382, 3)",
          data: testNegTotalArr
        }
      ],
    },
    options: {
      title: {
        display: true,
        fontStyle: "bold",
        fontFamily: "Helvetica Neue",
        text: "Covid19 Testing Statistics",
      },
      barValueSpacing: 20,
      scales: {
        yAxes: [
          {
            type: 'logarithmic',
            ticks: {
              beginAtZero: true,
              autoSkip: true,
              callback: function (value, index, values) {
                if (value == 10 || value == 100 || value == 1000 || value == 10000 || value == 100000 || value == 1000000) {
                  return value;
                }
              },
            },
          },
        ],
      },
    },
  });

  // var ctx3 = document.getElementById("pieChart").getContext("2d");
  // var pieChart = new Chart(ctx3, {
  //   type: "doughnut",
  //   data: {
  //     labels: ["On Ventilator Cumulative", "On Ventilator Currently"],
  //     datasets: [
  //       {
  //         labels: ["On Ventilator Cumulative", "On Ventilator Currently"],
  //         data: [2055, 1870],
  //         backgroundColor: [
  //           "rgba(255,99, 132, 0.6)",
  //           "rgba(54, 162, 235, 0.6)",
  //         ],
  //         borderWidth: 1,
  //       },
  //     ],
  //   },
  //   options: {
  //     title: {
  //       display: true,
  //       text: "Covid Cases on Ventilators",
  //       cutoutPercentage: 30,
  //     },
  //     legend: {
  //       display: true,
  //       position: "right",
  //     },
  //     layout: {
  //       tooltips: {
  //         enabled: true,
  //       },
  //     },
  //   },
  // });
  // var ctx4 = document.getElementById("pieChart2").getContext("2d");
  // var pieChart2 = new Chart(ctx4, {
  //   type: "pie",
  //   data: {
  //     labels: ["Hospitalized Cumulative", "Hospitalized Currently"],
  //     datasets: [
  //       {
  //         labels: ["Hospitalized Cumulative", "Hospitalized Currently"],
  //         data: [369564, 35726],
  //         backgroundColor: [
  //           "rgba(133,222, 125, 0.6)",
  //           "rgba(88, 192, 423, 0.6)",
  //         ],
  //         borderWidth: 1,
  //       },
  //     ],
  //   },
  //   options: {
  //     title: {
  //       display: true,
  //       text: "Covid Cases that are Hospitalized",
  //     },
  //     legend: {
  //       display: true,
  //       position: "right",
  //     },
  //     layout: {
  //       tooltips: {
  //         enabled: true,
  //       },
  //     },
  //   },
  // });

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ end charts
  chartContainer.appendChild(canvas1);
  chartContainer.appendChild(canvas2);

  document.getElementById("search-bar-container").reset();
};

let editCard = (e) => {
  //maybe do something like ask for date later
};

let deleteCard = (e) => {
  e.target.parentElement.remove();
};

//~~~~~~~ action listener for the search button
searchButton.addEventListener("click", searchValidateButton);

//~~~~~~~~~~ action listener for the interactive map
$("path, circle").click((e) => {
  let state = e.target.id; //gets the 2 letter state ID when clicking on the map
  searchValidateMap(state);
});
