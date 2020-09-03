const statePaths = document.getElementsByTagName("path"); // gets ALL the path tags, which are the states in the interative map
const posIncreaseArr = []; // gets populated with the increase in positive test cases from the day before
var dateTime = new Date();
document.getElementById("date-time").innerHTML = dateTime.toLocaleString();

//populates posIncreaseArr with -Positive Test Increases from previous day-... added in the order that the path array was added
axios
  .get(`https://api.covidtracking.com/v1/states/current.json`) //gets the dataset from the covid website that lists the current day statistics for all 50 states
  .then((response) => {
    for (i = 0; i < statePaths.length; i++) {
      //iterates over all the states in the interative map
      let pathID = statePaths[i].getAttribute("id"); //for each iteration, it finds the ID for that particular path
      for (j = 0; j < response.data.length; j++) {
        //iterates over the dataset
        if (response.data[j].state == pathID) {
          //if the iterated dataset's state name matches the path ID...
          posIncreaseArr.push(response.data[j].positiveIncrease); //then we add the postitive [test] increase stat to the array
          break; //breaks out of the current for loop after we find the match
        }
      }
    }
    for (i = 0; i < statePaths.length; i++) {
    // after the posIncreaseArr gets populated... we iterate over the path again to change the fill color for each state
    //a bit redundant, we could have put it in the loop above, but this way we can scale values later if we choose to [for example 0-100% opacity of 1 color]
      let color = "#1d4877";
      if (posIncreaseArr[i] < 500) {
        color = "#1b8a5a";
      }
      if (posIncreaseArr[i] >= 500 && posIncreaseArr[i] < 1000) {
        color = "#fbb021";
      }
      if (posIncreaseArr[i] >= 1000 && posIncreaseArr[i] < 3000) {
        color = "#f68838";
      }
      if (posIncreaseArr[i] >= 3000) {
        color = "#ee3e32";
      }
      statePaths[i].setAttribute("fill", color);
    }
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

let infoContainer = document.getElementById("display-head"); // element where all the search stuff will return to
let cardContainer = document.getElementById("display-cards");
let chartContainer = document.getElementById("display-graphs");

let stateBox = document.getElementById("state"); //element with the state's entry
let timeBoxs = document.getElementsByName("radio-button-time"); // element with the time frame's entry

//~~~~~~~~~~~~~~~ FUNCTIONS ~~~~~~~~~~~~~~~~~~~
//these two functions are called by their respective action listers toward the bottom of the page... in case we want to add validation or other stuff
let searchValidateMap = (state) => {
  searchValidate(state);
};

let searchValidateButton = () => {
  let state = stateBox.value; //takes the value in the search box after you click search
  searchValidate(state);
};

//both action listeners feed to this main function, passing in the state being searched
let searchValidate = (state) => {
  let timeFrame = "bleh"; //initialize the variable for the timeframe we're searching for
  for (let i = 0; i < timeBoxs.length; i++) {
    //checks the radio buttons for the timeframe we will be searching for [0-day,1-week,2-month]
    if (timeBoxs[i].checked) {
      timeFrame = timeBoxs[i].value;
      break;
    }
  }
  infoContainer.innerHTML = ""; //clear the containers for a fresh search
  cardContainer.innerHTML = "";
  chartContainer.innerHTML = "";
  axios
    .get("https://api.covidtracking.com/v1/states/info.json") //first axios get for the states metainfo pages
    .then((response) => {
      let stateIndex = "State not found!"; //initialize the state variable, will never remain this string
      if (state.length != 2) {
        //if the passed state is in the 2 letter shortened format (from clicking the map, or typing in 2 letters)... check if it's a valid state in the dataset
        stateIndex = response.data.findIndex(
          (ele) => ele.name.toLowerCase() === state.toLowerCase()
        );
      } else {
        //if the passed state isn't 2 letters (from typing in the search bar)... check if it's a valid state in the dataset
        stateIndex = response.data.findIndex(
          (ele) => ele.state.toUpperCase() === state.toUpperCase()
        );
      }
      //finds the state object using the index of the state we're searching for
      let stateInfo = response.data[stateIndex];

      let stateHeader = document.createElement("div"); //creates a div and header
      let header = document.createElement("h1");
      header.style.textAlign = "center";

      if (stateIndex === -1) {
        //if the findIndex function doesn't find a state, it returns -1... show message and end function
        header.innerHTML = "No State Found!";
        infoContainer.appendChild(header);
      } else {
        //if the findIndex function finds the state...
        let stateLetters = stateInfo.state; //set up the state letters variable we'll be passing to add the cards for the state
        header.innerHTML = stateInfo.name; //make the header the name of the state
        let notes = document.createElement("p"); //create a paragraph to add to the div
        //add the notes from the dataset's state metadata information and a link to their official state cvd-19 site
        notes.innerHTML = `${stateInfo.notes} <br> 
        State Covid-19 Information site: ${stateInfo.covid19Site} `;
        stateHeader.appendChild(header); // add them all to the index.html site
        stateHeader.appendChild(notes);
        infoContainer.appendChild(stateHeader);
        timeValidate(stateLetters, timeFrame); //proceed to time validation depending on the state and the timeframe
      }
    });
};

let timeValidate = (letters, time) => {
  axios
    .get(`https://api.covidtracking.com/v1/states/${letters}/daily.json`) //get call for the state passed in the parameters
    .then((response) => {
      //pass different numbers depending on the timeframe
      if (time == 0) {
        //if the time == 0 [daily], pass just the first element
        addCard([response.data[0]]);
      } else if (time == 1) {
        //if the time == 1 [weekly], pass the first 7 elements
        addCard(response.data.slice(0, 7));
      } else if (time == 2) {
        //if the time == 2 [monthly], pass every 4th day for 8 elements
        let monthlyCardDays = [];
        for (let i = 0; i < 33; i += 4) {
          monthlyCardDays.push(response.data[i]);
        }
        addCard(monthlyCardDays);
      }
    });
};

let addCard = (data) => {
  //chart stuff~~~~~~~~ initializing arrays to populate from loops below
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
    // depending on the size of the array that got passed... gets the information for EACH day
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
    // used unshift so that the displayed information will be chronologically increasing from left to right (used flex row reverse)
    //this is because the data we get is in an array with the current day being index 0, and each previous day is a higher index
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

    //~~~~~~~ standard card creation stuff, create elements and append

    let card = document.createElement("div");
    card.setAttribute("class", "card");
    card.style.width = "20%";

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

    let delBtn = document.createElement("button");
    delBtn.setAttribute("class", "btn btn-danger");
    delBtn.setAttribute("type", "button");
    delBtn.innerHTML = "Delete";
    delBtn.addEventListener("click", deleteCard);

    card.appendChild(delBtn);

    cardContainer.appendChild(card);
  }

  //~~~~~~~~~~~ chris chart stuff
  Chart.defaults.global.defaultFontSize = 18;

  let canvas1 = document.createElement("canvas");
  canvas1.setAttribute("id", "ventHospitalDeaths");
  canvas1.setAttribute("width", "800");
  canvas1.setAttribute("height", "800");

  let canvas2 = document.createElement("canvas");
  canvas2.setAttribute("id", "increaseChart");
  canvas2.setAttribute("width", "800");
  canvas2.setAttribute("height", "800");

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
  chartContainer.appendChild(canvas1);
  chartContainer.appendChild(canvas2);
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ end charts

  document.getElementById("search-bar-container").reset(); //resets the search form
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
