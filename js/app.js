// Запрос к API
const baseUrl = "https://swapi.dev/api";
let currentPage = 1;
let characters = [];

async function fetchCharacters(page = 1) {
  const response = await fetch(`${baseUrl}/people/?page=${page}`);
  const data = await response.json();
  characters = data.results;
}

// Отображение списка персонажей
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

  // Обновление состояния кнопок "Вперед" и "Назад"
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

// Отображение деталей персонажа
const characterDetails = document.querySelector("#character-details");
const characterDetailsRow = document.querySelector("#character-details-row");
const backToListBtn = document.querySelector("#back-to-list-btn");

async function displayCharacterDetails(character) {
  // Скрытие списка персонажей и отображение деталей персонажа
  charactersList.style.display = "none";
  characterDetails.style.display = "";

  // Получение данных о фильмах, мире и виде существ и отображение деталей персонажа в таблице
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

  let species = "n/a"; // установка значения "n/a" по умолчанию
  if (character.species.length > 0) {
    const speciesResponse = await fetch(character.species);
    const speciesData = await speciesResponse.json();
    species = speciesData.name;
  }

  // Получение ссылки на фото персонажа
  const personResponse = await fetch(
    `https://starwars-visualguide.com/assets/img/characters/${
      character.url.split("/")[5]
    }.jpg`
  );
  const personImg = personResponse.ok
    ? `https://starwars-visualguide.com/assets/img/characters/${
        character.url.split("/")[5]
      }.jpg`
    : "https://via.placeholder.com/150"; // установка ссылки на заглушку, если фото недоступно

  // Отображение деталей персонажа в таблице
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
    characterDetails.style.display = "none";
    charactersList.style.display = "";
  });
}
