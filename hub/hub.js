// =================================
// EARTHPAYMENT HUB
// GLOBAL PULSE
// =================================

console.log("EarthPayment Hub loaded");



// =================================
// GLOBAL PULSE - WEATHER
// =================================

async function loadGlobalWeather() {

    const weatherElement = document.getElementById("global-weather");

    if (!weatherElement) return;

    try {

        // Default location
        let latitude = 50.08;
        let longitude = 14.44;

        // Try to get visitor location
        if (navigator.geolocation) {

            try {

                const position = await new Promise((resolve, reject) => {

                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        reject,
                        {
                            timeout: 5000,
                            maximumAge: 600000
                        }
                    );

                });

                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

            } catch (error) {

                console.log("Location unavailable. Using default location.");

            }

        }


        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
        );

        const data = await response.json();

        const temperature = Math.round(
            data.current.temperature_2m
        );

        weatherElement.textContent = `${temperature} °C`;

    } catch (error) {

        console.error("Weather error:", error);

        weatherElement.textContent = "Unavailable";

    }

}


// Load weather
loadGlobalWeather();


// =================================
// =================================
// CURRENCY - EUR / USD
// =================================

async function loadCurrency() {

    const currencyElement =
        document.getElementById("global-currency");

    if (!currencyElement) {
        console.log("EUR/USD element not found");
        return;
    }

    currencyElement.textContent = "Loading...";

    try {

        const response = await fetch(
            "https://api.exchangerate-api.com/v4/latest/EUR"
        );

        console.log("Currency response:", response.status);

        const data = await response.json();

        console.log("Currency data:", data);

        if (data && data.rates && data.rates.USD) {

            currencyElement.textContent =
                Number(data.rates.USD).toFixed(4);

        } else {

            currencyElement.textContent = "No data";

        }

    } catch (error) {

        console.error("Currency error:", error);

        currencyElement.textContent = "API error";

    }
}
// Load currency
loadCurrency();

// Update every minute
setInterval(
    loadCurrency,
    60000
);


// =================================
// WORLD TIME
// =================================

function updateWorldTime() {

    const timeElement =
        document.getElementById("global-time");

    if (!timeElement) return;

    const now = new Date();

    const time = now.toLocaleTimeString(
        "en-GB",
        {
            timeZone: "UTC",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );

    timeElement.textContent =
        `UTC ${time}`;
}


// Update every second
updateWorldTime();

setInterval(
    updateWorldTime,
    1000
);

            
// =================================
// GLOBAL DATA
// =================================

async function loadGlobalData() {

    const populationElement =
        document.getElementById("global-population");

    const birthsElement =
        document.getElementById("global-births");

    const energyElement =
        document.getElementById("global-energy");

    const co2Element =
        document.getElementById("global-co2");


    // ---------------------------------
    // WORLD POPULATION
    // ---------------------------------

    try {

        const response = await fetch(
            "https://ourworldindata.org/grapher/population.csv"
        );

        const csv = await response.text();

        const rows = csv.trim().split("\n");

        const headers = rows[0].split(",");

        const entityIndex = headers.indexOf("Entity");
        const populationIndex = headers.indexOf("Population");

        let worldPopulation = null;

        for (let i = rows.length - 1; i > 0; i--) {

            const columns = rows[i].split(",");

            if (
                columns[entityIndex] === "World" &&
                columns[populationIndex]
            ) {

                worldPopulation =
                    Number(columns[populationIndex]);

                break;
            }
        }

        if (worldPopulation && populationElement) {

            populationElement.textContent =
                formatGlobalNumber(worldPopulation);

        }

    } catch (error) {

        console.error("Population error:", error);

        if (populationElement) {
            populationElement.textContent = "Unavailable";
        }

    }


    // ---------------------------------
    // BIRTHS
    // ---------------------------------

    try {

        const response = await fetch(
       https://ourworldindata.org/grapher/number-of-births-per-year.csv     
        );

        const csv = await response.text();

        const rows = csv.trim().split("\n");

        const headers = rows[0].split(",");

        const entityIndex = headers.indexOf("Entity");
        const birthsIndex = headers.indexOf("Births");

        let worldBirths = null;

        for (let i = rows.length - 1; i > 0; i--) {

            const columns = rows[i].split(",");

            if (
                columns[entityIndex] === "World" &&
                columns[birthsIndex]
            ) {

                worldBirths =
                    Number(columns[birthsIndex]);

                break;
            }
        }

        if (worldBirths && birthsElement) {

            const birthsToday =
                Math.round(worldBirths / 365);

            birthsElement.textContent =
                formatGlobalNumber(birthsToday);

        }

    } catch (error) {

        console.error("Births error:", error);

        if (birthsElement) {
            birthsElement.textContent = "Unavailable";
        }

    }


    // ---------------------------------
    // ENERGY
    // ---------------------------------

    try {

        const response = await fetch(
        https://ourworldindata.org/grapher/per-capita-energy-use.csv    
        );

        const csv = await response.text();

        const rows = csv.trim().split("\n");

        const headers = rows[0].split(",");

        const entityIndex = headers.indexOf("Entity");

        const valueIndex =
            headers.findIndex(header =>
                header !== "Entity" &&
                header !== "Code" &&
                header !== "Year"
            );

        let worldEnergy = null;

        for (let i = rows.length - 1; i > 0; i--) {

            const columns = rows[i].split(",");

            if (
                columns[entityIndex] === "World" &&
                columns[valueIndex]
            ) {

                worldEnergy =
                    Number(columns[valueIndex]);

                break;
            }
        }

        if (worldEnergy && energyElement) {

            energyElement.textContent =
                `${Math.round(worldEnergy).toLocaleString("en-US")} kWh/person`;

        }

    } catch (error) {

        console.error("Energy error:", error);

        if (energyElement) {
            energyElement.textContent = "Unavailable";
        }

    }


    // ---------------------------------
    // CO2
    // ---------------------------------

    try {

        const response = await fetch(
            "https://ourworldindata.org/grapher/annual-co2-emissions-per-country.csv"
        );

        const csv = await response.text();

        const rows = csv.trim().split("\n");

        const headers = rows[0].split(",");

        const entityIndex = headers.indexOf("Entity");

        const valueIndex =
            headers.findIndex(header =>
                header !== "Entity" &&
                header !== "Code" &&
                header !== "Year"
            );

        let worldCO2 = null;

        for (let i = rows.length - 1; i > 0; i--) {

            const columns = rows[i].split(",");

            if (
                columns[entityIndex] === "World" &&
                columns[valueIndex]
            ) {

                worldCO2 =
                    Number(columns[valueIndex]);

                break;
            }
        }

        if (worldCO2 && co2Element) {

            worldCO2 =
                worldCO2 / 1000000000;

            co2Element.textContent =
                `${worldCO2.toFixed(2)} Gt`;

        }

    } catch (error) {

        console.error("CO2 error:", error);

        if (co2Element) {
            co2Element.textContent = "Unavailable";
        }

    }

}


// =================================
// FORMAT GLOBAL NUMBERS
// =================================

function formatGlobalNumber(number) {

    if (number === null || number === undefined) {
        return "—";
    }

    if (number >= 1000000000) {

        return (
            (number / 1000000000).toFixed(2) +
            " B"
        );

    }

    if (number >= 1000000) {

        return (
            (number / 1000000).toFixed(2) +
            " M"
        );

    }

    if (number >= 1000) {

        return (
            (number / 1000).toFixed(1) +
            " K"
        );

    }

    return Number(number).toLocaleString("en-US");

}


// =================================
// LOAD GLOBAL DATA
// =================================

loadGlobalData();
        
            


    


