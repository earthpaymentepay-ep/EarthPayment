/* =========================================
   EARTHPAYMENT HUB
   GLOBAL PULSE
   MASTER JAVASCRIPT
========================================= */

console.log("EarthPayment Global Pulse loaded");


/* =========================================
   GLOBAL DATA PANEL
   VIEW MORE / VIEW LESS
========================================= */

function toggleGlobalPanel(button) {

    const panel = button.closest(".expandable-panel");

    if (!panel) {
        return;
    }

    const expanded = panel.classList.toggle("expanded");

    if (expanded) {

        button.textContent = "View less ↑";

    } else {

        button.textContent = "View more ↓";

    }
}


/* =========================================
   GLOBAL TIME
========================================= */

function updateGlobalTime() {

    const timeElement =
        document.getElementById("global-time");

    if (!timeElement) {
        return;
    }

    const now = new Date();

    const hours =
        String(now.getUTCHours()).padStart(2, "0");

    const minutes =
        String(now.getUTCMinutes()).padStart(2, "0");

    const seconds =
        String(now.getUTCSeconds()).padStart(2, "0");

    timeElement.textContent =
        `🕐 UTC ${hours}:${minutes}:${seconds}`;
}


/* =========================================
   GLOBAL DATA PLACEHOLDERS
========================================= */

const globalData = {

    /* HUMANITY */

    population: "—",
    births: "—",
    deaths: "—",
    internet: "—",

    literacy: "—",
    populationGrowth: "—",
    urban: "—",
    life: "—",
    migration: "—",


    /* PLANET */

    temperature: "—",
    energy: "—",
    co2: "—",
    forest: "—",

    treesPlanted: "—",
    water: "—",
    renewable: "—",
    ice: "—",
    sea: "—",


    /* GLOBAL ECONOMY */

    gdp: "—",
    debt: "—",
    money: "—",
    inflation: "—",

    fdi: "—",
    employment: "—",
    interest: "—",
    spending: "—",
    tradeVolume: "—",


    /* GLOBAL CONNECTIVITY */

    satellites: "—",
    mobile: "—",
    mobileRate: "—",
    servers: "—",

    broadband: "—",
    voice: "—",
    tourism: "—",
    receipts: "—",
    expenditure: "—"

};


/* =========================================
   APPLY GLOBAL DATA
========================================= */

function applyGlobalData() {


    /* HUMANITY */

    setValue(
        "global-population",
        globalData.population
    );

    setValue(
        "global-births",
        globalData.births
    );

    setValue(
        "global-deaths",
        globalData.deaths
    );

    setValue(
        "global-internet",
        globalData.internet
    );

    setValue(
        "global-literacy",
        globalData.literacy
    );

    setValue(
        "global-pop-growth",
        globalData.populationGrowth
    );

    setValue(
        "global-urban",
        globalData.urban
    );

    setValue(
        "global-life",
        globalData.life
    );

    setValue(
        "global-migration",
        globalData.migration
    );


    /* PLANET */

    setValue(
        "global-temperature",
        globalData.temperature
    );

    setValue(
        "global-energy",
        globalData.energy
    );

    setValue(
        "global-co2",
        globalData.co2
    );

    setValue(
        "global-forest",
        globalData.forest
    );

    setValue(
        "global-trees-planted",
        globalData.treesPlanted
    );

    setValue(
        "global-water",
        globalData.water
    );

    setValue(
        "global-renewable",
        globalData.renewable
    );

    setValue(
        "global-ice",
        globalData.ice
    );

    setValue(
        "global-sea",
        globalData.sea
    );


    /* ECONOMY */

    setValue(
        "global-gdp",
        globalData.gdp
    );

    setValue(
        "global-debt",
        globalData.debt
    );

    setValue(
        "global-money",
        globalData.money
    );

    setValue(
        "global-inflation",
        globalData.inflation
    );

    setValue(
        "global-fdi",
        globalData.fdi
    );

    setValue(
        "global-employment",
        globalData.employment
    );

    setValue(
        "global-interest",
        globalData.interest
    );

    setValue(
        "global-spending",
        globalData.spending
    );

    setValue(
        "global-trade-volume",
        globalData.tradeVolume
    );


    /* CONNECTIVITY */

    setValue(
        "connectivity-satellites",
        globalData.satellites
    );

    setValue(
        "connectivity-mobile",
        globalData.mobile
    );

    setValue(
        "connectivity-mobile-rate",
        globalData.mobileRate
    );

    setValue(
        "connectivity-servers",
        globalData.servers
    );

    setValue(
        "connectivity-broadband",
        globalData.broadband
    );

    setValue(
        "connectivity-voice",
        globalData.voice
    );

    setValue(
        "connectivity-tourism",
        globalData.tourism
    );

    setValue(
        "connectivity-receipts",
        globalData.receipts
    );

    setValue(
        "connectivity-expenditure",
        globalData.expenditure
    );

}


/* =========================================
   SAFE VALUE SETTER
========================================= */

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent =
        value !== undefined &&
        value !== null
            ? value
            : "—";
}


/* =========================================
   LIVE WEATHER PLACEHOLDER
========================================= */

function updateGlobalWeather() {

    const weatherElement =
        document.getElementById("global-weather");

    if (!weatherElement) {
        return;
    }

    /*
       Weather API will be connected later.

       For now we intentionally keep
       the value as a placeholder.
    */

    weatherElement.textContent =
        "🌤 —°C";
}


/* =========================================
   LIVE CURRENCY PLACEHOLDER
========================================= */

function updateGlobalCurrency() {

    const currencyElement =
        document.getElementById("global-currency");

    if (!currencyElement) {
        return;
    }

    /*
       Currency API will be connected later.

       For now we intentionally keep
       the value as a placeholder.
    */

    currencyElement.textContent =
        "💱 EUR/USD —";
}


/* =========================================
   GLOBAL DATA UPDATE STATUS
========================================= */

function updateDataStatus() {

    const statusElements =
        document.querySelectorAll(".data-status");

    statusElements.forEach(function(element) {

        element.textContent =
            "● Global Data";

    });

}


/* =========================================
   SEARCH
========================================= */

function initializeGlobalSearch() {

    const searchInput =
        document.querySelector(
            ".hub-search input"
        );

    if (!searchInput) {
        return;
    }

    const cards =
        document.querySelectorAll(
            ".feature-card, .future-card"
        );


    searchInput.addEventListener(
        "input",
        function() {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            cards.forEach(function(card) {

                const text =
                    card.textContent
                        .toLowerCase();


                if (
                    query === "" ||
                    text.includes(query)
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        }
    );

}


/* =========================================
   SMOOTH WORLD NAVIGATION
========================================= */

function initializeNavigation() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    links.forEach(function(link) {

        link.addEventListener(
            "click",
            function(event) {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });

}


/* =========================================
   ACCOUNT BUTTON
========================================= */

function initializeAccountButton() {

    const accountButton =
        document.getElementById(
            "account-button"
        );

    if (!accountButton) {
        return;
    }


    accountButton.addEventListener(
        "click",
        function() {

            /*
               Account / wallet system will
               be connected later.

               We intentionally don't connect
               Supabase or wallet logic here yet.
            */

            console.log(
                "EarthPayment Account clicked"
            );

        }
    );

}


/* =========================================
   INITIALIZE GLOBAL PULSE
========================================= */

function initializeGlobalPulse() {

    console.log(
        "Initializing EarthPayment Global Pulse..."
    );


    /* Apply current placeholder data */

    applyGlobalData();


    /* Header live information */

    updateGlobalTime();

    updateGlobalWeather();

    updateGlobalCurrency();


    /* Other UI */

    updateDataStatus();

    initializeGlobalSearch();

    initializeNavigation();

    initializeAccountButton();


    /* Update UTC clock every second */

    setInterval(
        updateGlobalTime,
        1000
    );


    console.log(
        "EarthPayment Global Pulse ready"
    );

}


/* =========================================
   DOM READY
========================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeGlobalPulse
    );

} else {

    initializeGlobalPulse();

}
