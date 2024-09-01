const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
if (loggedInUser) {
    let welcomeMessage = document.getElementById("welcomeMessage")
    welcomeMessage.innerText = `Welcome ${loggedInUser.name} !`
    welcomeMessage.style.marginBottom = "0"
}

// AOS Initialization
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
        duration: 1000,
        once: false, 
    });
});

function logout() {
    location.href = "index.html"
}

let urlCitiesAPI = "https://66c4b3dfb026f3cc6cf06240.mockapi.io/cities/cites";
let cities = [];

//  Get Cities API
async function getCitiesAPI() {
    try {
        const response = await fetch(urlCitiesAPI)
        const data = await response.json()
        cities.push(...data)
        displayCities();
        populateCountryDropdown();
        populateTimeZoneDropdown();
        displayStoredFilteredCities();
    } catch (error) {
        console.log(error)
    }
}

getCitiesAPI()

// Cities from Session Storage
function displayStoredFilteredCities() {
    const storedFilteredCities = sessionStorage.getItem("filteredCities");

    if (storedFilteredCities) {
        const filteredCities = JSON.parse(storedFilteredCities);
        displayCities(filteredCities);
    }

    else {
        displayCities();
    }
}

// Display cities
function displayCities(filteredCities = cities)  {
    let citiesContainer = document.getElementById("citiesContainer")
    citiesContainer.innerHTML = ""

    filteredCities.forEach((city, index) => {
        const col = document.createElement("div")
        col.classList.add("col-md-4")

        const cityCard = document.createElement("div")
        cityCard.classList.add("card")
        cityCard.style.height = "100%"

        //AOS Animation
        cityCard.setAttribute("data-aos", "fade-left");
        cityCard.setAttribute("data-aos-delay", `${index * 350}` )

        cityCard.innerHTML += `
            <img src="${city.image}" class="card-img-top" alt="${city.cityName}">
            <div class="card-body">  
                <h3>City: ${city.cityName}</h3>
                <p>Country: ${city.countryName}</p>
                <p>Time Zone: ${city.timeZone}</p>
                <p>${city.description}</p>
                <p>Zip Code: ${city.zipCode}</p>
            </div>
        `

        citiesContainer.appendChild(col)
        col.appendChild(cityCard)

        cityCard.style.cursor = "pointer"

        cityCard.addEventListener("click", () => {
            openCityModal(city)

           
    });
});


}

// City Modal
function openCityModal(city) {
    document.getElementById("cityModalTitle").textContent = city.cityName
    document.getElementById("cityModalDescription").textContent = city.description
    document.getElementById("cityModalZipCode").textContent = `Zip code: ${city.zipCode}`
    document.getElementById("cityModal").style.display = "block"
    document.getElementById("cityModalCountry").textContent = `Country: ${city.countryName}`

    const cityModal = new bootstrap.Modal("#cityModal");
    cityModal.show();

    document.getElementById("modalEditBtn").onclick = () => editCity(city);
    document.getElementById("modalDeleteBtn").onclick = () => deleteCity(city);
}

// Filters

// Filter by country
function populateCountryDropdown() {
    const countryDropdown = document.getElementById("countryDropdown");
    countryDropdown.style.cursor = "pointer";
    const countrySet = new Set();

    const allCountries = document.createElement("li");
    allCountries.classList.add("dropdown-item");
    allCountries.textContent = "All Countries";
    allCountries.addEventListener("click", () => {
        displayCities();
        sessionStorage.setItem("filteredCities", JSON.stringify(cities));
    })

    countryDropdown.appendChild(allCountries);
   

    cities.forEach((city) => {
        if (!countrySet.has(city.countryName)) {
            countrySet.add(city.countryName);
            
            const dropdownItem = document.createElement("li");
            dropdownItem.classList.add("dropdown-item");
            dropdownItem.textContent = city.countryName;
            dropdownItem.addEventListener("click", () => {
                filteredCitiesByCountry(city.countryName);
            })

            countryDropdown.appendChild(dropdownItem);
        }
    });
}

// filter by time zone
function populateTimeZoneDropdown() {
    const timeZoneDropdown = document.getElementById("timeZoneDropdown");
    timeZoneDropdown.style.cursor = "pointer";
    const timeZoneSet = new Set();

    const allCountries = document.createElement("li");
    allCountries.classList.add("dropdown-item");
    allCountries.textContent = "All Countries";
    allCountries.addEventListener("click", () => {
        displayCities();
        sessionStorage.setItem("filteredCities", JSON.stringify(cities));
    })

    timeZoneDropdown.appendChild(allCountries);
   

    cities.forEach((city) => {
        if (!timeZoneSet.has(city.timeZone)) {
            timeZoneSet.add(city.timeZone);
            
            const dropdownItem = document.createElement("li");
            dropdownItem.classList.add("dropdown-item");
            dropdownItem.textContent = city.timeZone;
            dropdownItem.addEventListener("click", () => {
                filteredCitiesByCountry(city.countryName);
            })

            timeZoneDropdown.appendChild(dropdownItem);
        }
    });
}

// filtering, displaying and session storage 
function filteredCitiesByCountry(selectedCountry) {
    const filteredCities = cities.filter(city => city.countryName === selectedCountry);
    sessionStorage.setItem("filteredCities", JSON.stringify(filteredCities));
    displayCities(filteredCities);
}

// display all cities
function displayAllCities() {
    sessionStorage.removeItem("filteredCities");
    displayCities(filteredCities);
}

// Search bar
function searchCities() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const filteredCities = cities.filter(city => city.description.toLowerCase().includes(searchTerm));
    sessionStorage.setItem("filteredCities", JSON.stringify(filteredCities));
    displayCities(filteredCities);
}

document.getElementById("searchInput").addEventListener("keyup", searchCities);

// Edit city
function editCity(city) {
    const newCountryName = prompt("Enter the new country name:", city.countryName);
    const newTimeZone = prompt("Enter the new time zone:", city.timeZone);
    const newDescription = prompt("Enter the new description:", city.description);
    const newZipCode = prompt("Enter the new zip code:", city.zipCode);

    if (newCountryName && newTimeZone && newDescription && newZipCode) {
        city.countryName = newCountryName;
        city.timeZone = newTimeZone;
        city.description = newDescription;
        city.zipCode = newZipCode;
        updateCityInStorage(city);
        displayCities();
        const cityModal = bootstrap.Modal.getInstance(document.getElementById("cityModal"));
        cityModal.hide();
    }
}

// Update city in storage
function updateCityInStorage(updatedCity) {
    const storedCities = cities.map (city =>
        city.id === updatedCity.id ? updatedCity : city
    )

    sessionStorage.setItem("filteredCities", JSON.stringify(storedCities));

    cities = storedCities;
}

// Delete city
function deleteCity(city) {
    const confirmation = confirm(`Are you sure you want to delete ${city.cityName}?`);

    if (confirmation) {

        fetch(`${urlCitiesAPI}/${city.id}`, {
            method: "DELETE",
        })

        .then(response => {
            if (response.ok) {
                cities = cities.filter(c => c.id !== city.id);
                sessionStorage.setItem("filteredCities", JSON.stringify(cities));
                displayStoredFilteredCities();
                const cityModal = bootstrap.Modal.getInstance(document.getElementById("cityModal"));
                cityModal.hide();
            }

            else {
                console.error("Failed to delete city");
            }
        })
        

        .catch(error => console.error(error));
    
        
    }
}

// Add City Modal
async function addCity() {
  
    const cityImage = document.getElementById("AddCityImage").value;
    const cityName = document.getElementById("AddCityName").value;
    const cityCountryName = document.getElementById("AddCityCountry").value;
    const cityTimeZone = document.getElementById("AddCityTimeZone").value;
    const cityDescription = document.getElementById("AddCityDescription").value;
    const cityZipCode = document.getElementById("AddCityZipCode").value;

    // Validation
    if (!cityImage || !cityName || !cityCountryName || !cityTimeZone || !cityDescription || !cityZipCode) {
        alert("Please fill in all fields.");
        return;
    }
    
    const cityNameAlreadyExists = cities.some(city => city.cityName === cityName);
    const zipCodeAlreadyExists = cities.some(city => city.zipCode === cityZipCode);

    if (cityNameAlreadyExists && zipCodeAlreadyExists) {
        alert("City already exists.");
        return;
    }

    // New added city array

    const newCity = {
        image: cityImage,
        cityName: cityName,
        countryName: cityCountryName,
        timeZone: cityTimeZone,
        description: cityDescription,
        zipCode: cityZipCode
    };

    // Add city to API

    try{
        const response = await fetch(urlCitiesAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCity)
        })

        if(response.ok){
            const addedCity = await response.json();
            cities.push(addedCity);
            sessionStorage.setItem("filteredCities", JSON.stringify(cities));
            displayCities();
            
            
            alert("City added successfully");
            const addCityModal = bootstrap.Modal.getInstance(document.getElementById("AddCityModal"));
            addCityModal.hide();
        }
    }

    catch(error){
        console.error("Error: adding city", error);
    }
   
}

// AOS animation on scroll down and scroll up

window.addEventListener('scroll', () => {
    if (window.scrollY < window.prevScrollY) {
      AOS.refresh();
    }
    window.prevScrollY = window.scrollY;
  });











