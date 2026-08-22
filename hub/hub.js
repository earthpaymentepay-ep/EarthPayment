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
// =================================
// CO2 ATMOSPHERIC CONCENTRATION
// =================================

try {

    const response =
        await fetch(
            "https://global-warming.org/api/co2-api"
        );

    if (!response.ok) {
        throw new Error(
            `CO2 API HTTP ${response.status}`
        );
    }

    const data =
        await response.json();

    let latestValue = null;

    if (
        data &&
        Array.isArray(data.co2) &&
        data.co2.length
    ) {

        for (
            let i = data.co2.length - 1;
            i >= 0;
            i--
        ) {

            const item =
                data.co2[i];

            const value =
                Number(
                    item.trend ??
                    item.co2 ??
                    item.cycle
                );

            if (
                Number.isFinite(value)
            ) {

                latestValue =
                    value;

                break;

            }

        }

    }

    if (
        Number.isFinite(
            latestValue
        )
    ) {

        setValue(
            "global-co2",
            latestValue.toFixed(2),
            " ppm"
        );

    } else {

        setValue(
            "global-co2",
            null
        );

    }

} catch (error) {

    console.error(
        "CO2 error:",
        error
    );

    setValue(
        "global-co2",
        null
    );

}


    
     // =================================
// FOREST AREA
// =================================

try {

    const forest =
        await worldBank(
            "AG.LND.FRST.K2"
        );

    if (forest !== null) {

        setValue(
            "global-forest",
            Math.round(forest),
            " km²"
        );

    } else {

        setValue(
            "global-forest",
            null
        );

    }

} catch (error) {

    console.error(
        "Forest area error:",
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

    // =================================
// ARCTIC SEA ICE EXTENT
// NSIDC DAILY DATA
// =================================

try {

    const response =
        await fetch(
            "https://noaadata.apps.nsidc.org/NOAA/G02135/north/daily/data/N_seaice_extent_daily_v4.0.csv"
        );

    if (!response.ok) {

        throw new Error(
            `NSIDC Arctic HTTP ${response.status}`
        );

    }

    const text =
        await response.text();

    const lines =
        text
            .trim()
            .split(/\r?\n/);

    let latestValue = null;

    for (
        let i = lines.length - 1;
        i >= 0;
        i--
    ) {

        const line =
            lines[i].trim();

        if (!line) continue;

        const columns =
            line.split(",");

        // Hledáme řádek obsahující
        // datum + hodnotu extentu.

        const numbers =
            columns
                .map(value =>
                    Number(
                        value.trim()
                    )
                )
                .filter(value =>
                    Number.isFinite(value)
                );

        // Arctic extent je přibližně
        // v rozmezí 2–20 million km².
        // Najdeme poslední rozumnou hodnotu.

        const candidate =
            numbers.find(value =>
                value >= 2 &&
                value <= 20
            );

        if (
            Number.isFinite(
                candidate
            )
        ) {

            latestValue =
                candidate;

            break;

        }

    }

    if (
        Number.isFinite(
            latestValue
        )
    ) {

        setValue(
            "global-ice",
            latestValue.toFixed(2),
            " million km²"
        );

    } else {

        setValue(
            "global-ice",
            null
        );

    }

} catch (error) {

    console.error(
        "Arctic ice error:",
        error
    );

    setValue(
        "global-ice",
        null
    );

}                
    
 // =================================
// GLOBAL SEA LEVEL
// NASA / JPL
// =================================

try {

    const response =
        await fetch(
            "https://sealevel.nasa.gov/api/v1/sea-level-data/"
        );

    if (!response.ok) {

        throw new Error(
            `Sea Level API HTTP ${response.status}`
        );

    }

    const data =
        await response.json();

    let latestValue = null;

    function findSeaLevel(obj) {

        if (
            obj === null ||
            obj === undefined
        ) {
            return;
        }

        if (
            typeof obj === "number" &&
            Number.isFinite(obj)
        ) {

            latestValue =
                obj;

            return;

        }

        if (
            typeof obj !== "object"
        ) {
            return;
        }

        const keys =
            Object.keys(obj);

        for (
            let i = keys.length - 1;
            i >= 0;
            i--
        ) {

            const key =
                keys[i];

            const value =
                obj[key];

            if (
                typeof value === "number" &&
                Number.isFinite(value)
            ) {

                latestValue =
                    value;

                return;

            }

        }

        for (
            let i = keys.length - 1;
            i >= 0;
            i--
        ) {

            if (
                latestValue !== null
            ) break;

            findSeaLevel(
                obj[keys[i]]
            );

        }

    }

    findSeaLevel(data);

    if (
        Number.isFinite(
            latestValue
        )
    ) {

        setValue(
            "global-sea",
            latestValue.toFixed(2),
            " mm"
        );

    } else {

        setValue(
            "global-sea",
            null
        );

    }

} catch (error) {

    console.error(
        "Sea level error:",
        error
    );

    setValue(
        "global-sea",
        null
    );

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
    // GLOBAL DEBT
    // ---------------------------------

    try {

        const debt =
            await worldBank(
                "GC.DOD.TOTL.GD.ZS"
            );

        setValue(
            "global-debt",
            debt,
            "% GDP"
        );

    } catch (error) {

        console.error(
            "Global debt error:",
            error
        );

        setValue(
            "global-debt",
            null
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

// =================================
// GLOBAL TRADE VOLUME
// EXPORTS + IMPORTS
// WORLD BANK
// =================================

try {

    const exportResponse =
        await fetch(
            "https://api.worldbank.org/v2/country/WLD/indicator/NE.EXP.GNFS.CD?format=json&per_page=100"
        );

    const importResponse =
        await fetch(
            "https://api.worldbank.org/v2/country/WLD/indicator/NE.IMP.GNFS.CD?format=json&per_page=100"
        );

    if (
        !exportResponse.ok ||
        !importResponse.ok
    ) {

        throw new Error(
            "World Bank trade API error"
        );

    }

    const exportData =
        await exportResponse.json();

    const importData =
        await importResponse.json();

    let exportsValue = null;
    let importsValue = null;

    if (
        exportData &&
        exportData[1]
    ) {

        const latestExport =
            exportData[1].find(
                item =>
                    item.value !== null &&
                    item.value !== undefined
            );

        if (latestExport) {

            exportsValue =
                Number(
                    latestExport.value
                );

        }

    }

    if (
        importData &&
        importData[1]
    ) {

        const latestImport =
            importData[1].find(
                item =>
                    item.value !== null &&
                    item.value !== undefined
            );

        if (latestImport) {

            importsValue =
                Number(
                    latestImport.value
                );

        }

    }

    if (
        Number.isFinite(exportsValue) &&
        Number.isFinite(importsValue)
    ) {

        const tradeVolume =
            exportsValue +
            importsValue;

        setValue(
            "global-trade-volume",
            Math.round(
                tradeVolume /
                1000000000
            ),
            " B USD"
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

    setValue(
        "global-trade-volume",
        null
    );

}
// =================================
// GLOBAL CONNECTIVITY
// =================================

async function loadGlobalConnectivity() {

    console.log(
        "Loading Global Connectivity..."
    );


    // =================================
    // HELPER
    // =================================

    async function wb(indicator) {

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
    // ACTIVE SATELLITES
    // =================================

    try {

        const response =
            await fetch(
                "https://celestrak.org/satcat/records.php?ACTIVE=TRUE&PAYLOADS=TRUE&FORMAT=JSON"
            );

        if (!response.ok) {

            throw new Error(
                `CelesTrak HTTP ${response.status}`
            );

        }

        const data =
            await response.json();

        if (Array.isArray(data)) {

            const satellites =
                data.filter(
                    item =>
                        item.OBJECT_TYPE === "PAY" ||
                        item.TYPE === "PAY"
                );

            const value =
                satellites.length;

            setValue(
                "connectivity-satellites",
                value
            );

        } else {

            setValue(
                "connectivity-satellites",
                null
            );

        }

    } catch (error) {

        console.error(
            "Active satellites error:",
            error
        );

        setValue(
            "connectivity-satellites",
            null
        );

    }


    // =================================
    // MOBILE CONNECTIONS
    // =================================

    try {

        const value =
            await wb(
                "IT.CEL.SETS"
            );

        setValue(
            "connectivity-mobile",
            value !== null
                ? Math.round(value * 1000)
                : null
        );

    } catch (error) {

        console.error(
            "Mobile connections error:",
            error
        );

        setValue(
            "connectivity-mobile",
            null
        );

    }


    // =================================
    // MOBILE PENETRATION
    // =================================

    try {

        const value =
            await wb(
                "IT.CEL.SETS.P2"
            );

        setValue(
            "connectivity-mobile-rate",
            value !== null
                ? value.toFixed(1)
                : null,
            " / 100"
        );

    } catch (error) {

        console.error(
            "Mobile penetration error:",
            error
        );

        setValue(
            "connectivity-mobile-rate",
            null
        );

    }


    // =================================
    // SECURE INTERNET SERVERS
    // =================================

    try {

        const value =
            await wb(
                "IT.NET.SECR.P6"
            );

        setValue(
            "connectivity-servers",
            value !== null
                ? Math.round(value)
                : null,
            " / 1M"
        );

    } catch (error) {

        console.error(
            "Secure servers error:",
            error
        );

        setValue(
            "connectivity-servers",
            null
        );

    }


    // =================================
    // FIXED BROADBAND
    // =================================

    try {

        const value =
            await wb(
                "IT.NET.BBND.P2"
            );

        setValue(
            "connectivity-broadband",
            value !== null
                ? value.toFixed(1)
                : null,
            " / 100"
        );

    } catch (error) {

        console.error(
            "Broadband error:",
            error
        );

        setValue(
            "connectivity-broadband",
            null
        );

    }


    // =================================
    // INTERNATIONAL VOICE TRAFFIC
    // =================================

    try {

        const value =
            await wb(
                "IT.INT.CTRF.MN.PC"
            );

        setValue(
            "connectivity-voice",
            value !== null
                ? value.toFixed(1)
                : null,
            " min/person"
        );

    } catch (error) {

        console.error(
            "Voice traffic error:",
            error
        );

        setValue(
            "connectivity-voice",
            null
        );

    }


    // =================================
    // INTERNATIONAL TOURISM
    // =================================

    try {

        const value =
            await wb(
                "ST.INT.ARVL"
            );

        setValue(
            "connectivity-tourism",
            value !== null
                ? Math.round(
                    value / 1000000
                )
                : null,
            " M"
        );

    } catch (error) {

        console.error(
            "Tourism arrivals error:",
            error
        );

        setValue(
            "connectivity-tourism",
            null
        );

    }


    // =================================
    // TOURISM RECEIPTS
    // =================================

    try {

        const value =
            await wb(
                "ST.INT.RCPT.CD"
            );

        setValue(
            "connectivity-receipts",
            value !== null
                ? Math.round(
                    value / 1000000000
                )
                : null,
            " B USD"
        );

    } catch (error) {

        console.error(
            "Tourism receipts error:",
            error
        );

        setValue(
            "connectivity-receipts",
            null
        );

    }


    // =================================
    // TOURISM EXPENDITURE
    // =================================

    try {

        const value =
            await wb(
                "ST.INT.DPRT"
            );

        setValue(
            "connectivity-expenditure",
            value !== null
                ? Math.round(
                    value / 1000000
                )
                : null,
            " M"
        );

    } catch (error) {

        console.error(
            "Tourism expenditure error:",
            error
        );

        setValue(
            "connectivity-expenditure",
            null
        );

    }


    console.log(
        "Global Connectivity loaded."
    );

}


// =================================
// LOAD
// =================================

loadGlobalConnectivity();


// =================================
// REFRESH
// =================================

setInterval(
    loadGlobalConnectivity,
    600000
);
    
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
