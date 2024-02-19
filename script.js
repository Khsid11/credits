async function fetchQuranData() {
    try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json');
        if (!response.ok) {
            throw new Error('Failed to fetch Quran data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Quran data:', error);
        throw error; // Propagate the error to the caller
    }
}

function displayAlphabetButtons(data) {
    const alphabetButtonsContainer = document.querySelector('.alphabet-buttons');
    alphabetButtonsContainer.innerHTML = '';
    const alphabets = Array.from(new Set(data.map(surah => surah.name.charAt(0))));
    alphabets.forEach(alphabet => {
        const button = document.createElement('button');
        button.textContent = alphabet;
        button.addEventListener('click', () => showVerses(alphabet, data));
        alphabetButtonsContainer.appendChild(button);
    });
}

function showVerses(alphabet, data) {
    const surahsStartingWithAlphabet = data.filter(surah => surah.name.charAt(0) === alphabet);
    const versesContainer = document.getElementById('verses-container');
    versesContainer.innerHTML = '';

    if (surahsStartingWithAlphabet.length > 0) {
        surahsStartingWithAlphabet.forEach(surah => {
            surah.verses.forEach(verse => {
                const verseElement = document.createElement('div');
                verseElement.classList.add('verse');
                verseElement.innerHTML = `
                    <p><strong>${surah.name} ${verse.id}</strong></p>
                    <p>${verse.text}</p>
                    <p>${verse.translation}</p>
                `;
                versesContainer.appendChild(verseElement);
            });
        });
    } else {
        versesContainer.textContent = 'No surah found starting with this alphabet.';
    }
}

// Entry point
(async () => {
    try {
        const quranData = await fetchQuranData();
        displayAlphabetButtons(quranData);
    } catch (error) {
        const versesContainer = document.getElementById('verses-container');
        versesContainer.textContent = 'Failed to load Quran data. Please try again later.';
    }
})();
