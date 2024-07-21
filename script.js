document.getElementById('search-button').addEventListener('click', searchCharacter);
document.getElementById('filter-button').addEventListener('click', filterCharacters);

let currentSearchResults = [];

// function to search for characters by name
function searchCharacter() {
    const characterName = document.getElementById('character-search').value.trim();
    if (characterName === '') {
        displayError('please enter a character name.');
        return;
    }
    
    // fetch characters from the API
    fetch(`https://api.disneyapi.dev/character?name=${characterName}`)
        .then(response => response.json())
        .then(data => {
            currentSearchResults = data.data;
            displayCharacters(currentSearchResults);
            populateFilterOptions(currentSearchResults);
        })
        .catch(error => displayError('an error occurred while fetching the character data.'));
}

// function to display characters
function displayCharacters(characters) {
    const characterList = document.getElementById('character-list');
    characterList.innerHTML = '';

    if (characters.length === 0) {
        displayError('no characters found.');
        return;
    }

    // create a card for each character
    characters.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.className = 'card col-md-4';
        characterCard.innerHTML = `
            <img src="${character.imageUrl}" class="card-img-top" alt="${character.name}" onerror="this.onerror=null;this.src='placeholder.png';">
            <div class="card-body">
                <h5 class="card-title">${character.name}</h5>
                <button class="btn btn-primary" onclick="viewCharacterDetails(${character._id})">view details</button>
            </div>
        `;
        characterList.appendChild(characterCard); 
    });
}

// function to view character details
function viewCharacterDetails(characterId) {
    // fetch character details from the API
    fetch(`https://api.disneyapi.dev/character/${characterId}`)
        .then(response => response.json())
        .then(data => {
            const character = data.data; // access the character data
            const characterDetails = document.getElementById('character-details');
            characterDetails.innerHTML = `
                <img src="${character.imageUrl}" alt="${character.name}" onerror="this.onerror=null;this.src='placeholder.png';">
                <h2>${character.name}</h2>
                <p><strong>films:</strong> ${character.films.join(', ')}</p>
                <p><strong>tv shows:</strong> ${character.tvShows.join(', ')}</p>
                <p><strong>short films:</strong> ${character.shortFilms.join(', ')}</p>
                <p><strong>video games:</strong> ${character.videoGames.join(', ')}</p>
                <p><strong>park attractions:</strong> ${character.parkAttractions.join(', ')}</p>
                <p><strong>allies:</strong> ${character.allies.join(', ')}</p>
                <p><strong>enemies:</strong> ${character.enemies.join(', ')}</p>
                <p><strong>description:</strong> ${character.shortDescription || 'n/a'}</p>
                <p><strong>more info:</strong> <a href="${character.sourceUrl}" target="_blank">${character.sourceUrl}</a></p>
            `;
            $('#character-details-modal').modal('show');
        })
        .catch(error => handleDetailError(error, characterId));
}

// function to handle errors while fetching character details
function handleDetailError(error, characterId) {
    console.error(`error fetching details for character id ${characterId}:`, error);
    displayError('an error occurred while fetching the character details. please check the console for more details.');
}

// function to populate filter options with movies and tv shows
function populateFilterOptions(characters) {
    const filterSelect = document.getElementById('filter-select');
    filterSelect.innerHTML = '<option value="">filter by movie or tv show</option>';
    const movies = new Set();
    const tvShows = new Set();

    // collect unique movies and tv shows from characters
    characters.forEach(character => {
        character.films.forEach(movie => movies.add(movie));
        character.tvShows.forEach(tvShow => tvShows.add(tvShow));
    });

    // add movie options to the filter select
    movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie;
        option.textContent = movie;
        filterSelect.appendChild(option);
    });

    // add tv show options to the filter select
    tvShows.forEach(tvShow => {
        const option = document.createElement('option');
        option.value = tvShow;
        option.textContent = tvShow;
        filterSelect.appendChild(option);
    });
}

// function to filter characters by selected movie or tv show
function filterCharacters() {
    const filterValue = document.getElementById('filter-select').value;
    if (filterValue === '') {
        displayError('please select a movie or tv show to filter by.');
        return;
    }

    // filter characters based on selected movie or tv show
    const filteredCharacters = currentSearchResults.filter(character => character.films.includes(filterValue) || character.tvShows.includes(filterValue));
    displayCharacters(filteredCharacters);
}

// function to display error messages
function displayError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
}
