document.addEventListener('DOMContentLoaded', () => {
    const filterCostInput = document.getElementById('filter-cost');
    const costValueLabel = document.getElementById('cost-value');
    const filterRegionSelect = document.getElementById('filter-region');
    const sightseeingList = document.getElementById('sightseeing-list');

    fetch('data/sightseeing.json')
        .then(response => response.json())
        .then(data => {
            displaySightseeing(data);
            filterCostInput.addEventListener('input', () => {
                const maxCost = parseFloat(filterCostInput.value);
                costValueLabel.textContent = maxCost;
                filterAndDisplaySightseeing(data, maxCost, filterRegionSelect.value);
            });
            filterRegionSelect.addEventListener('change', () => {
                const maxCost = parseFloat(filterCostInput.value);
                filterAndDisplaySightseeing(data, maxCost, filterRegionSelect.value);
            });
        });

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
        fetch(`https://weather.apis.ie/forecasts/${latitude},${longitude}`)
            .then(response => response.json())
            .then(data => {
                const weatherInfo = `
                    <p>Temperature: ${data.temperature} °C</p>
                    <p>Precipitation: ${data.precipitation} mm</p>
                `;
                destinationInfo.innerHTML += weatherInfo;
            });
    }
});
