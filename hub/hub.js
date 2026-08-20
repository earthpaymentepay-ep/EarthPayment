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

    const populationElement = document.getElementById("global-population");
    const birthsElement = document.getElementById("global-births");
    const energyElement = document.getElementById("global-energy");
    const co2Element = document.getElementById("global-co2");

    // Default values
    if (populationElement) populationElement.textContent = "—";
    if (birthsElement) birthsElement.textContent = "—";
    if (energyElement) energyElement.textContent = "—";
    if (co2Element) co2Element.textContent = "—";


    try {

        const response = await fetch(
            "https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL?format=json"
        );

        const data = await response.json();

        if (data && data[1]) {

            const latest = data[1].find(
                item => item.value !== null
            );

            if (latest && populationElement) {

                populationElement.textContent =
                    Number(latest.value).toLocaleString("en-US");

            }

        }

    } catch (error) {

        console.error("Population error:", error);

    }


    // -----------------------------
    // BIRTHS
    // -----------------------------

    try {

        const response = await fetch(
            "https://api.worldbank.org/v2/country/WLD/indicator/SP.DYN.CBRT.IN?format=json"
        );

        const data = await response.json();

        if (data && data[1]) {

            const latest = data[1].find(
                item => item.value !== null
            );

            if (latest && birthsElement) {

                const birthRate = latest.value;

                const population =
                    populationElement
                    ? Number(
                        populationElement.textContent
                            .replace(/,/g, "")
                    )
                    : 0;

                if (population) {

                    const birthsToday =
                        Math.round(
                            population *
                            birthRate /
                            1000 /
                            365
                        );

                    birthsElement.textContent =
                        birthsToday.toLocaleString("en-US");

                }

            }

        }

    } catch (error) {

        console.error("Births error:", error);

    }


    // -----------------------------
    // ENERGY
    // -----------------------------

    try {

        const response = await fetch(
            "https://api.worldbank.org/v2/country/WLD/indicator/EG.USE.ELEC.KH.PC?format=json"
        );

        const data = await response.json();

        if (data && data[1]) {

            const latest = data[1].find(
                item => item.value !== null
            );

            if (latest && energyElement) {

                energyElement.textContent =
                    Math.round(latest.value) + " kWh/person";

            }

        }

    } catch (error) {

        console.error("Energy error:", error);

    }


    // -----------------------------
    // CO2
    // -----------------------------

    try {

        const response = await fetch(
            "https://api.worldbank.org/v2/country/WLD/indicator/EN.ATM.CO2E.KT?format=json"
        );

        const data = await response.json();

        if (data && data[1]) {

            const latest = data[1].find(
                item => item.value !== null
            );

            if (latest && co2Element) {

                co2Element.textContent =
                    Number(latest.value).toLocaleString("en-US")
                    + " kt";

            }

        }

    } catch (error) {

        console.error("CO₂ error:", error);

    }

}


// Load Global Data
loadGlobalData();


// Refresh every 10 minutes
setInterval(
    loadGlobalData,
    600000
);

// =================================
// GLOBAL DATA
// =================================

async function loadGlobalData() {

    const populationElement = document.getElementById("global-population");
    const birthsElement = document.getElementById("global-births");
    const energyElement = document.getElementById("global-energy");
    const co2Element = document.getElementById("global-co2");

    // Default values
    if (populationElement) populationElement.textContent = "—";
    if (birthsElement) birthsElement.textContent = "—";
    if (energyElement) energyElement.textContent = "—";
    if (co2Element) co2Element.textContent = "—";


    try {

        const response = await fetch(
            "https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL?format=json"
        );

        const data = await response.json();

        if (data && data[1]) {

            const latest = data[1].find(
                item => item.value !== null
            );

            if (latest && populationElement) {

                populationElement.textContent =
                    Number(latest.value).toLocaleString("en-US");

            }

        }

    } catch (error) {

        console.error("Population error:", error);

    }


    // -----------------------------
    // BIRTHS
    // -----------------------------

    try {

        const response = await fetch(
            "https://api.worldbank.org/v2/country/WLD/indicator/SP.DYN.CBRT.IN?format=json"
        );

        const data = await response.json();

        if (data && data[1]) {

            const latest = data[1].find(
                item => item.value !== null
            );

            if (latest && birthsElement) {

                const birthRate = latest.value;

                const population =
                    populationElement
                    ? Number(
                        populationElement.textContent
                            .replace(/,/g, "")
                    )
                    : 0;

                if (population) {

                    const birthsToday =
                        Math.round(
                            population *
                            birthRate /
                            1000 /
                            365
                        );

                    birthsElement.textContent =
                        birthsToday.toLocaleString("en-US");

                }

            }

        }

    } catch (error) {

        console.error("Births error:", error);

    }


    // -----------------------------
    // ENERGY
    // -----------------------------

    try {

        const response = await fetch(
            "https://api.worldbank.org/v2/country/WLD/indicator/EG.USE.ELEC.KH.PC?format=json"
        );

        const data = await response.json();

        if (data && data[1]) {

            const latest = data[1].find(
                item => item.value !== null
            );

            if (latest && energyElement) {

                energyElement.textContent =
                    Math.round(latest.value) + " kWh/person";

            }

        }

    } catch (error) {

        console.error("Energy error:", error);

    }


    // -----------------------------
    // CO2
    // -----------------------------

    try {

        const response = await fetch(
            "https://api.worldbank.org/v2/country/WLD/indicator/EN.ATM.CO2E.KT?format=json"
        );

        const data = await response.json();

        if (data && data[1]) {

            const latest = data[1].find(
                item => item.value !== null
            );

            if (latest && co2Element) {

                co2Element.textContent =
                    Number(latest.value).toLocaleString("en-US")
                    + " kt";

            }

        }

    } catch (error) {

        console.error("CO₂ error:", error);

    }

}


// Load Global Data
loadGlobalData();


// Refresh every 10 minutes
setInterval(
    loadGlobalData,
    600000
);        
  
