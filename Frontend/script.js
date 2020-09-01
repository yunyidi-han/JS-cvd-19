const symptomsTab = document.getElementById("symptoms");
const stopSpread = document.getElementById("stop-spread");
const coughimage = document.getElementById("cough-image");
const lightBreathImage = document.getElementById("light-breath-image");
const lightFeverImage = document.getElementById("light-fever-image");
const wearMaskImage = document.getElementById("wear-mask-image");

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
  infoContainer.innerHTML = ""; //clear the container
  cardContainer.innerHTML = "";
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
    let { deathConfirmed } = data[i];

    let card = document.createElement("div");
    card.setAttribute("class", "card");
    card.style.maxWidth = "20%";

    // let img = document.createElement("img");
    // img.setAttribute("alt", "Image of: " + title);
    // if (poster != "") {
    //   img.setAttribute("src", poster);
    // } else {
    //   img.setAttribute(
    //     "src",
    //     "https://betravingknows.com/wp-content/uploads/2017/06/video-movie-placeholder-image-grey.png"
    //   );
    // }

    // img.setAttribute("class", "card-img-top");

    // card.appendChild(img);

    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    let header = document.createElement("h4");
    header.setAttribute("class", "card-title");
    header.style.textAlign = "center";
    header.innerHTML = date.toDateString();
    // let header2 = document.createElement("h5");
    // header2.setAttribute("class", "card-subtitle mb-2 text-muted");
    // header2.innerHTML = year;
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
    Deaths Total: ${deathConfirmed}
    `;

    cardBody.appendChild(header);
    cardBody.appendChild(document.createElement("hr"));
    // cardBody.appendChild(header2);
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

  document.getElementById("searchForm").reset();
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
