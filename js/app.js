/* Api request */
const baseUrl = "https://swapi.dev/api";
let currentPage = 1;
let characters = [];

async function fetchCharacters(page = 1) {
  const response = await fetch(`${baseUrl}/people/?page=${page}`);
  const data = await response.json();
  characters = data.results;
}

/* Character list display */
const charactersList = document.querySelector("#characters-list");
const prevPageBtn = document.querySelector("#prev-page-btn");
const nextPageBtn = document.querySelector("#next-page-btn");

async function displayCharacters(page = 1) {
  await fetchCharacters(page);

  charactersList.innerHTML = "";
  characters.forEach((character) => {
    const listItem = document.createElement("li");
    listItem.textContent = character.name;
    listItem.addEventListener("click", () =>
      displayCharacterDetails(character)
    );
    charactersList.appendChild(listItem);
  });

  /* Updating the state of the forward and back buttons */
  if (currentPage === 1) {
    prevPageBtn.disabled = true;
  } else {
    prevPageBtn.disabled = false;
  }

  if (characters.length < 10) {
    nextPageBtn.disabled = true;
  } else {
    nextPageBtn.disabled = false;
  }
}

prevPageBtn.addEventListener("click", () => {
  currentPage--;
  displayCharacters(currentPage);
});

nextPageBtn.addEventListener("click", () => {
  currentPage++;
  displayCharacters(currentPage);
});

displayCharacters();

/* Character details display */
const characterDetails = document.querySelector("#character-details");
const characterDetailsRow = document.querySelector("#character-details-row");
const backToListBtn = document.querySelector("#back-to-list-btn");
const charactersBlock = document.querySelector(".characters");

async function displayCharacterDetails(character) {
  /* Change the background image on the page */
  switch (currentPage) {
    case 2:
      characterDetails.style.background =
        "url(./img/page-2-details-bg.jpg) 0 0 / cover no-repeat";
      break;
    case 3:
      characterDetails.style.background =
        "url(./img/page-3-details-bg.jpg) 0 0 / cover no-repeat";
      break;
    case 4:
      characterDetails.style.background =
        "url(./img/page-4-details-bg.jpg) 0 0 / cover no-repeat";
      break;
    case 5:
      characterDetails.style.background =
        "url(./img/page-5-details-bg.jpg) 0 0 / cover no-repeat";
      break;
    case 6:
      characterDetails.style.background =
        "url(./img/page-6-details-bg.jpg) 0 0 / cover no-repeat";
      break;
    case 7:
      characterDetails.style.background =
        "url(./img/page-7-details-bg.jpg) 0 0 / cover no-repeat";
      break;
    case 8:
      characterDetails.style.background =
        "url(./img/page-8-details-bg.jpg) 0 0 / cover no-repeat";
      break;
    case 9:
      characterDetails.style.background =
        "url(./img/page-9-details-bg.jpg) 0 0 / cover no-repeat";
      break;

    default:
      characterDetails.style.background =
        "url(./img/page-1-details-bg.jpg) 0 0 / cover no-repeat";
  }

  /* Showing character details */
  characterDetails.style.transform = "translateY(0px)";

  /* Getting movie, world, and creature type data and displaying character details in a table */
  const films = await Promise.all(
    character.films.map(async (filmUrl) => {
      const response = await fetch(filmUrl);
      const data = await response.json();
      return data.title;
    })
  );

  const homeworldResponse = await fetch(character.homeworld);
  const homeworldData = await homeworldResponse.json();
  const homeworld = homeworldData.name;

  /* setting "n/a" to default */
  let species = "n/a";

  if (character.species.length > 0) {
    const speciesResponse = await fetch(character.species);
    const speciesData = await speciesResponse.json();
    species = speciesData.name;
  }

  /* Getting a link to a character's photo */
  const personResponse = await fetch(
    `https://starwars-visualguide.com/assets/img/characters/${
      character.url.split("/")[5]
    }.jpg`
  );
  const personImg = personResponse.ok
    ? `https://starwars-visualguide.com/assets/img/characters/${
        character.url.split("/")[5]
      }.jpg`
    : "https://via.placeholder.com/150"; /*setting a link to a stub if the photo is not available*/

  /* Displaying Character Details in a Table */
  characterDetailsRow.innerHTML = `
    <td><img src="${personImg}" alt="${
    character.name
  }" width="150" height="225"></td>
    <td>${character.name}</td>
    <td>${character.birth_year}</td>
    <td>${character.gender}</td>
    <td><ul>${films.map((film) => `<li>${film}</li>`).join("")}</ul></td>
    <td>${homeworld}</td>
    <td>${species}</td>
  `;
  backToListBtn.addEventListener("click", () => {
    characterDetails.style.transform = "translateY(-1000px)";
  });
}
