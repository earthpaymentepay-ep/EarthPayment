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
