// =================================
// EARTHPAYMENT HUB
// GLOBAL PULSE
// =================================

console.log("EarthPayment Hub loaded");


// =================================
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

loadGlobalWeather();


// =================================
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

loadCurrency();

setInterval(
    loadCurrency,
    60000
);


// =================================
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

updateWorldTime();

setInterval(
    updateWorldTime,
    1000
);


// =================================
// WORLD BANK
// =================================

async function worldBank(indicator) {

    const url =
        `https://api.worldbank.org/v2/country/WLD/indicator/${indicator}?format=json&per_page=100`;

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            `World Bank HTTP ${response.status}`
        );

    }

    const data =
        await response.json();

    if (
        !data ||
        !data[1]
    ) {

        return null;

    }

    const latest =
        data[1].find(
            item =>
                item.value !== null &&
                item.value !== undefined
        );

    return latest
        ? Number(latest.value)
        : null;

}


// =================================
// SET VALUE
// =================================

function setValue(
    id,
    value,
    suffix = ""
) {

    const element =
        document.getElementById(id);

    if (!element) return;

    if (
        value === null ||
        value === undefined ||
        Number.isNaN(Number(value))
    ) {

        element.textContent =
            "—";

        return;

    }

    element.textContent =
        `${Number(value).toLocaleString(
            "en-US"
        )}${suffix}`;

}


// =================================
// HUMANITY
// =================================

async function loadHumanity() {

    let population = null;


    // ---------------------------------
    // POPULATION
    // ---------------------------------

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


    // ---------------------------------
    // BIRTHS
    // ---------------------------------

    try {

        const birthRate =
            await worldBank(
                "SP.DYN.CBRT.IN"
            );

        if (
            birthRate !== null &&
            population !== null
        ) {

            const births =
                population *
                birthRate /
                1000 /
                365;

            setValue(
                "global-births",
                Math.round(births)
            );

        }

    } catch (error) {

        console.error(
            "Births error:",
            error
        );

    }


    // ---------------------------------
    // DEATHS
    // ---------------------------------

    try {

        const deathRate =
            await worldBank(
                "SP.DYN.CDRT.IN"
            );

        if (
            deathRate !== null &&
            population !== null
        ) {

            const deaths =
                population *
                deathRate /
                1000 /
                365;

            setValue(
                "global-deaths",
                Math.round(deaths)
            );

        }

    } catch (error) {

        console.error(
            "Deaths error:",
            error
        );

    }


    // ---------------------------------
    // INTERNET USERS
    // ---------------------------------

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


    // ---------------------------------
    // LITERACY RATE
    // ---------------------------------

    try {

        const literacy =
            await worldBank(
                "SE.ADT.LITR.ZS"
            );

        setValue(
            "global-literacy",
            literacy,
            "%"
        );

    } catch (error) {

        console.error(
            "Literacy error:",
            error
        );

    }


    // ---------------------------------
    // POPULATION GROWTH
    // ---------------------------------

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


    // ---------------------------------
    // URBAN POPULATION
    // ---------------------------------

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


    // ---------------------------------
    // LIFE EXPECTANCY
    // ---------------------------------

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


    // ---------------------------------
    // INTERNATIONAL MIGRANTS
    // ---------------------------------

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

}


// =================================
// PLANET
// =================================

async function loadPlanet() {


    // ---------------------------------
    // GLOBAL TEMPERATURE
    // ---------------------------------

    try {

        const response =
            await fetch(
                "https://global-warming.org/api/temperature-api"
            );

        if (!response.ok)
            throw new Error("Temperature API error");

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
                    latest.station ??
                    latest.land ??
                    latest.temperature
                );

            if (
                !Number.isNaN(
                    temperature
                )
            ) {

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


    // ---------------------------------
    // ENERGY CONSUMPTION
    // ---------------------------------

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


    // ---------------------------------
    // CO2
    // ---------------------------------

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

        const response =
            await fetch(
                "https://api.globalforestwatch.org/v2/forest-loss"
            );

        if (response.ok) {

            const data =
                await response.json();

            const value =
                data?.value ??
                data?.result?.value ??
                data?.data?.value;

            if (
                value !== undefined &&
                value !== null
            ) {

                setValue(
                    "global-forest",
                    value,
                    " ha"
                );

            }

        }

    } catch (error) {

        console.error(
            "Forest loss error:",
            error
        );

    }


    // ---------------------------------
    // TREES PLANTED
    // ---------------------------------

    try {

        const treesPerYear =
            5000000000;

        const now =
            new Date();

        const startOfYear =
            new Date(
                now.getFullYear(),
                0,
                1
            );

        const startNextYear =
            new Date(
                now.getFullYear() + 1,
                0,
                1
            );

        const secondsPassed =
            (
                now -
                startOfYear
            ) / 1000;

        const secondsInYear =
            (
                startNextYear -
                startOfYear
            ) / 1000;

        const estimatedTrees =
            Math.round(
                treesPerYear *
                (
                    secondsPassed /
                    secondsInYear
                )
            );

        // IMPORTANT:
        // HTML uses global-trees-planted

        setValue(
            "global-trees-planted",
            estimatedTrees
        );

    } catch (error) {

        console.error(
            "Trees planted error:",
            error
        );

    }


    // ---------------------------------
    // WATER CONSUMPTION
    // ---------------------------------

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


    // ---------------------------------
    // RENEWABLE ENERGY
    // ---------------------------------

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


    // ---------------------------------
    // ARCTIC ICE
    // ---------------------------------

    try {

        const response =
            await fetch(
                "https://global-warming.org/api/arctic-ice"
            );

        if (!response.ok)
            throw new Error("Arctic API error");

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
                    latest.extent ??
                    latest.value
                );

            if (
                !Number.isNaN(ice)
            ) {

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


    // ---------------------------------
    // SEA LEVEL
    // ---------------------------------

    try {

        const response =
            await fetch(
                "https://global-warming.org/api/sea-level"
            );

        if (!response.ok)
            throw new Error("Sea level API error");

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
                    latest.sea_level ??
                    latest.value
                );

            if (
                !Number.isNaN(sea)
            ) {

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

}


// =================================
// ECONOMY
// =================================

async function loadEconomy() {


    // ---------------------------------
    // GDP
    // ---------------------------------

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


    // ---------------------------------
    // GLOBAL TRADE
    // ---------------------------------

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
            "Global trade error:",
            error
        );

    }


    // ---------------------------------
    // MONEY SUPPLY
    // ---------------------------------

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


    // ---------------------------------
    // INFLATION
    // ---------------------------------

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
    // FDI
    // ---------------------------------

    try {

        const fdi =
            await worldBank(
                "BX.KLT.DINV.CD.WD"
            );

        setValue(
            "global-fdi",
            fdi !== null
                ? Math.round(
                    fdi / 1000000000
                )
                : null,
            " B USD"
        );

    } catch (error) {

        console.error(
            "FDI error:",
            error
        );

    }


    // ---------------------------------
    // GLOBAL EMPLOYMENT
    // ---------------------------------

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


    // ---------------------------------
    // GLOBAL INTEREST RATE
    // ---------------------------------

    try {

        const countries =
            "USA;CHN;JPN;DEU;IND;GBR;FRA;ITA;BRA;CAN;AUS;KOR;MEX;IDN;TUR;SAU;ZAF";

        const response =
            await fetch(
                `https://api.worldbank.org/v2/country/${countries}/indicator/FR.INR.LEND?format=json&per_page=500`
            );

        if (!response.ok)
            throw new Error(
                "Interest rate API error"
            );

        const data =
            await response.json();

        if (
            data &&
            data[1]
        ) {

            const latestRates = {};

            data[1].forEach(
                item => {

                    if (
                        item.value !== null &&
                        item.value !== undefined &&
                        !latestRates[
                            item.countryiso3code
                        ]
                    ) {

                        latestRates[
                            item.countryiso3code
                        ] = Number(
                            item.value
                        );

                    }

                }
            );

            const values =
                Object.values(
                    latestRates
                ).filter(
                    value =>
                        !Number.isNaN(value)
                );

            if (values.length) {

                const average =
                    values.reduce(
                        (
                            sum,
                            value
                        ) =>
                            sum + value,
                        0
                    ) /
                    values.length;

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

        }

    } catch (error) {

        console.error(
            "Interest rate error:",
            error
        );

    }


    // ---------------------------------
    // CONSUMER SPENDING
    // ---------------------------------

    try {

        const spending =
            await worldBank(
                "NE.CON.PRVT.CD"
            );

        setValue(
            "global-spending",
            spending !== null
                ? Math.round(
                    spending /
                    1000000000
                )
                : null,
            " B USD"
        );

    } catch (error) {

        console.error(
            "Consumer spending error:",
            error
        );

    }


    // ---------------------------------
    // GLOBAL TRADE VOLUME
    // ---------------------------------

    try {

        const tradeVolume =
            await worldBank(
                "NE.TRD.GNFS.CD"
            );

        setValue(
            "global-trade-volume",
            tradeVolume !== null
                ? Math.round(
                    tradeVolume /
                    1000000000
                )
                : null,
            " B USD"
        );

    } catch (error) {

        console.error(
            "Trade volume error:",
            error
        );

    }

}


// =================================
// LOAD EVERYTHING
// =================================

async function loadGlobalData() {

    console.log(
        "Loading Global Pulse data..."
    );

    // Run sections independently.
    // One failed API will not break
    // the other sections.

    await Promise.allSettled([

        loadHumanity(),

        loadPlanet(),

        loadEconomy()

    ]);

    console.log(
        "Global Pulse data loaded."
    );

}

loadGlobalData();


// =================================
// REFRESH
// =================================

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

    const isExpanded =
        panel.classList.toggle(
            "expanded"
        );

    button.textContent =
        isExpanded
            ? "View less ↑"
            : "View more ↓";

}


// =================================
// INITIAL STATE
// =================================

function initializeGlobalPanels() {

    document
        .querySelectorAll(
            ".expandable-panel"
        )
        .forEach(
            panel => {

                panel.classList.remove(
                    "expanded"
                );

                const button =
                    panel.querySelector(
                        ".global-expand-button"
                    );

                if (button) {

                    button.textContent =
                        "View more ↓";

                }

            }
        );

}


// =================================
// DOM READY
// =================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeGlobalPanels
    );

} else {

    initializeGlobalPanels();

}


// =================================
// END
// =================================

console.log(
    "EarthPayment Global Pulse ready."
);
