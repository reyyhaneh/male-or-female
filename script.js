function onSubmit() {
    const name = nameInput.value;
    // if data exists in local storage display the saved value for it under the predicted value.
    
    // Check if the name is not empty
    if (name.trim() !== '') {
        // Call the function to fetch data from the API
        fetchDataFromApi(name);
        displaySavedGender();
    } else {
        alert('Please enter a name before submitting.');
    }
}

function fetchDataFromApi(name) {
    const apiEndpoint = 'https://api.genderize.io/'; 

    fetch(`${apiEndpoint}?name=${encodeURIComponent(name)}`)
        .then(response => {
            if (!response.ok) {
                displayError("Network was not ok.")
                throw new Error('Error status: ${response.status}');
            }
            return response.json();
        })
        .then(data => {
            updatePredictionColumn(data);
        })
        .catch(error => {
            console.error('Error fetching data from API:', error);
        });
}

function updatePredictionColumn(prediction) {
    const gender = prediction.gender;
    if (gender === null){
        displayError("There is no prediction for this name.")
    }
    else{
        const predictionColumn = document.getElementById('genderPrediction');
        const probability = prediction.probability;
        predictionColumn.innerHTML = `<p>${gender}</p> <p>${probability}</p>`;
    }
}

function onSave(){
    const name = nameInput.value;
    if (name.trim() !== '') {
        const gender = getSelectedGender();
        saveDataToLocalStorage(name, gender);

    } else {
        alert('Please enter a name befor saving.')
    }
}

function getSelectedGender() {
    const maleOption = document.getElementById('maleOption');
    const femaleOption = document.getElementById('femaleOption');

    if (maleOption.checked) {
        return 'male';
    } else if (femaleOption.checked) {
        return 'female';
    } else {
        alert('Please select a gender for this name.')
        return null;
    }
}

/*  
    To save multiple key and values in local storage we store them as an array.
    Therefore to modify the saved data we need to get the existing saved data, parse the JSON,
    modify it and then re-string it.
    This function gets the data saved in the local storage, checks if the current key is saved
    or not. If it is, it replaces it's index with the new key and value. and if not, it pushes
    the new data to the data in the storage.
*/
function saveDataToLocalStorage(name, gender) {
    // Load existing data from local storage
    let existingData = JSON.parse(localStorage.getItem('savedData')) || [];
    // Check if the name already exists in the stored data
    const index = existingData.findIndex(entry => entry.name === name);
    if (index !== -1) {
        // If the name exists, update the existing entry
        existingData[index] = { name, gender };
    } else {
        // If the name doesn't exist, add a new entry
        existingData.push({ name, gender });
    }
    // Save the updated data to local storage
    localStorage.setItem('savedData', JSON.stringify(existingData));
    alert('name saved to local storage')
}

function nameExistsInLocalStorage(name){
    const existingData = JSON.parse(localStorage.getItem('savedData')) || [];
    return existingData.some(entry => entry.name === name);
}
/*
    This function checks whether there is a saved entry in the local storage for the entered name or not.
    After that it holds the value in a variable: savedGender.
    Then it creates a <div> container to display the data in the prediction column, which has a <p> inside for the text value.
    The saved gender container should include a clear button, this function creates the button and adds an event listener to it,
    which calls the clearSavedData() function. so when the user clicks the button the displayed name and it's gender entry is deleted 
    from the local storage.
    Lastly in the function these created elemnts are appended to the container and the container is appended to the genderPredictionDiv.
*/
function displaySavedGender() {
    const name = nameInput.value;    
    if (nameExistsInLocalStorage(name)) {
        const savedData = JSON.parse(localStorage.getItem('savedData')) || [];        
        const savedEntry = savedData.find(entry => entry.name === name);
        
        if (savedEntry) {
            const savedGender = savedEntry.gender;

            const savedGenderContainer = document.createElement('div');
            savedGenderContainer.className = 'saved-gender-container';

            const savedGenderParagraph = document.createElement('p');
            savedGenderParagraph.textContent = `Saved Answer: ${savedGender}`;
            savedGenderParagraph.t


            // Clear button.
            const clearButton = document.createElement('button');
            clearButton.textContent = 'Clear';
            clearButton.addEventListener('click', function () {
                clearSavedData(name);
                savedGenderContainer.remove(); // Remove the container when cleared
            });

            // Appending the paragraph and button to the container
            savedGenderContainer.appendChild(savedGenderParagraph);
            savedGenderContainer.appendChild(clearButton);
            // Inserting the container underneath genderPrediction.
            const genderPredictionDiv = document.getElementById('genderPrediction');
            genderPredictionDiv.insertAdjacentElement('afterend', savedGenderContainer);
        
        }
    } 
}

function clearSavedData(name) {
    let existingData = JSON.parse(localStorage.getItem('savedData')) || [];
    existingData = existingData.filter(entry => entry.name !== name);

    localStorage.setItem('savedData', JSON.stringify(existingData));

    alert(`Saved data cleared for ${name}`);
}


function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    const body = document.body;
    body.appendChild(errorDiv);
    setTimeout(() => {
        errorDiv.remove();
    }, 5000); 
}
