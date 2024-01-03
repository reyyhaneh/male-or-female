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
}