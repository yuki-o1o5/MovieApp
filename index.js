const newArray = [];
let globalMovieList = [];
let globalTvList = [];
let globalCheckedMovieId = [];
let globalCheckedTvId = [];

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
  globalMovieList = recievedMovieGenreData.genres; //array of object

  let genreTvList = await fetch(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=${language}`
  );
  const recievedTvGenreData = await genreTvList.json();
  globalTvList = recievedTvGenreData.genres; //array of object
  fetchTrendingContents();
};

const showGenreContent = (secondaryContainer, tertiaryContainer) => {
  globalMovieList.map((movieGenre) => {
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

  globalTvList.map((tvGenre) => {
    let label = document.createElement("label");
    let input = document.createElement("input");
    input.type = "checkbox";
    input.name = "genreTv";
    input.value = tvGenre.id;
    let span = document.createElement("span");
    span.textContent = tvGenre.name;
    input.setAttribute("id", tvGenre.id);

    input.addEventListener("change", filterGenre);

    label.append(input, span);
    tertiaryContainer.appendChild(label);
  });
};

const fetchTrendingContents = async (search) => {
  let { apiKey } = configuration;
  try {
    const fethData = await fetch(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`
    );
    const recievedData = await fethData.json();

    let finalDataArray = recievedData.results;

    let newArray = makeNewArray(finalDataArray);

    let chekedFilter = [];
    if (globalCheckedMovieId.length > 0) {
      chekedFilter = newArray.filter(({ genreId }) => {
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
  let searchTertiaryContainer = document.getElementById(
    "search-tertiary-container"
  );

  if (!searchPrimaryContainer.hasChildNodes()) {
    searchbar.innerHTML = "";
    searchPrimaryContainer.innerHTML = "";
    searchSecondaryContainer.innerHTML = "";
    searchTertiaryContainer.innerHTML = "";

    showGenreContent(searchSecondaryContainer, searchTertiaryContainer);
    let searchControl = document.createElement("div");
    let account = document.createElement("div");
    searchbar.append(
      searchPrimaryContainer,
      searchSecondaryContainer,
      searchTertiaryContainer
    );
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
  menu.classList.add("menu");
  menu.textContent = "Movie Search";
  navComponent.classList.add("nav-component");
  navComponent.textContent = "This is the nav component";
  nav.append(menu, navComponent);
  navNameOne.classList.add("nav-name");
  navNameOne.textContent = "My Favolite";
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
    movieType.textContent = array[i].type;
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

const filterGenre = async () => {
  globalCheckedMovieId = [];
  checkBoxNameMovie.forEach((element) => {
    if (element.checked) {
      globalCheckedMovieId.push(parseInt(element.value));
    }
  });

  globalCheckedTvId = [];
  checkBoxNameTv.forEach((element) => {
    if (element.checked) {
      globalCheckedTvId.push(parseInt(element.value));
    }
  });

  fetchTrendingContents();
};

fetchGenreMovieAndTvList();
