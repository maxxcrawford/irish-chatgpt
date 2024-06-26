document.addEventListener('DOMContentLoaded', () => {
    const filterCostInput = document.getElementById('filter-cost');
    const costValueLabel = document.getElementById('cost-value');
    const filterRegionSelect = document.getElementById('filter-region');
    const sightseeingList = document.getElementById('sightseeing-list');

    if (filterCostInput) {
        fetch('data/sightseeing.json')
        .then(response => response.json())
        .then(data => {
            const maxCost = Math.max(...data.map(destination => destination.cost));
            const minCost = Math.min(...data.map(destination => destination.cost));
            
            filterCostInput.max = maxCost;
            filterCostInput.min = minCost;
            filterCostInput.value = maxCost;

            costValueLabel.textContent = maxCost;

            displaySightseeing(data);

            filterCostInput.addEventListener('input', () => {
                const selectedCost = parseFloat(filterCostInput.value);
                costValueLabel.textContent = selectedCost;
                filterAndDisplaySightseeing(data, selectedCost, filterRegionSelect.value);
            });

            filterRegionSelect.addEventListener('change', () => {
                const selectedCost = parseFloat(filterCostInput.value);
                filterAndDisplaySightseeing(data, selectedCost, filterRegionSelect.value);
            });
        });
    }
    
    

    function displaySightseeing(destinations) {
        sightseeingList.innerHTML = '';
        destinations.forEach(destination => {
            const li = document.createElement('li');
            const cost = destination.cost === 0 ? 'Free' : `€${destination.cost}`;
            li.innerHTML = `<a href="detail.html?id=${destination.id}">${destination.name}</a> - ${cost}`;
            sightseeingList.appendChild(li);
        });
    }

    function filterAndDisplaySightseeing(data, maxCost, region) {
        const filteredData = data.filter(destination => {
            return destination.cost <= maxCost && (region === 'all' || destination.region === region);
        });
        displaySightseeing(filteredData);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const destinationId = urlParams.get('id');
    const destinationDetails = document.getElementById('destination-details');
    const destinationName = document.getElementById('destination-name');
    const destinationInfo = document.getElementById('destination-info');

    fetch('data/sightseeing.json')
        .then(response => response.json())
        .then(data => {
            const destination = data.find(dest => dest.id == destinationId);
            if (destination) {
                destinationName.textContent = destination.name;
                const cost = destination.cost === 0 ? 'Free' : `€${destination.cost}`;
                destinationInfo.innerHTML = `
                    <p>Latitude: ${destination.latitude}</p>
                    <p>Longitude: ${destination.longitude}</p>
                    <p>Address: ${destination.local_address}</p>
                    <p>Star Rating: ${destination.star_rating}</p>
                    <p>Cost: ${cost}</p>
                `;
                fetchWeather(destination.latitude, destination.longitude);
            }
        });

    function fetchWeather(latitude, longitude) {
        fetch(`http://metwdb-openaccess.ichec.ie/metno-wdb2ts/locationforecast?lat=${latitude};long=${longitude}`)
            .then(response => response.json())
            .then(data => {

                console.log(data)

                // Process the weather data as needed
                // Assuming data format based on the API documentation
                const temperature = data.weather[0].temperature;
                const precipitation = data.weather[0].precipitation;

                const weatherInfo = `
                    <p>Temperature: ${temperature} °C</p>
                    <p>Precipitation: ${precipitation} mm</p>
                `;
                destinationInfo.innerHTML += weatherInfo;
            });
    }
});
