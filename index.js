const newArray = [];
let globalAllMovieList = [];
let globalCheckedMovieId = [];
const checkBoxNameMovie = document.getElementsByName("genreMovie");
const checkBoxNameTv = document.getElementsByName("genreTv");

let configuration = {
  apiKey: "ca0e90411f6984a4380107e26e985b60",
  language: "en-U",
};

const makeNewArray = (array) => {
  return array.map((content) => {
    return {
      title: content.original_title,
      name: content.original_name,
      overView: content.overview,
      img: content.poster_path,
      type: content.media_type,
      genreId: content.genre_ids, //array
    };
  });
};

const fetchGenreMovieAndTvList = async () => {
  let { apiKey, language } = configuration;
  let genreMovieList = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=${language}`
  );
  const recievedMovieGenreData = await genreMovieList.json();
  globalAllMovieList = recievedMovieGenreData.genres; //array of object

  fetchTrendingContents();
};

const showGenreContent = (secondaryContainer) => {
  globalAllMovieList.map((movieGenre) => {
    let label = document.createElement("label");
    let input = document.createElement("input");
    input.type = "checkbox";
    input.name = "genreMovie";
    input.value = movieGenre.id;
    let span = document.createElement("span");
    span.textContent = movieGenre.name;
    input.setAttribute("id", movieGenre.id);
    input.addEventListener("change", filterGenre);
    label.append(input, span);

    secondaryContainer.appendChild(label);
  });
};

const fetchTrendingContents = async (search) => {
  let { apiKey } = configuration;
  try {
    const fethData = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
    );
    const recievedData = await fethData.json();

    let finalDataArray = recievedData.results; //array of object

    let newArray = makeNewArray(finalDataArray); // array of object

    let chekedFilter = [];
    if (globalCheckedMovieId.length > 0) {
      chekedFilter = newArray.filter(({ genreId }) => {
        //?? genre Id
        return isAllIncludes(globalCheckedMovieId, genreId);
      });
    } else {
      chekedFilter = newArray;
    }

    let searchArray = [];
    if (search !== undefined && search !== "") {
      searchArray = chekedFilter.filter(({ title, name }) => {
        if (title) {
          return title.toLowerCase().includes(search.toLowerCase());
        } else {
          return name.toLowerCase().includes(search.toLowerCase());
        }
      });
    } else {
      searchArray = chekedFilter;
    }

    makeContents(searchArray);
  } catch (error) {
    console.log(error);
  }
};

const makeContents = (array) => {
  let container = document.getElementById("container");

  let nav = document.getElementById("nav");
  nav.innerHTML = "";

  let searchbar = document.getElementById("search-bar");
  let searchPrimaryContainer = document.getElementById(
    "search-primary-container"
  );
  let searchSecondaryContainer = document.getElementById(
    "search-secondary-container"
  );

  if (!searchPrimaryContainer.hasChildNodes()) {
    searchbar.innerHTML = "";

    showGenreContent(searchSecondaryContainer);
    let searchControl = document.createElement("div");
    let account = document.createElement("div");
    searchbar.append(searchPrimaryContainer, searchSecondaryContainer);
    searchControl.classList.add("search-control");
    searchControl.innerHTML =
      "<input id= 'search-input'></input> <button class= 'search-button' onclick= fetchDataSearch(event)>search</button>";
    account.classList.add("account-container");
    account.innerHTML =
      "<i class='fa-solid fa-bell'></i> <i class='fa-solid fa-gear'></i> <img src='images/toa-heftiba-O3ymvT7Wf9U-unsplash.jpg' alt='acount'>";

    searchPrimaryContainer.append(searchControl, account);
  }

  let main = document.getElementById("main");
  main.innerHTML = "";

  // nav
  let menu = document.createElement("div");

  let navComponent = document.createElement("div");
  let navNameOne = document.createElement("div");
  let watchList = document.createElement("div");
  let favolites = document.createElement("div");
  let bestAction = document.createElement("div");
  let bestSF = document.createElement("div");
  let bestRomance = document.createElement("div");
  let bestMystery = document.createElement("div");
  menu.classList.add("menu");
  menu.textContent = "Movie Search";
  navComponent.classList.add("nav-component");
  navComponent.textContent = "My Movies";
  watchList.textContent = "Watch List";
  favolites.textContent = "Favolites";
  navComponent.append(watchList, favolites);
  nav.append(menu, navComponent);
  navNameOne.classList.add("nav-name");
  navNameOne.textContent = "My Playlists";
  bestAction.textContent = "Best Action";
  bestSF.textContent = "Best SF";
  bestRomance.textContent = "Best Romance";
  bestMystery.textContent = "Best Mystery";
  navNameOne.append(bestAction, bestMystery, bestRomance, bestSF);
  navComponent.appendChild(navNameOne);

  //main
  for (let i = 0; i < array.length; i++) {
    let movieControl = document.createElement("div");
    let movieImg = document.createElement("img");
    let movieTextControl = document.createElement("div");
    let movieTitle = document.createElement("p");
    let movieType = document.createElement("p");
    let moviediscription = document.createElement("p");
    movieControl.classList.add("movie-control");
    movieImg.classList.add("movie-img");
    movieImg.src =
      `https://image.tmdb.org/t/p/original${array[i].img}` ||
      "https://via.placeholder.com/300";
    movieTextControl.classList.add("movie-text-control");
    movieTitle.textContent = array[i].title || array[i].name;
    movieTitle.classList.add("movie-title");
    changeId(array[i].genreId, movieType);
    movieType.classList.add("movie-type");
    moviediscription.textContent = array[i].overView;
    main.appendChild(movieControl);
    movieControl.append(movieImg, movieTextControl);
    movieTextControl.append(movieTitle, movieType, moviediscription);
  }
  container.append(nav, searchbar, main);
};

const isAllIncludes = (array, target) =>
  array.every((item) => target.includes(item));

const fetchDataSearch = async () => {
  let searchInput = document.getElementById("search-input");
  let inputValue = searchInput.value;
  fetchTrendingContents(inputValue);
};

const changeId = (array, text) => {
  let sample = [];
  array.forEach((item) => {
    globalAllMovieList.forEach((genre) => {
      if (item === genre.id) {
        sample.push(genre.name);
      }
    });
    text.textContent = sample;
  });
};

const filterGenre = async () => {
  globalCheckedMovieId = [];
  checkBoxNameMovie.forEach((element) => {
    console.log(element);
    if (element.checked) {
      globalCheckedMovieId.push(parseInt(element.value));
    }
  });

  fetchTrendingContents();
};

fetchGenreMovieAndTvList();
