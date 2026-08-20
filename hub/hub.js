// =================================
// EARTHPAYMENT HUB
// GLOBAL PULSE
// =================================

console.log("EarthPayment Hub loaded");


// =================================
// WEATHER
// =================================

async function loadGlobalWeather() {

    const element = document.getElementById("global-weather");

    if (!element) return;

    try {

        let latitude = 50.08;
        let longitude = 14.44;

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
                console.log("Using default weather location.");
            }
        }

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`
        );

        const data = await response.json();

        element.textContent =
            `🌤 ${Math.round(data.current.temperature_2m)} °C`;

    } catch (error) {

        console.error("Weather error:", error);
        element.textContent = "🌤 —";

    }
}

loadGlobalWeather();


// =================================
// EUR / USD
// =================================

async function loadCurrency() {

    const element = document.getElementById("global-currency");

    if (!element) return;

    try {

        const response = await fetch(
            "https://api.exchangerate-api.com/v4/latest/EUR"
        );

        const data = await response.json();

        if (data?.rates?.USD) {

            element.textContent =
                `💱 EUR/USD ${Number(data.rates.USD).toFixed(4)}`;

        } else {

            element.textContent = "💱 EUR/USD —";

        }

    } catch (error) {

        console.error("Currency error:", error);
        element.textContent = "💱 EUR/USD —";

    }
}

loadCurrency();

setInterval(loadCurrency, 60000);


// =================================
// UTC TIME
// =================================

function updateWorldTime() {

    const element = document.getElementById("global-time");

    if (!element) return;

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

    element.textContent = `🕐 UTC ${time}`;
}

updateWorldTime();

setInterval(updateWorldTime, 1000);


// =================================
// GLOBAL DATA HELPERS
// =================================

async function worldBank(indicator) {

    const url =
        `https://api.worldbank.org/v2/country/WLD/indicator/${indicator}?format=json`;

    const response = await fetch(url);

    const data = await response.json();

    if (!data || !data[1]) return null;

    const latest = data[1].find(
        item => item.value !== null
    );

    return latest ? latest.value : null;
}


function setValue(id, value, suffix = "") {

    const element = document.getElementById(id);

    if (!element) return;

    if (value === null || value === undefined) {

        element.textContent = "—";
        return;

    }

    element.textContent =
        `${Number(value).toLocaleString("en-US")}${suffix}`;
}


// =================================
// GLOBAL PULSE DATA
// =================================

async function loadGlobalData() {

    console.log("Loading Global Pulse data...");

    // ---------------------------------
    // POPULATION
    // ---------------------------------

    let population = null;

    try {

        population =
            await worldBank("SP.POP.TOTL");

        setValue(
            "global-population",
            population
        );

    } catch (error) {

        console.error("Population error:", error);

    }


    // ---------------------------------
    // BIRTH RATE
    // ---------------------------------

    try {

        const birthRate =
            await worldBank("SP.DYN.CBRT.IN");

        if (birthRate && population) {

            const birthsPerDay =
                population *
                birthRate /
                1000 /
                365;

            setValue(
                "global-births",
                Math.round(birthsPerDay)
            );

        }

    } catch (error) {

        console.error("Births error:", error);

    }


    // ---------------------------------
    // DEATH RATE
    // ---------------------------------

    try {

        const deathRate =
            await worldBank("SP.DYN.CDRT.IN");

        if (deathRate && population) {

            const deathsPerDay =
                population *
                deathRate /
                1000 /
                365;

            setValue(
                "global-deaths",
                Math.round(deathsPerDay)
            );

        }

    } catch (error) {

        console.error("Deaths error:", error);

    }


    // ---------------------------------
    // INTERNET USERS
    // ---------------------------------

    try {

        const internet =
            await worldBank("IT.NET.USER.ZS");

        if (internet && population) {

            const users =
                population * internet / 100;

            setValue(
                "global-internet",
                Math.round(users)
            );

        }

    } catch (error) {

        console.error("Internet users error:", error);

    }


    // =================================
    // HUMANITY - MORE
    // =================================

    try {

        const growth =
            await worldBank("SP.POP.GROW");

        setValue(
            "global-pop-growth",
            growth,
            "%"
        );

    } catch (error) {

        console.error("Population growth error:", error);

    }


    try {

        const urban =
            await worldBank("SP.URB.TOTL.IN.ZS");

        setValue(
            "global-urban",
            urban,
            "%"
        );

    } catch (error) {

        console.error("Urban population error:", error);

    }


    try {

        const life =
            await worldBank("SP.DYN.LE00.IN");

        setValue(
            "global-life",
            life,
            " years"
        );

    } catch (error) {

        console.error("Life expectancy error:", error);

    }


    try {

        const migration =
            await worldBank("SM.POP.TOTL");

        setValue(
            "global-migration",
            migration
        );

    } catch (error) {

        console.error("Migration error:", error);

    }


    // =================================
    // PLANET
    // =================================

    try {

        const energy =
            await worldBank("EG.USE.ELEC.KH.PC");

        setValue(
            "global-energy",
            Math.round(energy),
            " kWh/person"
        );

    } catch (error) {

        console.error("Energy error:", error);

    }


    try {

        const co2 =
            await worldBank("EN.ATM.CO2E.KT");

        setValue(
            "global-co2",
            Math.round(co2),
            " kt"
        );

    } catch (error) {

        console.error("CO2 error:", error);

    }


    // =================================
    // ECONOMY
    // =================================

    try {

        const gdp =
            await worldBank("NY.GDP.MKTP.CD");

        setValue(
            "global-gdp",
            Math.round(gdp / 1000000000),
            " B USD"
        );

    } catch (error) {

        console.error("GDP error:", error);

    }


    try {

        const trade =
            await worldBank("NE.TRD.GNFS.ZS");

        setValue(
            "global-trade",
            trade,
            "% GDP"
        );

    } catch (error) {

        console.error("Trade error:", error);

    }


    try {

        const inflation =
            await worldBank("FP.CPI.TOTL.ZG");

        setValue(
            "global-inflation",
            inflation,
            "%"
        );

    } catch (error) {

        console.error("Inflation error:", error);

    }


    console.log("Global Pulse data loaded.");

}


// =================================
// LOAD GLOBAL DATA
// =================================

loadGlobalData();


// Refresh every 10 minutes
setInterval(
    loadGlobalData,
    600000
);


// =================================
// EXPANDABLE GLOBAL PANELS
// =================================

function toggleGlobalPanel(button) {

    const panel =
        button.closest(".expandable-panel");

    if (!panel) return;

    panel.classList.toggle("expanded");

    if (panel.classList.contains("expanded")) {

        button.textContent =
            "View less ↑";

    } else {

        button.textContent =
            "View more ↓";

    }

}


// =================================
// INITIAL STATE
// =================================

document.querySelectorAll(
    ".expandable-panel"
).forEach(panel => {

    panel.classList.remove("expanded");

});
