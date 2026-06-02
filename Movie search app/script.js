const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

const API_KEY = "fc1fef96";
const BASE_URL = "https://www.omdbapi.com/";

async function loadMovies(searchTerm) {
    try {
        const res = await fetch(
        `${BASE_URL}?s=${searchTerm}&page=1&apikey=${API_KEY}`,
        );
        const data = await res.json();

        if (data.Response === "True") {
        displayMovieList(data.Search);
        } else {
        searchList.innerHTML = `<div class="search-list-item" style="cursor: default;">No movies found.</div>`;
        }
    } catch (error) {
        console.error("Error loading movies:", error);
    }
}

function findMovies() {
    let searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove("hide-search-list");
        loadMovies(searchTerm);
    } else {
        searchList.classList.add("hide-search-list");
        resultGrid.innerHTML = "";
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement("div");
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add("search-list-item");

        let moviePoster =
        movies[idx].Poster !== "N/A"
            ? movies[idx].Poster
            : "https://via.placeholder.com/42x58?text=No+Img";

        movieListItem.innerHTML = `
            <div class = "search-item-thumbnail">
                <img src = "${moviePoster}">
            </div>
            <div class = "search-item-info">
                <h3>${movies[idx].Title}</h3>
                <p>${movies[idx].Year}</p>
            </div>
            `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll(".search-list-item");
    searchListMovies.forEach((movie) => {
        movie.addEventListener("click", async () => {
            if (!movie.dataset.id) return;

            searchList.classList.add("hide-search-list");
            movieSearchBox.value = "";

            try {
                const result = await fetch(
                `${BASE_URL}?i=${movie.dataset.id}&apikey=${API_KEY}`,
                );
                const movieDetails = await result.json();
                displayMovieDetails(movieDetails);
            } catch (error) {
                console.error("Error loading details:", error);
            }
        });
    });
}

function displayMovieDetails(details) {

    let posterImg =
        details.Poster !== "N/A"
        ? details.Poster
        : "https://via.placeholder.com/320x450?text=Poster+Not+Found";

    resultGrid.innerHTML = `
        <div class = "movie-poster">
            <img src = "${posterImg}" alt = "movie poster">
        </div>
        <div class = "movie-info">
            <h3 class = "movie-title">${details.Title}</h3>
            <ul class = "movie-misc-info">
                <li class = "year">Year: ${details.Year}</li>
                <li class = "rated">Ratings: ${details.Rated}</li>
                <li class = "released">Released: ${details.Released}</li>
            </ul>
            <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
            <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
            <p class = "actors"><b>Actors: </b>${details.Actors}</p>
            <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
            <p class = "language"><b>Language:</b> ${details.Language}</p>
            <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
        </div>
    `;
}

window.addEventListener("click", (event) => {
  if (event.target.className !== "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
