const input = document.getElementById("input");

async function fetchAPI(word) {
    const word_url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    const meaningContainer = document.getElementById("meanings");
    if(meaningContainer) {
        meaningContainer.remove();
    }

    try {
        const dictionary = document.getElementById('dictionary');
        const meaningContainer = document.createElement("div");
        meaningContainer.id = "meanings";

        const loadingIndicator = document.createElement('div');
        loadingIndicator.style.margin = '5rem';
        loadingIndicator.style.textAlign = 'center';
        
        const loaderImage = document.createElement('img');
        loaderImage.src = './assets/loading.gif';
        loaderImage.height = 100;
        loaderImage.alt = 'Loading...';
        loadingIndicator.appendChild(loaderImage);

        dictionary.appendChild(loadingIndicator);
        
        const response = await fetch(word_url);
        const result = await response.json();

        loadingIndicator.remove();
        
        if (result.length > 0) {
            const audioDiv = document.createElement('div');
            audioDiv.classList.add('d-flex', 'flex-column');
            const pronounciation = document.createElement('span');
            pronounciation.classList.add('part-of-speech');
            pronounciation.textContent = "Pronounciation: "
            audioDiv.appendChild(pronounciation);

            const audio = document.createElement('audio');
            audio.src = result[0].phonetics[0].audio;
            audio.id = 'audio';
            audio.controls = true;

            audioDiv.style.marginBottom = '10px';
            audioDiv.appendChild(audio);

            meaningContainer.appendChild(audioDiv);

            result[0].meanings.forEach(meaning => {
            const entry = document.createElement("div");
            entry.classList.add("dictionary-entry");

            const partOfSpeech = document.createElement("div");
            partOfSpeech.classList.add("part-of-speech");
            partOfSpeech.textContent = meaning.partOfSpeech;
            entry.appendChild(partOfSpeech);

            meaning.definitions.forEach(definition => {
                const definitionDiv = document.createElement("div");
                definitionDiv.classList.add("definition");
                definitionDiv.innerText = "Definition: ";
                const definitionText = document.createElement("span");
                definitionText.textContent = definition.definition;
                definitionText.style.fontWeight = 'normal';
                definitionDiv.appendChild(definitionText);

                if (definition.example) {
                    const example = document.createElement("div");
                    example.classList.add("example");
                    example.textContent = "Example: " + definition.example;
                    definitionDiv.appendChild(example);
                }

                entry.appendChild(definitionDiv);
            });

            meaningContainer.appendChild(entry);
            });

            dictionary.appendChild(meaningContainer);

        }
    } catch (error) {
       console.log('Error occured, try again later');
    }
}

input.addEventListener("keyup", (e) => {
    console.log(e.key);
  if (e.target.value && e.key === "Enter") {
    fetchAPI(e.target.value);
  }
});