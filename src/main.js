const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "api_key=184d641dafa5158fd46d5c8a7a9f37b7";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const searchURL = BASE_URL + "/search/movie?" + API_KEY + "&query=";

const loader = document.getElementById("loader");
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const submit = document.getElementById("submit");
const loading = document.getElementById("loading");
const modalBody = document.querySelector(".modal-body");
const navbar = document.querySelector(".navbar");

document.addEventListener("DOMContentLoaded", () => {
  firstLoad();
  window.onscroll = () => {
    scrollFunction();
  };
});

getMovies(API_URL);

function getMovies(url) {
  showLoad();
  fetch(url)
    .then((res) => res.json())
    .then((data) => MoviesSearchResult(data));
}

function MoviesSearchResult(data) {
  if (data.results.length !== 0) {
    showMovies(data.results);
    clearLoad();
  } else {
    main.innerHTML = `<div class="no-results">
                    <h1>The <span class="searchItem">${search.value}</span> You have Searched</h1>
                    <h2>No Results Found</h2>
                    <img class="sad-face" src="../dist/img/android-chrome-512x512.png" alt="Error" />
                  </div>`;
    clearLoad();
  }
}

document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-button")) {
    const tmdbid = e.target.dataset.tmdbid;
    const movieDetail = await getMovieDetail(tmdbid);
    updateUIDetail(movieDetail);
  }
});

function getMovieDetail(tmdbid) {
  return fetch(
    "https://api.themoviedb.org/3/movie/" +
      tmdbid +
      "?api_key=184d641dafa5158fd46d5c8a7a9f37b7"
  )
    .then((res) => res.json())
    .then((m) => m);
}

function updateUIDetail(m) {
  const movieDetail = showMoviesDetail(m);
  modalBody.innerHTML = movieDetail;
}

function showMovies(data) {
  main.innerHTML = "";

  clearLoad();

  data.forEach((movie) => {
    const { title, poster_path, vote_average, id } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
            <img src="${
              poster_path ? IMG_URL + poster_path : ""
            }" alt="${title}" id="target">
            <div class="movie-info" >
                      <h3>${title}</h3>
                      <span class="${getColor(vote_average)}">${vote_average
      .toString()
      .substring(0, 3)}</span>
            </div>
            <div class="btn-movie">
                <button class="btn btn-primary modal-detail-button" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-tmdbid="${id}">View More</button>
            </div> 
            `;
    main.appendChild(movieEl);
  });
}

function showMoviesDetail(m) {
  modalBody.innerHTML = "";

  const { release_date, poster_path, title, overview, genres, popularity } = m;

  return `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-3">
                        <img src="${
                          poster_path ? IMG_URL + poster_path : ""
                        }" class="img-fluid" alt="" />
                    </div>
                    <div class="col-md">
                        <ul class="list-group text-justify">
                            <li class="list-group-item list" aria-disabled="true">
                                <h4>${title}, Release in ${release_date.substring(
    0,
    4
  )}</h4>
                            </li>
                            <li class="list-group-item">
                                <strong>Genres  : </strong> ${genres.map(
                                  (i) => " " + i.name
                                )} 
                            </li >
                            <li class="list-group-item">
                                <strong>Realese date   :  </strong> ${release_date}
                            </li>
                            <li class="list-group-item"><strong>Popularity  : </strong>  ${popularity}</li>
                            <li class="list-group-item "><strong>Plot   : </strong> ${overview}</li>
                        </ul>
                    </div>
                </div>
            </div>
    `;
}

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  window.location.assign("#movie");

  if (searchTerm) {
    getMovies(searchURL + searchTerm);
  } else {
    getMovies(API_URL);
    clearLoad();
  }
});

function firstLoad() {
  setTimeout(() => {
    loader.setAttribute("style", "display: none");
  }, 1000);
}

function showLoad() {
  loading.setAttribute("style", "display: block");
  main.setAttribute("style", "display: none");
}

function clearLoad() {
  loading.setAttribute("style", "display: none");
  main.setAttribute("style", "display: flex");
}

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    navbar.setAttribute("style", "background-color: rgba(18, 18, 42)");
  } else {
    navbar.setAttribute(
      "style",
      "  background-color: rgba(18, 18, 42, 0.278);"
    );
  }
}
