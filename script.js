
const apiKey = '579b464db66ec23bdd000001a7a37c6753d241d158cfea482002a5b4';
const apiUrl = `https://api.data.gov.in/resource/cef25fe2-9231-4128-8aec-2c948fedd43f?api-key=${apiKey}&format=json&limit=10742`;

const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');
const fetchDataButton = document.getElementById('fetchData');
const resultsContainer = document.getElementById('results');

let records = [];

// Fetch data from API
function fetchData() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.records && data.records.length > 0) {
        records = data.records;
        populateStates(records);
      } else {
        console.error('No records found in API response');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Populate unique states in the state dropdown
function populateStates(data) {
  const states = [...new Set(data.map(record => record.StateName).filter(Boolean))].sort();

  if (states.length === 0) {
    console.error('No valid states found');
    return;
  }

  stateSelect.innerHTML = `<option value="">Select a state</option>`;
  states.forEach(state => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });
}

// Populate unique cities based on selected state
function populateCities(selectedState) {
  const cities = [...new Set(records
    .filter(record => record.StateName === selectedState && record.DistrictName)
    .map(record => record.DistrictName))].sort();

  if (cities.length === 0) {
    citySelect.innerHTML = '<option value="">No cities available</option>';
    return;
  }

  citySelect.innerHTML = `<option value="">Select a city</option>`;
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

// Filter and display the questions and answers based on state and city
function displayResults(state, city) {
  const filteredData = records.filter(record =>
    (state ? record.StateName === state : true) &&
    (city ? record.DistrictName === city : true)
  );

  resultsContainer.innerHTML = '';

  if (filteredData.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
  }

  filteredData.forEach(record => {
    const resultItem = document.createElement('div');
    resultItem.classList.add('result-item');
    resultItem.innerHTML = `
      <h3>Question: ${record.QueryText}</h3>
      <p>Answer: ${record.KccAns}</p>
      <p>State: ${record.StateName}</p>
      <p>Location: ${record.DistrictName}</p>
      <p>Date: ${record.CreatedOn}</p>
    `;
    resultsContainer.appendChild(resultItem);
  });
}

// Event listeners
stateSelect.addEventListener('change', (e) => {
  const selectedState = e.target.value;
  if (selectedState) {
    populateCities(selectedState);
  } else {
    citySelect.innerHTML = '<option value="">Select a city</option>';
  }
});

fetchDataButton.addEventListener('click', () => {
  const selectedState = stateSelect.value;
  const selectedCity = citySelect.value;
  displayResults(selectedState, selectedCity);
});

// Fetch initial data and populate states on page load
window.onload = fetchData;