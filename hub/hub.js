// =================================
// EARTHPAYMENT HUB
// GLOBAL PULSE
// =================================

console.log("EarthPayment Hub loaded");


// =================================
// GLOBAL PULSE - WEATHER
// =================================

async function loadGlobalWeather() {

    const weatherElement =
        document.getElementById("global-weather");

    if (!weatherElement) return;

    try {

        let latitude = 50.08;
        let longitude = 14.44;

        if (navigator.geolocation) {

            try {

                const position = await new Promise(
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

                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

            } catch (error) {

                console.log(
                    "Location unavailable. Using default location."
                );

            }

        }

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
        );

        const data = await response.json();

        const temperature =
            Math.round(data.current.temperature_2m);

        weatherElement.textContent =
            `${temperature} °C`;

    } catch (error) {

        console.error("Weather error:", error);

        weatherElement.textContent =
            "Unavailable";

    }

}

loadGlobalWeather();


// =================================
// CURRENCY - EUR / USD
// =================================

async function loadCurrency() {

    const currencyElement =
        document.getElementById("global-currency");

    if (!currencyElement) return;

    try {

        const response = await fetch(
            "https://api.exchangerate-api.com/v4/latest/EUR"
        );

        const data = await response.json();

        if (
            data &&
            data.rates &&
            data.rates.USD
        ) {

            currencyElement.textContent =
                `💱 EUR/USD ${Number(
                    data.rates.USD
                ).toFixed(4)}`;

        } else {

            currencyElement.textContent =
                "💱 EUR/USD —";

        }

    } catch (error) {

        console.error(
            "Currency error:",
            error
        );

        currencyElement.textContent =
            "💱 EUR/USD —";

    }

}

loadCurrency();

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

    timeElement.textContent =
        `🕐 UTC ${time}`;

}

updateWorldTime();

setInterval(
    updateWorldTime,
    1000
);


// =================================
// WORLD BANK HELPER
// =================================

async function getWorldBankIndicator(
    indicator
) {

    try {

        const response = await fetch(
            `https://api.worldbank.org/v2/country/WLD/indicator/${indicator}?format=json&per_page=100`
        );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

        if (
            !Array.isArray(data) ||
            !data[1]
        ) {
            return null;
        }

        return data[1].find(
            item =>
                item.value !== null &&
                item.value !== undefined
        ) || null;

    } catch (error) {

        console.error(
            `World Bank error (${indicator}):`,
            error
        );

        return null;

    }

}


// =================================
// NUMBER FORMAT
// =================================

function formatNumber(number) {

    if (
        number === null ||
        number === undefined ||
        Number.isNaN(number)
    ) {
        return "—";
    }

    return Number(number).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 0
        }
    );

}


// =================================
// GLOBAL DATA
// =================================

async function loadGlobalData() {

    console.log(
        "Loading global data..."
    );


    // ---------------------------------
    // ELEMENTS
    // ---------------------------------

    const populationElement =
        document.getElementById(
            "global-population"
        );

    const birthsElement =
        document.getElementById(
            "global-births"
        );

    const deathsElement =
        document.getElementById(
            "global-deaths"
        );

    const internetElement =
        document.getElementById(
            "global-internet"
        );

    const populationGrowthElement =
        document.getElementById(
            "global-pop-growth"
        );

    const urbanElement =
        document.getElementById(
            "global-urban"
        );

    const lifeElement =
        document.getElementById(
            "global-life"
        );

    const migrationElement =
        document.getElementById(
            "global-migration"
        );


    // PLANET

    const energyElement =
        document.getElementById(
            "global-energy"
        );

    const co2Element =
        document.getElementById(
            "global-co2"
        );

    const temperatureElement =
        document.getElementById(
            "global-temperature"
        );

    const forestElement =
        document.getElementById(
            "global-forest"
        );


    // ECONOMY

    const gdpElement =
        document.getElementById(
            "global-gdp"
        );

    const tradeElement =
        document.getElementById(
            "global-trade"
        );

    const moneyElement =
        document.getElementById(
            "global-money"
        );

    const inflationElement =
        document.getElementById(
            "global-inflation"
        );

    const employmentElement =
        document.getElementById(
            "global-employment"
        );

    const interestElement =
        document.getElementById(
            "global-interest"
        );

    const spendingElement =
        document.getElementById(
            "global-spending"
        );

    const tradeVolumeElement =
        document.getElementById(
            "global-trade-volume"
        );


    // ---------------------------------
    // POPULATION
    // ---------------------------------

    const populationData =
        await getWorldBankIndicator(
            "SP.POP.TOTL"
        );

    let population = null;

    if (
        populationData &&
        populationData.value
    ) {

        population =
            Number(
                populationData.value
            );

        if (populationElement) {

            populationElement.textContent =
                formatNumber(population);

        }

        // Save for live estimate
        window.globalPopulation =
            population;

        window.globalPopulationYear =
            Number(
                populationData.date
            );

    }


    // ---------------------------------
    // BIRTH RATE
    // ---------------------------------

    const birthRateData =
        await getWorldBankIndicator(
            "SP.DYN.CBRT.IN"
        );

    let birthsPerDay = null;

    if (
        birthRateData &&
        population
    ) {

        const birthRate =
            Number(
                birthRateData.value
            );

        birthsPerDay =
            population *
            birthRate /
            1000 /
            365;

        if (birthsElement) {

            birthsElement.textContent =
                formatNumber(
                    Math.round(
                        birthsPerDay
                    )
                );

        }

        window.globalBirthsPerDay =
            birthsPerDay;

    }


    // ---------------------------------
    // DEATH RATE
    // ---------------------------------

    const deathRateData =
        await getWorldBankIndicator(
            "SP.DYN.CDRT.IN"
        );

    let deathsPerDay = null;

    if (
        deathRateData &&
        population
    ) {

        const deathRate =
            Number(
                deathRateData.value
            );

        deathsPerDay =
            population *
            deathRate /
            1000 /
            365;

        if (deathsElement) {

            deathsElement.textContent =
                formatNumber(
                    Math.round(
                        deathsPerDay
                    )
                );

        }

        window.globalDeathsPerDay =
            deathsPerDay;

    }


    // ---------------------------------
    // INTERNET USERS
    // ---------------------------------

    const internetData =
        await getWorldBankIndicator(
            "IT.NET.USER.ZS"
        );

    if (
        internetData &&
        population &&
        internetElement
    ) {

        const percentage =
            Number(
                internetData.value
            );

        const users =
            population *
            percentage /
            100;

        internetElement.textContent =
            formatNumber(
                Math.round(users)
            );

    }


    // ---------------------------------
    // POPULATION GROWTH
    // ---------------------------------

    const growthData =
        await getWorldBankIndicator(
            "SP.POP.GROW"
        );

    if (
        growthData &&
        populationGrowthElement
    ) {

        populationGrowthElement.textContent =
            `${Number(
                growthData.value
            ).toFixed(2)}% / year`;

    }


    // ---------------------------------
    // URBAN POPULATION
    // ---------------------------------

    const urbanData =
        await getWorldBankIndicator(
            "SP.URB.TOTL.IN.ZS"
        );

    if (
        urbanData &&
        urbanElement
    ) {

        urbanElement.textContent =
            `${Number(
                urbanData.value
            ).toFixed(1)}%`;

    }


    // ---------------------------------
    // LIFE EXPECTANCY
    // ---------------------------------

    const lifeData =
        await getWorldBankIndicator(
            "SP.DYN.LE00.IN"
        );

    if (
        lifeData &&
        lifeElement
    ) {

        lifeElement.textContent =
            `${Number(
                lifeData.value
            ).toFixed(1)} years`;

    }


    // ---------------------------------
    // INTERNATIONAL MIGRANTS
    // ---------------------------------

    const migrationData =
        await getWorldBankIndicator(
            "SM.POP.TOTL"
        );

    if (
        migrationData &&
        migrationElement
    ) {

        migrationElement.textContent =
            formatNumber(
                migrationData.value
            );

    }


    // =================================
    // PLANET
    // =================================

    // ENERGY

    const energyData =
        await getWorldBankIndicator(
            "EG.USE.ELEC.KH.PC"
        );

    if (
        energyData &&
        energyElement
    ) {

        energyElement.textContent =
            `${Math.round(
                energyData.value
            )} kWh/person`;

    }


    // CO2

    const co2Data =
        await getWorldBankIndicator(
            "EN.ATM.CO2E.KT"
        );

    if (
        co2Data &&
        co2Element
    ) {

        co2Element.textContent =
            `${formatNumber(
                co2Data.value
            )} kt`;

    }


    // GLOBAL TEMPERATURE

    if (temperatureElement) {

        temperatureElement.textContent =
            "Live regional";

    }


    // FOREST LOSS

    if (forestElement) {

        forestElement.textContent =
            "Live estimate";

    }


    // =================================
    // GLOBAL ECONOMY
    // =================================

    // GDP

    const gdpData =
        await getWorldBankIndicator(
            "NY.GDP.MKTP.CD"
        );

    if (
        gdpData &&
        gdpElement
    ) {

        const gdp =
            Number(
                gdpData.value
            );

        gdpElement.textContent =
            `$${(
                gdp /
                1000000000000
            ).toFixed(2)} T`;

    }


    // GLOBAL TRADE

    const tradeData =
        await getWorldBankIndicator(
            "NE.TRD.GNFS.ZS"
        );

    if (
        tradeData &&
        tradeElement
    ) {

        tradeElement.textContent =
            `${Number(
                tradeData.value
            ).toFixed(1)}% GDP`;

    }


    // GLOBAL INFLATION

    const inflationData =
        await getWorldBankIndicator(
            "FP.CPI.TOTL.ZG"
        );

    if (
        inflationData &&
        inflationElement
    ) {

        inflationElement.textContent =
            `${Number(
                inflationData.value
            ).toFixed(2)}%`;

    }


    // EMPLOYMENT

    const employmentData =
        await getWorldBankIndicator(
            "SL.UEM.TOTL.ZS"
        );

    if (
        employmentData &&
        employmentElement
    ) {

        employmentElement.textContent =
            `${Number(
                employmentData.value
            ).toFixed(1)}%`;

    }


    console.log(
        "Global data loaded."
    );

}


// =================================
// LIVE POPULATION ESTIMATE
// =================================

function updateLiveEstimates() {

    if (
        !window.globalPopulation ||
        !window.globalPopulationYear
    ) {
        return;
    }


    const now =
        new Date();

    const year =
        now.getUTCFullYear();


    // Number of days elapsed
    const start =
        Date.UTC(
            year,
            0,
            1
        );

    const current =
        now.getTime();

    const daysElapsed =
        (
            current -
            start
        ) /
        86400000;


    // Estimated natural change
    const births =
        window.globalBirthsPerDay ||
        0;

    const deaths =
        window.globalDeathsPerDay ||
        0;


    const netDailyChange =
        births -
        deaths;


    // Move population forward
    // using the latest known value
    const estimatedPopulation =
        window.globalPopulation +
        (
            netDailyChange *
            daysElapsed
        );


    const populationElement =
        document.getElementById(
            "global-population"
        );


    if (
        populationElement &&
        estimatedPopulation > 0
    ) {

        populationElement.textContent =
            formatNumber(
                Math.round(
                    estimatedPopulation
                )
            );

    }


    // ---------------------------------
    // BIRTHS / DEATHS
    // ---------------------------------

    const birthsElement =
        document.getElementById(
            "global-births"
        );

    const deathsElement =
        document.getElementById(
            "global-deaths"
        );


    if (
        birthsElement &&
        births > 0
    ) {

        birthsElement.textContent =
            formatNumber(
                Math.round(
                    births
                )
            );

    }


    if (
        deathsElement &&
        deaths > 0
    ) {

        deathsElement.textContent =
            formatNumber(
                Math.round(
                    deaths
                )
            );

    }

}


// =================================
// GLOBAL DATA LOAD
// =================================

loadGlobalData();


// Update estimates every second
setInterval(
    updateLiveEstimates,
    1000
);


// Refresh source data every 30 minutes
setInterval(
    loadGlobalData,
    1800000
);


// =================================
// EXPANDABLE GLOBAL PANELS
// =================================

function toggleGlobalPanel(button) {

    const panel =
        button.closest(
            ".expandable-panel"
        );

    if (!panel) return;


    panel.classList.toggle(
        "expanded"
    );


    if (
        panel.classList.contains(
            "expanded"
        )
    ) {

        button.textContent =
            "Show less ↑";

    } else {

        button.textContent =
            "View more ↓";

    }

}
