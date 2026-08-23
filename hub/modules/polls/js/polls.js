// ============================================
// EARTHPAYMENT HUB
// POLLS / ASK THE WORLD
// ============================================

console.log("EarthPayment Polls loaded");


// ============================================
// SUPABASE
// ============================================

const SUPABASE_URL =
    "https://pnjxoinimtewqjdmfaza.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_IFMFe9qwEhWJnFchuRB2tA_tmfDQGNa";


// ============================================
// STATE
// ============================================

let currentPoll = null;
let polls = [];

let connectedWallet = null;
let eptBalance = 0;

let currentIdentity = "public";


// ============================================
// SUPABASE REQUEST
// ============================================

async function supabaseRequest(
    table,
    options = {}
) {

    const {
        method = "GET",
        body = null,
        query = ""
    } = options;


    const headers = {

        "apikey": SUPABASE_KEY,

        "Authorization":
            `Bearer ${SUPABASE_KEY}`,

        "Content-Type":
            "application/json",

        "Prefer":
            "return=representation"

    };


    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/${table}${query}`,
            {
                method,
                headers,
                body:
                    body
                        ? JSON.stringify(body)
                        : undefined
            }
        );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Supabase ${response.status}: ${errorText}`
        );

    }


    const text =
        await response.text();


    return text
        ? JSON.parse(text)
        : [];

}


// ============================================
// PUBLIC SESSION ID
// ============================================

function getPublicSessionId() {

    let session =
        localStorage.getItem(
            "earthpayment_poll_session"
        );


    if (!session) {

        session =
            crypto.randomUUID();

        localStorage.setItem(
            "earthpayment_poll_session",
            session
        );

    }


    return session;

}


// ============================================
// IDENTITY
// ============================================

function updateIdentityUI() {

    const type =
        document.getElementById(
            "identity-type"
        );

    const status =
        document.getElementById(
            "identity-status"
        );


    if (!type || !status)
        return;


    if (currentIdentity === "public") {

        type.textContent =
            "🌍 Public";

        status.textContent =
            "Anonymous";

    }


    else if (
        currentIdentity === "verified"
    ) {

        type.textContent =
            "✓ Verified";

        status.textContent =
            "Wallet connected";

    }


    else if (
        currentIdentity === "community"
    ) {

        type.textContent =
            "👥 Community Holder";

        status.textContent =
            `${formatNumber(eptBalance)} EPT`;

    }

}


// ============================================
// EPT CLASSIFICATION
// ============================================

function classifyWallet(balance) {

    eptBalance =
        Number(balance) || 0;


    if (!connectedWallet) {

        currentIdentity =
            "public";

        updateIdentityUI();

        return;

    }


    if (eptBalance > 0) {

        currentIdentity =
            "community";

    }

    else {

        currentIdentity =
            "verified";

    }


    updateIdentityUI();

}


// ============================================
// FORMAT NUMBER
// ============================================

function formatNumber(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 2
        }
    );

}


// ============================================
// ESCAPE HTML
// ============================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ============================================
// LOAD POLLS
// ============================================

async function loadPolls() {

    const container =
        document.getElementById(
            "poll-list"
        );


    if (!container)
        return;


    container.innerHTML =
        `<div class="poll-loading">
            Loading polls...
        </div>`;


    try {

        polls =
            await supabaseRequest(
                "polls",
                {
                    query:
                        "?select=*&status=eq.active&order=created_at.desc"
                }
            );


        renderPolls();

    }

    catch (error) {

        console.error(
            "Poll loading error:",
            error
        );


        container.innerHTML =
            `<div class="poll-error">
                Unable to load polls.
            </div>`;

    }

}


// ============================================
// RENDER POLLS
// ============================================

function renderPolls() {

    const container =
        document.getElementById(
            "poll-list"
        );


    if (!container)
        return;


    if (
        !polls ||
        !polls.length
    ) {

        container.innerHTML =
            `<div class="poll-empty">
                No polls have been created yet.
            </div>`;

        return;

    }


    container.innerHTML = "";


    polls.forEach(
        poll => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "poll-card";


            const votes =
                Number(
                    poll.total_votes || 0
                );


            const status =
                poll.status ||
                "active";


            card.innerHTML = `

                <div class="poll-card-top">

                    <span class="poll-category">
                        ${escapeHTML(
                            poll.category ||
                            "General"
                        )}
                    </span>

                    <span class="poll-status">
                        ● ${escapeHTML(
                            status.toUpperCase()
                        )}
                    </span>

                </div>


                <h3>
                    ${escapeHTML(
                        poll.question
                    )}
                </h3>


                <div class="poll-card-bottom">

                    <span>
                        🗳 ${formatNumber(votes)} votes
                    </span>

                    <button
                        class="poll-primary-button"
                        data-poll-id="${poll.id}"
                        type="button"
                    >
                        Vote
