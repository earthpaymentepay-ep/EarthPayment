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
