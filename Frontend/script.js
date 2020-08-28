let addButton = document.getElementById("addButton");
let searchButton = document.getElementById("searchButton");
let movieContainer = document.getElementById("titles");
// let getResponse = (subject) => {
//   axios
//     .get("http://omdbapi.com/?apikey=168a6a83&s=" + subject)
//     .then((response) => {
//       return response.data.Search;
//     });
// };
addButton.addEventListener("click", () => {
  let id = document.getElementById("movieID").value;
  let title = document.getElementById("movieTitle").value;
  let actor = document.getElementById("movieActor").value;
  let year = document.getElementById("movieYear").value;
  let poster = document.getElementById("moviePoster").value;

  if (poster == undefined)
    poster =
      "https://betravingknows.com/wp-content/uploads/2017/06/video-movie-placeholder-image-grey.png";

  axios
    .post(
      `http://localhost:3000/add?id=${id}&title=${title}&actor=${actor}&year=${year}&poster=${poster}`
    )
    .then((response) => {
      console.log(response);
      addCard([response.data]);
    });
});

searchButton.addEventListener("click", () => {
  axios.get("http://localhost:3000/movies").then((response) => {
    console.log(response);
    addCard(response.data);
  });
});

let addCard = (response) => {
  movieContainer.innerHTML = "";
  for (let i = 0; i < response.length; i++) {
    // cardID++;
    let { id } = response[i];
    let title = response[i].title;
    let actor = response[i].actor;
    let year = response[i].year;
    let poster = response[i].poster;

    let card = document.createElement("div");
    card.setAttribute("class", "card");

    let img = document.createElement("img");
    img.setAttribute("alt", "Image of: " + title);
    if (poster != "") {
      img.setAttribute("src", poster);
    } else {
      img.setAttribute(
        "src",
        "https://betravingknows.com/wp-content/uploads/2017/06/video-movie-placeholder-image-grey.png"
      );
    }

    img.setAttribute("class", "card-img-top");

    card.appendChild(img);

    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    let header = document.createElement("h4");
    header.setAttribute("class", "card-title");
    header.innerHTML = id + ". " + title;
    let header2 = document.createElement("h5");
    header2.setAttribute("class", "card-subtitle mb-2 text-muted");
    header2.innerHTML = year;
    let cardPara = document.createElement("p");
    cardPara.setAttribute("class", "card-text");
    cardPara.innerHTML = actor;

    cardBody.appendChild(header);
    cardBody.appendChild(document.createElement("hr"));
    cardBody.appendChild(header2);
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
    // delBtn.setAttribute("id", card + cardID);
    delBtn.innerHTML = "Delete";
    delBtn.addEventListener("click", deleteCard);

    card.appendChild(editBtn);
    card.appendChild(delBtn);

    movieContainer.appendChild(card);
  }

  document.getElementById("addMovie").reset();
};
var ctx = document.getElementById('myChart');
var ctx = document.getElementById('myChart').getContext('2d');
var ctx = $('#myChart');
var ctx = 'myChart';
// let validate = () => {
//   let keyword = document.getElementById("titleSearch").value;
//   if (keyword == "") {
//     alert("Please enter a title!");
//   } else {
//     movieContainer.innerHTML = "";
//     axios
//       .get("http://omdbapi.com/?apikey=168a6a83&s=" + keyword)
//       .then((resp) => {
//         let response = resp.data.Search;
//         if (response == undefined) {
//           let noResult = document.createElement("h1");
//           noResult.innerHTML = "No Search Results!";
//           movieContainer.appendChild(noResult);
//           document.getElementById("sumbitSearch").reset();
//         } else {
//           addCard(response);
//         }
//       });
//   }
// };

let editCard = (e) => {
  let card = e.target.parentElement;
  let movID = prompt("Enter a new movie ID");
  let movTitle = prompt("Enter a new movie title");
  let movActor = prompt("Enter a new movie actor");
  let movYear = prompt("Enter a new movie year");
  let movUrl = prompt("Enter a new URL for the image");

  let id = card.children[1].children[0].innerHTML.substring(0, 1);
  let title = card.children[1].children[0].innerHTML.substring(
    2,
    card.children[1].children[0].innerHTML.length - 1
  );
  let actor = card.children[1].children[2].innerHTML;
  let year = card.children[1].children[3].innerHTML;
  let url = card.children[0].getAttribute("src");

  if (movID.length > 0) {
    id = movID;
    card.children[1].children[0].innerHTML.substring(0, 1) = id;
  }
  if (movTitle.length > 0) {
    title = movTitle;
    card.children[1].children[0].innerHTML = movTitle;
  }
  if (movActor.length > 0) {
    card.children[1].children[2].innerHTML = movActor;
  }
  if (movYear.length > 0) {
    card.children[1].children[3].innerHTML = movieYear;
  }
  if (movUrl.length > 0) {
    url = movUrl;
    card.children[0].setAttribute("src", movUrl);
  }

  // axios.put(`http://localhost:3000/edit?id=${header}`).then((response) => {
  //   console.log(response);
  // }); too lazy to do this, but its easy
};

let deleteCard = (e) => {
  let header = e.target.parentElement.children[1].children[0].innerHTML.substring(
    0,
    1
  );

  console.log(header);
  axios.delete(`http://localhost:3000/delete?id=${header}`).then((response) => {
    console.log(response);
  });
  e.target.parentElement.remove();
};

// document.getElementsByClassName(btn).addEventListener("click", deleteCard);
//where to put this?
console.log('hello');
// searchButton.addEventListener("click", validate);
