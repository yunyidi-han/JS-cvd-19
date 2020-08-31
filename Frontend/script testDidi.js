// ~~~~~~~~~~~~~~~~~~~~ Varibles to change ~~~~~~~~~~~~~~~

let searchButton = document.getElementById("search"); //button for the action lisenter
// let timeButton = document.getElementById("CHANGE");
// let heatMapButton = document.getElementById("CHANGE");
let infoContainer = document.getElementById("display-charts"); // element where all the search stuff will return to
let cardContainer = document.getElementById("display-cards");

let stateBox = document.getElementById("state"); //element with the state's entry
let timeBox = document.getElementById("time"); // element with the time frame's entry

let searchValidate = () => {
  let state = stateBox.value; //takes the value in the search box after you click search
  let timeFrame = timeBox.value;
  infoContainer.innerHTML = ""; //clear the container
  console.log(state);
  axios
    .get("https://api.covidtracking.com/v1/states/info.json")
    .then((response) => {
      console.log(response);
      //standard axios promise
      let stateIndex = response.data.findIndex((ele) => ele.name === state); //finds the index of the object that contains the state we're searching for
      let stateInfo = response.data[stateIndex];
      let stateLetters = stateInfo.state;

      //notes = snippet about state
      //maybe twitter as well?
      let stateHeader = document.createElement("div");
      let header = document.createElement("h1");
      header.innerHTML = state;
      stateHeader.appendChild(header);
      let notes = document.createElement("p");
      notes.innerHTML = stateInfo.notes;
      stateHeader.appendChild(notes);
      infoContainer.appendChild(stateHeader);
      // some other stuff here

      searchState(stateLetters, timeFrame);
    });
};

let searchState = (letters, time) => {
  axios
    .get(`https://api.covidtracking.com/v1/states/${letters}/daily.json`)
    .then((response) => {
      console.log(response);
      //standard axios promise

      if (time === "day") {
        addCard([response.data[0]]);
      } // pass an ARRAY of just 1 element to create the initial info card

      //pass different numbers depending on the timeframe
      if (time === "week") {
        addCard(response.data.slice(0, 7));
      } else if (time === "month") {
        //addCard([response.data.splice()]);
      }

      //for current stat of day
    });
};

let addCard = (data) => {
  cardContainer.innerHTML = "";
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

  // document.getElementById("GImmie a form id man").reset();
};

let editCard = (e) => {
  //maybe do something like ask for date later
};

let deleteCard = (e) => {
  e.target.parentElement.remove();
};

searchButton.addEventListener("click", searchValidate);
