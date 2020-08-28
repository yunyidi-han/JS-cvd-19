// STEP 1: REQUIRE THE PACKAGE
const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

// Creates us a server. DEAF
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
// parse application/json
app.use(bodyParser.json());

let movies = [
  {
    id: 1,
    title: "Training Day",
    actor: "Nelly",
    year: "2002",
    poster:
      "https://upload.wikimedia.org/wikipedia/en/b/b3/Training_Day_Poster.jpg",
  },
  {
    id: 2,
    title: "The Mermaid",
    actor: "Subash",
    year: "2020",
    poster: "https://images4.penguinrandomhouse.com/cover/9781506715629",
  },
  {
    id: 3,
    title: "Dark Knight",
    actor: "Nelly",
    year: "2000",
    poster:
      "https://images-na.ssl-images-amazon.com/images/I/51kUEdD-gHL._SY445_.jpg",
  },
  {
    id: 4,
    title: "Lion King",
    actor: "Subash",
    year: "1995",
    poster:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTrd_UcBYIFxPbu8qFrTmTfGsYNmKtYJsnbCTZ8WZbEDB0tSYcW",
  },
  {
    id: 5,
    title: "Gilmore Girls",
    actor: "Subash",
    year: "1998",
    poster:
      "https://m.media-amazon.com/images/M/MV5BODM1OTk4MDY2M15BMl5BanBnXkFtZTgwOTEwNzczMDI@._V1_.jpg",
  },
];

// expects the following query parameters
// actor and year localhost:3000 => /movies
app.get("/movies", (req, res) => {
  res.send(movies);
});

// app.post("/movies", (req, res) => {
//   res.send("Post route hit");
// });

// ROUTE / = params
//app.post("/add/:movvie/differ/:fqsfsfr"
app.post("/add/:id/:title/:actor/:year/:poster", (req, res) => {
  const { id } = req.params;
  const title = req.params.title;
  const actor = req.params.actor;
  const year = req.params.year;
  const { poster } = req.params;
  const movie = {
    id: id,
    title: title,
    actor: actor,
    year: year,
    poster: poster,
  };
  movies.push(movie);
  console.log(movie);
  res.send(movie);
});

// ?title=creed & actor=subash & year=2000                  = query
app.post("/add", (req, res) => {
  const { id } = req.query;
  const title = req.query.title;
  const actor = req.query.actor;
  const year = req.query.year;
  let { poster } = req.query;

  if (
    id === undefined ||
    title === undefined ||
    actor === undefined ||
    year === undefined
  ) {
    return res
      .status(400)
      .send("Bad request, please input a movie ID, Title, Actor, and Year");
  }

  if (poster == undefined)
    poster =
      "https://m.media-amazon.com/images/M/MV5BODM1OTk4MDY2M15BMl5BanBnXkFtZTgwOTEwNzczMDI@._V1_.jpg";

  movies.push({
    id: id,
    title: title,
    actor: actor,
    year: year,
    poster: poster,
  });
  res.send({
    id: id,
    title: title,
    actor: actor,
    year: year,
    poster: poster,
  });
});

//localhost:3000/addbody
app.post("/addBody", (req, res) => {
  const { id } = req.body;
  const title = req.body.title;
  const actor = req.body.actor;
  const year = req.body.year;

  if (
    id === undefined ||
    title === undefined ||
    actor === undefined ||
    year === undefined
  ) {
    return res
      .status(400)
      .send("Bad request, please input a movie Title, Actor, and Year");
  }

  movies.push({ id: id, title: title, actor: actor, year: year });
  res.send("body executed");
});

app.put("/edit", (req, res) => {
  const { id } = req.query;
  const title = req.query.title;
  const actor = req.query.actor;
  const year = req.query.year;
  const { poster } = req.query;
  let index = movies.indexOf((ele) => ele.movie === id);

  movies.splice(index, 1, {
    id: id,
    title: title,
    actor: actor,
    year: year,
    poster: poster,
  });
  return res.status(200).send("Edited ID: " + id);
});

app.delete("/delete", (req, res) => {
  const { id } = req.query;
  movies.splice(
    movies.findIndex((ele) => ele.id == id),
    1
  );
  return res.status(200).send("Deleted ID: " + id);
});

app.post("/movies", (req, res) => {
  console.log(req.body);
  res.send("done");
});

// Make the server listen on a port (connection)
app.listen(3000);
