const searchInput = document.getElementById("toolSearch");
const toolCards = document.querySelectorAll(".tool-card");
const noTools = document.getElementById("noTools");
const toolCount = document.getElementById("toolCount");


function searchTools() {

    const query = searchInput.value
        .toLowerCase()
        .trim();

    let visibleTools = 0;


    toolCards.forEach(card => {

        const name = card.dataset.name
            .toLowerCase();

        if (name.includes(query)) {

            card.classList.remove("hidden");

            visibleTools++;

        } else {

            card.classList.add("hidden");

        }

    });


    if (visibleTools === 0) {

        noTools.style.display = "block";

    } else {

        noTools.style.display = "none";

    }


    if (query === "") {

        toolCount.textContent =
            toolCards.length + " tools";

    } else {

        toolCount.textContent =
            visibleTools + " tools found";

    }

}


searchInput.addEventListener(
    "input",
    searchTools
);


// =================================
// MINI GLOBAL DATA
// WEATHER
// =================================

async function loadGlobalWeather() {

    const element =
        document.getElementById("global-weather");

    if (!element) return;

    try {

        let latitude = 50.08;
        let longitude = 14.44;

        if (navigator.geolocation) {

            try {

                const position =
                    await new Promise(
                        (resolve, reject) => {

                            navigator.geolocation.getCurrentPosition(
                                resolve,
                                reject,
                                {
                                    timeout: 5000,
                                    maximumAge: 600000
                                }
                            );

                        }
                    );

                latitude =
                    position.coords.latitude;

                longitude =
                    position.coords.longitude;

            } catch (error) {

                console.log(
                    "Using default weather location."
                );

            }

        }

        const response =
            await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`
            );

        if (!response.ok)
            throw new Error("Weather API error");

        const data =
            await response.json();

        if (
            data &&
            data.current &&
            data.current.temperature_2m !== undefined
        ) {

            element.textContent =
                `🌤 ${Math.round(
                    data.current.temperature_2m
                )} °C`;

        } else {

            element.textContent =
                "🌤 —";

        }

    } catch (error) {

        console.error(
            "Weather error:",
            error
        );

        element.textContent =
            "🌤 —";

    }

}


// =================================
// MINI GLOBAL DATA
// EUR / USD
// =================================

async function loadCurrency() {

    const element =
        document.getElementById(
            "global-currency"
        );

    if (!element) return;

    try {

        const response =
            await fetch(
                "https://api.exchangerate-api.com/v4/latest/EUR"
            );

        if (!response.ok)
            throw new Error("Currency API error");

        const data =
            await response.json();

        if (
            data &&
            data.rates &&
            data.rates.USD
        ) {

            element.textContent =
                `💱 EUR/USD ${Number(
                    data.rates.USD
                ).toFixed(4)}`;

        } else {

            element.textContent =
                "💱 EUR/USD —";

        }

    } catch (error) {

        console.error(
            "Currency error:",
            error
        );

        element.textContent =
            "💱 EUR/USD —";

    }

}


// =================================
// MINI GLOBAL DATA
// UTC TIME
// =================================

function updateWorldTime() {

    const element =
        document.getElementById(
            "global-time"
        );

    if (!element) return;

    const now =
        new Date();

    const time =
        now.toLocaleTimeString(
            "en-GB",
            {
                timeZone: "UTC",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    element.textContent =
        `🕐 UTC ${time}`;

}


// =================================
// INITIALIZE MINI GLOBAL DATA
// =================================

function initializeMiniGlobalData() {

    loadGlobalWeather();

    loadCurrency();

    updateWorldTime();

    setInterval(
        updateWorldTime,
        1000
    );

    setInterval(
        loadCurrency,
        60000
    );

}

initializeMiniGlobalData();
