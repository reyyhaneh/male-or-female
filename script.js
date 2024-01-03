function submitForm() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value;

    // Check if the name is not empty
    if (name.trim() !== '') {
        // Call the function to fetch data from the API
        fetchDataFromApi(name);
    } else {
        alert('Please enter a name before submitting.');
    }
}


function fetchDataFromApi(name) {
    const apiEndpoint = 'https://api.genderize.io/'; 

    fetch(`${apiEndpoint}?name=${encodeURIComponent(name)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
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
    const predictionColumn = document.getElementById('gender');
    const gender = prediction.gender;
    const probability = prediction.probability;

    predictionColumn.innerHTML = `<p>${gender}</p> <p>${probability}</p>`;
}