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

        if (data.current) {

            element.textContent =
                `🌤 ${Math.round(data.current.temperature_2m)} °C`;

        }

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

    const element =
        document.getElementById("global-currency");

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

            element.textContent =
                "💱 EUR/USD —";

        }

    } catch (error) {

        console.error("Currency error:", error);

        element.textContent =
            "💱 EUR/USD —";

    }
}

loadCurrency();

setInterval(loadCurrency, 60000);


// =================================
// UTC TIME
// =================================

function updateWorldTime() {

    const element =
        document.getElementById("global-time");

    if (!element) return;

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

    element.textContent =
        `🕐 UTC ${time}`;

}

updateWorldTime();

setInterval(updateWorldTime, 1000);


// =================================
// WORLD BANK
// =================================

async function worldBank(indicator) {

    const url =
        `https://api.worldbank.org/v2/country/WLD/indicator/${indicator}?format=json`;

    const response =
        await fetch(url);

    if (!response.ok) {
        throw new Error(
            `World Bank HTTP ${response.status}`
        );
    }

    const data =
        await response.json();

    if (!data || !data[1]) {
        return null;
    }

    const latest =
        data[1].find(
            item => item.value !== null
        );

    return latest
        ? latest.value
        : null;
}


// =================================
// SET VALUE
// =================================

function setValue(id, value, suffix = "") {

    const element =
        document.getElementById(id);

    if (!element) return;

    if (
        value === null ||
        value === undefined ||
        Number.isNaN(Number(value))
    ) {

        element.textContent = "—";
        return;

    }

    element.textContent =
        `${Number(value).toLocaleString("en-US")}${suffix}`;

}


// =================================
// GLOBAL PULSE
// =================================

async function loadGlobalData() {

    console.log(
        "Loading Global Pulse data..."
    );


    // =================================
    // HUMANITY
    // =================================

    let population = null;


    // POPULATION

    try {

        population =
            await worldBank(
                "SP.POP.TOTL"
            );

        setValue(
            "global-population",
            population
        );

    } catch (error) {

        console.error(
            "Population error:",
            error
        );

    }


    // BIRTHS

    try {

        const birthRate =
            await worldBank(
                "SP.DYN.CBRT.IN"
            );

        if (
            birthRate !== null &&
            population !== null
        ) {

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

        console.error(
            "Births error:",
            error
        );

    }


    // DEATHS

    try {

        const deathRate =
            await worldBank(
                "SP.DYN.CDRT.IN"
            );

        if (
            deathRate !== null &&
            population !== null
        ) {

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

        console.error(
            "Deaths error:",
            error
        );

    }


    // INTERNET USERS

    try {

        const internet =
            await worldBank(
                "IT.NET.USER.ZS"
            );

        if (
            internet !== null &&
            population !== null
        ) {

            const users =
                population *
                internet /
                100;

            setValue(
                "global-internet",
                Math.round(users)
            );

        }

    } catch (error) {

        console.error(
            "Internet users error:",
            error
        );

    }


    // POPULATION GROWTH

    try {

        const growth =
            await worldBank(
                "SP.POP.GROW"
            );

        setValue(
            "global-pop-growth",
            growth,
            "%"
        );

    } catch (error) {

        console.error(
            "Population growth error:",
            error
        );

    }


    // URBAN POPULATION

    try {

        const urban =
            await worldBank(
                "SP.URB.TOTL.IN.ZS"
            );

        setValue(
            "global-urban",
            urban,
            "%"
        );

    } catch (error) {

        console.error(
            "Urban population error:",
            error
        );

    }


    // LIFE EXPECTANCY

    try {

        const life =
            await worldBank(
                "SP.DYN.LE00.IN"
            );

        setValue(
            "global-life",
            life,
            " years"
        );

    } catch (error) {

        console.error(
            "Life expectancy error:",
            error
        );

    }


    // INTERNATIONAL MIGRANTS

    try {

        const migration =
            await worldBank(
                "SM.POP.TOTL"
            );

        setValue(
            "global-migration",
            migration
        );

    } catch (error) {

        console.error(
            "Migration error:",
            error
        );

    }


    // =================================
    // PLANET
    // =================================


    // GLOBAL TEMPERATURE

    try {

        const response =
            await fetch(
                "https://global-warming.org/api/temperature-api"
            );

        const data =
            await response.json();

        if (
            data &&
            data.result &&
            data.result.length
        ) {

            const latest =
                data.result[
                    data.result.length - 1
                ];

            const temperature =
                Number(
                    latest.station
                    || latest.land
                    || latest.temperature
                );

            if (!Number.isNaN(temperature)) {

                setValue(
                    "global-temperature",
                    temperature.toFixed(2),
                    " °C"
                );

            }

        }

    } catch (error) {

        console.error(
            "Temperature error:",
            error
        );

    }


    // ENERGY

    try {

        const energy =
            await worldBank(
                "EG.USE.ELEC.KH.PC"
            );

        setValue(
            "global-energy",
            energy !== null
                ? Math.round(energy)
                : null,
            " kWh/person"
        );

    } catch (error) {

        console.error(
            "Energy error:",
            error
        );

    }


    // CO2

    try {

        const co2 =
            await worldBank(
                "EN.ATM.CO2E.KT"
            );

        setValue(
            "global-co2",
            co2 !== null
                ? Math.round(co2)
                : null,
            " kt"
        );

    } catch (error) {

        console.error(
            "CO2 error:",
            error
        );

    }


 // ---------------------------------
// FOREST LOSS
// ---------------------------------

try {

    // Estimated global forest loss per year
    const forestLossPerYear = 10000000;

    const now = new Date();

    const startOfYear =
        new Date(now.getFullYear(), 0, 1);

    const secondsPassed =
        (now - startOfYear) / 1000;

    const secondsInYear =
        (
            new Date(now.getFullYear() + 1, 0, 1)
            - startOfYear
        ) / 1000;

    const estimatedForestLoss =
        Math.round(
            forestLossPerYear *
            (secondsPassed / secondsInYear)
        );

    setValue(
        "global-forest",
        estimatedForestLoss,
        " ha"
    );

} catch (error) {

    console.error(
        "Forest loss error:",
        error
    );

}   


    // WATER CONSUMPTION

    try {

        const water =
            await worldBank(
                "ER.H2O.FWAG.ZS"
            );

        setValue(
            "global-water",
            water,
            "%"
        );

    } catch (error) {

        console.error(
            "Water error:",
            error
        );

    }


    // RENEWABLE ENERGY

    try {

        const renewable =
            await worldBank(
                "EG.FEC.RNEW.ZS"
            );

        setValue(
            "global-renewable",
            renewable,
            "%"
        );

    } catch (error) {

        console.error(
            "Renewable energy error:",
            error
        );

    }


    // ARCTIC ICE

    try {

        const response =
            await fetch(
                "https://global-warming.org/api/arctic-ice"
            );

        const data =
            await response.json();

        if (
            data &&
            data.result &&
            data.result.length
        ) {

            const latest =
                data.result[
                    data.result.length - 1
                ];

            const ice =
                Number(
                    latest.extent
                    || latest.value
                );

            if (!Number.isNaN(ice)) {

                setValue(
                    "global-ice",
                    ice.toFixed(2),
                    " million km²"
                );

            }

        }

    } catch (error) {

        console.error(
            "Arctic ice error:",
            error
        );

    }


    // SEA LEVEL

    try {

        const response =
            await fetch(
                "https://global-warming.org/api/sea-level"
            );

        const data =
            await response.json();

        if (
            data &&
            data.result &&
            data.result.length
        ) {

            const latest =
                data.result[
                    data.result.length - 1
                ];

            const sea =
                Number(
                    latest.sea_level
                    || latest.value
                );

            if (!Number.isNaN(sea)) {

                setValue(
                    "global-sea",
                    sea.toFixed(2),
                    " mm"
                );

            }

        }

    } catch (error) {

        console.error(
            "Sea level error:",
            error
        );

    }
    // ---------------------------------
// FOREST TREES PLANTED
// ---------------------------------

try {

    // Estimated global trees planted per year
    const treesPerYear = 5000000000;

    const now = new Date();

    const startOfYear =
        new Date(now.getFullYear(), 0, 1);

    const secondsPassed =
        (now - startOfYear) / 1000;

    const secondsInYear =
        (
            new Date(now.getFullYear() + 1, 0, 1)
            - startOfYear
        ) / 1000;

    const estimatedTrees =
        Math.round(
            treesPerYear *
            (secondsPassed / secondsInYear)
        );

    setValue(
        "global-trees",
        estimatedTrees
    );

} catch (error) {

    console.error(
        "Trees planted error:",
        error
    );

}


    // =================================
    // GLOBAL ECONOMY
    // =================================


    // GDP

    try {

        const gdp =
            await worldBank(
                "NY.GDP.MKTP.CD"
            );

        setValue(
            "global-gdp",
            gdp !== null
                ? Math.round(
                    gdp / 1000000000
                )
                : null,
            " B USD"
        );

    } catch (error) {

        console.error(
            "GDP error:",
            error
        );

    }


    // GLOBAL TRADE

    try {

        const trade =
            await worldBank(
                "NE.TRD.GNFS.ZS"
            );

        setValue(
            "global-trade",
            trade,
            "% GDP"
        );

    } catch (error) {

        console.error(
            "Trade error:",
            error
        );

    }


    // MONEY SUPPLY

    try {

        const money =
            await worldBank(
                "FM.LBL.BMNY.GD.ZS"
            );

        setValue(
            "global-money",
            money,
            "% GDP"
        );

    } catch (error) {

        console.error(
            "Money supply error:",
            error
        );

    }


    // INFLATION

    try {

        const inflation =
            await worldBank(
                "FP.CPI.TOTL.ZG"
            );

        setValue(
            "global-inflation",
            inflation,
            "%"
        );

    } catch (error) {

        console.error(
            "Inflation error:",
            error
        );

    }
   // ---------------------------------
// GLOBAL INTEREST RATE
// ---------------------------------

try {

    // Major economies
    const countries = [
        "USA",
        "CHN",
        "JPN",
        "DEU",
        "GBR",
        "IND",
        "BRA",
        "CAN",
        "AUS"
    ];

    const indicator = "FR.INR.LEND";

    const url =
        `https://api.worldbank.org/v2/country/${countries.join(";")}/indicator/${indicator}?format=json&mrnev=1`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Interest rate HTTP ${response.status}`
        );
    }

    const data = await response.json();

    if (
        data &&
        data[1] &&
        data[1].length
    ) {

        const rates = data[1]
            .map(item => Number(item.value))
            .filter(value =>
                Number.isFinite(value)
            );

        if (rates.length) {

            const average =
                rates.reduce(
                    (sum, value) => sum + value,
                    0
                ) / rates.length;

            setValue(
                "global-interest",
                average.toFixed(2),
                "%"
            );

        } else {

            setValue(
                "global-interest",
                null
            );

        }

    } else {

        setValue(
            "global-interest",
            null
        );

    }

} catch (error) {

    console.error(
        "Global interest rate error:",
        error
    );

    setValue(
        "global-interest",
        null
    );

} 


// ---------------------------------
// GLOBAL TRADE VOLUME
// ---------------------------------

try {

    const exportsValue =
        await worldBank("NE.EXP.GNFS.CD");

    const importsValue =
        await worldBank("NE.IMP.GNFS.CD");

    if (
        exportsValue !== null &&
        importsValue !== null
    ) {

        const tradeVolume =
            exportsValue + importsValue;

        setValue(
            "global-trade-volume",
            Math.round(tradeVolume / 1000000000000),
            " T USD"
        );

    } else {

        setValue(
            "global-trade-volume",
            null
        );

    }

} catch (error) {

    console.error(
        "Global trade volume error:",
        error
    );

}


    // GLOBAL EMPLOYMENT

    try {

        const employment =
            await worldBank(
                "SL.UEM.TOTL.ZS"
            );

        setValue(
            "global-employment",
            employment,
            "%"
        );

    } catch (error) {

        console.error(
            "Employment error:",
            error
        );

    }



    // CONSUMER SPENDING

    try {

        const spending =
            await worldBank(
                "NE.CON.PRVT.CD"
            );

        if (spending !== null) {

            setValue(
                "global-spending",
                Math.round(
                    spending / 1000000000
                ),
                " B USD"
            );

        }

    } catch (error) {

        console.error(
            "Consumer spending error:",
            error
        );

    }


    // GLOBAL TRADE VOLUME

    try {

        const tradeVolume =
            await worldBank(
                "NE.TRD.GNFS.CD"
            );

        if (tradeVolume !== null) {

            setValue(
                "global-trade-volume",
                Math.round(
                    tradeVolume / 1000000000
                ),
                " B USD"
            );

        }

    } catch (error) {

        console.error(
            "Trade volume error:",
            error
        );

    }


    console.log(
        "Global Pulse data loaded."
    );

}


// =================================
// LOAD GLOBAL DATA
// =================================

loadGlobalData();

setInterval(
    loadGlobalData,
    600000
);


// =================================
// EXPANDABLE PANELS
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
            "View less ↑";

    } else {

        button.textContent =
            "View more ↓";

    }

}


// =================================
// INITIAL STATE
// =================================

document
    .querySelectorAll(
        ".expandable-panel"
    )
    .forEach(panel => {

        panel.classList.remove(
            "expanded"
        );

    });
