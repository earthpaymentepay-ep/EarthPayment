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

function classifyWallet(
    balance
) {

    eptBalance =
        Number(balance) || 0;


    if (!connectedWallet) {

        currentIdentity =
            "public";

        return;

    }


    if (
        eptBalance > 0
    ) {

        currentIdentity =
            "community";

    } else {

        currentIdentity =
            "verified";

    }


    updateIdentityUI();

}


// ============================================
// FORMAT NUMBER
// ============================================

function formatNumber(
    value
) {

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
                        "?select=*&order=created_at.desc"
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


    container.innerHTML =
        "";


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
                    >
                        Vote
                    </button>

                </div>

            `;


            const button =
                card.querySelector(
                    "button"
                );


            button.addEventListener(
                "click",
                () => {

                    openPoll(
                        poll.id
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


// ============================================
// ESCAPE HTML
// ============================================

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


// ============================================
// OPEN POLL
// ============================================

async function openPoll(
    pollId
) {

    currentPoll =
        polls.find(
            poll =>
                String(poll.id) ===
                String(pollId)
        );


    if (!currentPoll)
        return;


    const detail =
        document.getElementById(
            "poll-detail"
        );


    detail.classList.remove(
        "hidden"
    );


    document.getElementById(
        "detail-question"
    ).textContent =
        currentPoll.question;


    document.getElementById(
        "detail-category"
    ).textContent =
        currentPoll.category ||
        "General";


    document
        .getElementById(
            "poll-results"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "vote-area"
        )
        .classList.remove(
            "hidden"
        );


    await checkExistingVote();

}


// ============================================
// CHECK EXISTING VOTE
// ============================================

async function checkExistingVote() {

    if (!currentPoll)
        return;


    try {

        let query;


        if (
            currentIdentity ===
            "public"
        ) {

            const session =
                getPublicSessionId();


            query =
                `?select=*&poll_id=eq.${encodeURIComponent(
                    currentPoll.id
                )}&session_id=eq.${encodeURIComponent(
                    session
                )}&order=created_at.desc&limit=1`;

        }

        else {

            query =
                `?select=*&poll_id=eq.${encodeURIComponent(
                    currentPoll.id
                )}&wallet_address=eq.${encodeURIComponent(
                    connectedWallet
                )}&order=created_at.desc&limit=1`;

        }


        const votes =
            await supabaseRequest(
                "poll_votes",
                {
                    query
                }
            );


        if (
            votes &&
            votes.length
        ) {

            const lastVote =
                votes[0];


            const lastVoteTime =
                new Date(
                    lastVote.created_at
                );


            const now =
                new Date();


            const difference =
                now.getTime() -
                lastVoteTime.getTime();


            const hours =
                difference /
                (
                    1000 *
                    60 *
                    60
                );


            if (
                hours < 24
            ) {

                showVoteMessage(
                    `You can change your vote again in ${Math.ceil(
                        24 - hours
                    )} hours.`
                );

                disableVoteButtons();

                return;

            }

        }


        enableVoteButtons();

    }

    catch (error) {

        console.error(
            "Existing vote check error:",
            error
        );


        enableVoteButtons();

    }

}


// ============================================
// ENABLE / DISABLE
// ============================================

function disableVoteButtons() {

    document.getElementById(
        "vote-yes"
    ).disabled = true;


    document.getElementById(
        "vote-no"
    ).disabled = true;

}


function enableVoteButtons() {

    document.getElementById(
        "vote-yes"
    ).disabled = false;


    document.getElementById(
        "vote-no"
    ).disabled = false;

}


// ============================================
// VOTE
// ============================================

async function submitVote(
    answer
) {

    if (!currentPoll)
        return;


    const yes =
        answer === "YES";


    try {

        disableVoteButtons();


        const vote = {

            poll_id:
                currentPoll.id,

            answer:
                answer,

            vote_type:
                currentIdentity,

            wallet_address:
                connectedWallet ||
                null,

            session_id:
                connectedWallet
                    ? null
                    : getPublicSessionId(),

            ept_balance:
                currentIdentity ===
                "community"
                    ? eptBalance
                    : 0

        };


        await supabaseRequest(
            "poll_votes",
            {
                method:
                    "POST",

                body:
                    vote
            }
        );


        showVoteMessage(
            `Your vote has been recorded: ${answer}.`
        );


        await loadPollResults();


        await loadPolls();


        setTimeout(
            () => {

                checkExistingVote();

            },
            500
        );

    }

    catch (error) {

        console.error(
            "Vote error:",
            error
        );


        showVoteMessage(
            "Unable to record your vote."
        );


        enableVoteButtons();

    }

}


// ============================================
// RESULTS
// ============================================

async function loadPollResults() {

    if (!currentPoll)
        return;


    try {

        const votes =
            await supabaseRequest(
                "poll_votes",
                {
                    query:
                        `?select=*&poll_id=eq.${encodeURIComponent(
                            currentPoll.id
                        )}`
                }
            );


        const global =
            calculateResults(
                votes
            );


        const verified =
            calculateResults(
                votes.filter(
                    vote =>
                        vote.vote_type ===
                        "verified"
                )
            );


        const community =
            calculateResults(
                votes.filter(
                    vote =>
                        vote.vote_type ===
                        "community"
                )
            );


        updateResultGroup(
            "global",
            global
        );


        updateResultGroup(
            "verified",
            verified
        );


        updateResultGroup(
            "community",
            community
        );


        document
            .getElementById(
                "poll-results"
            )
            .classList.remove(
                "hidden"
            );

    }

    catch (error) {

        console.error(
            "Results error:",
            error
        );

    }

}


// ============================================
// CALCULATE RESULTS
// ============================================

function calculateResults(
    votes
) {

    let yes = 0;
    let no = 0;


    votes.forEach(
        vote => {

            let weight = 1;


            if (
                vote.vote_type ===
                "community"
            ) {

                weight =
                    Number(
                        vote.ept_balance || 1
                    );

            }


            if (
                vote.answer ===
                "YES"
            ) {

                yes += weight;

            }


            if (
                vote.answer ===
                "NO"
            ) {

                no += weight;

            }

        }
    );


    const total =
        yes + no;


    const yesPercent =
        total > 0
            ? (
                yes /
                total *
                100
            )
            : 0;


    const noPercent =
        total > 0
            ? (
                no /
                total *
                100
            )
            : 0;


    return {

        yes,

        no,

        total,

        yesPercent,

        noPercent

    };

}


// ============================================
// UPDATE RESULT GROUP
// ============================================

function updateResultGroup(
    prefix,
    result
) {

    const yes =
        document.getElementById(
            `${prefix}-yes`
        );


    const no =
        document.getElementById(
            `${prefix}-no`
        );


    const total =
        document.getElementById(
            `${prefix}-total`
        );


    const yesBar =
        document.getElementById(
            `${prefix}-yes-bar`
        );


    const noBar =
        document.getElementById(
            `${prefix}-no-bar`
        );


    if (yes)
        yes.textContent =
            `${result.yesPercent.toFixed(1)}%`;


    if (no)
        no.textContent =
            `${result.noPercent.toFixed(1)}%`;


    if (total)
        total.textContent =
            `${formatNumber(result.total)} votes`;


    if (yesBar)
        yesBar.style.width =
            `${result.yesPercent}%`;


    if (noBar)
        noBar.style.width =
            `${result.noPercent}%`;

}


// ============================================
// CREATE POLL
// ============================================

async function createPoll() {

    const questionInput =
        document.getElementById(
            "poll-question"
        );


    const categoryInput =
        document.getElementById(
            "poll-category"
        );


    const message =
        document.getElementById(
            "create-poll-message"
        );


    const question =
        questionInput.value.trim();


    const category =
        categoryInput.value;


    if (!question) {

        message.textContent =
            "Please enter a question.";

        return;

    }


    if (
        question.length < 5
    ) {

        message.textContent =
            "Question is too short.";

        return;

    }


    if (
        !connectedWallet
    ) {

        message.textContent =
            "Connect your Solana wallet before creating a poll.";

        return;

    }


    try {

        const poll = {

            question,

            category,

            status:
                "active",

            creator_wallet:
                connectedWallet

        };


        await supabaseRequest(
            "polls",
            {
                method:
                    "POST",

                body:
                    poll
            }
        );


        questionInput.value =
            "";


        message.textContent =
            "Poll created successfully.";


        await loadPolls();

    }

    catch (error) {

        console.error(
            "Create poll error:",
            error
        );


        message.textContent =
            "Unable to create poll.";

    }

}


// ============================================
// PROFILE
// ============================================

async function loadProfile() {

    const status =
        document.getElementById(
            "profile-wallet-status"
        );


    if (!connectedWallet) {

        status.textContent =
            "Connect a Solana wallet to create your Hub profile.";

        return;

    }


    status.textContent =
        `Wallet connected: ${shortWallet(
            connectedWallet
        )}`;


    try {

        const profiles =
            await supabaseRequest(
                "profiles",
                {
                    query:
                        `?select=*&wallet_address=eq.${encodeURIComponent(
                            connectedWallet
                        )}&limit=1`
                }
            );


        if (
            profiles &&
            profiles.length
        ) {

            const profile =
                profiles[0];


            document.getElementById(
                "profile-username"
            ).value =
                profile.username ||
                "";


            document.getElementById(
                "profile-display-name"
            ).value =
                profile.display_name ||
                "";


            document.getElementById(
                "profile-bio"
            ).value =
                profile.bio ||
                "";

        }

    }

    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }

}


// ============================================
// SAVE PROFILE
// ============================================

async function saveProfile() {

    if (!connectedWallet) {

        showProfileMessage(
            "Connect your wallet first."
        );

        return;

    }


    const username =
        document.getElementById(
            "profile-username"
        ).value.trim();


    const displayName =
        document.getElementById(
            "profile-display-name"
        ).value.trim();


    const bio =
        document.getElementById(
            "profile-bio"
        ).value.trim();


    try {

        const existing =
            await supabaseRequest(
                "profiles",
                {
                    query:
                        `?select=id&wallet_address=eq.${encodeURIComponent(
                            connectedWallet
                        )}&limit=1`
                }
            );


        const profile = {

            wallet_address:
                connectedWallet,

            username,

            display_name:
                displayName,

            bio

        };


        if (
            existing &&
            existing.length
        ) {

            await supabaseRequest(
                "profiles",
                {

                    method:
                        "PATCH",

                    query:
                        `?wallet_address=eq.${encodeURIComponent(
                            connectedWallet
                        )}`,

                    body:
                        profile

                }
            );

        }

        else {

            await supabaseRequest(
                "profiles",
                {

                    method:
                        "POST",

                    body:
                        profile

                }
            );

        }


        showProfileMessage(
            "Profile saved."
        );

    }

    catch (error) {

        console.error(
            "Profile save error:",
            error
        );


        showProfileMessage(
            "Unable to save profile."
        );

    }

}


// ============================================
// PROFILE MESSAGE
// ============================================

function showProfileMessage(
    text
) {

    const element =
        document.getElementById(
            "profile-message"
        );


    if (element)
        element.textContent =
            text;

}


// ============================================
// VOTE MESSAGE
// ============================================

function showVoteMessage(
    text
) {

    const element =
        document.getElementById(
            "vote-message"
        );


    if (element)
        element.textContent =
            text;

}


// ============================================
// WALLET
// ============================================

async function connectWallet() {

    if (
        !window.solana ||
        !window.solana.isPhantom
    ) {

        alert(
            "Please open EarthPayment Hub in Phantom or another Solana wallet browser."
        );

        return;

    }


    try {

        const response =
            await window.solana.connect();


        connectedWallet =
            response.publicKey.toString();


        document.getElementById(
            "connect-wallet"
        ).textContent =
            `🔓 ${shortWallet(
                connectedWallet
            )}`;


        // ------------------------------------
        // EPT BALANCE
        // ------------------------------------

        await loadEPTBalance();


        classifyWallet(
            eptBalance
        );


        await loadProfile();


        if (currentPoll) {

            await checkExistingVote();

        }

    }

    catch (error) {

        console.error(
            "Wallet connection error:",
            error
        );

    }

}


// ============================================
// EPT BALANCE
// ============================================

async function loadEPTBalance() {

    if (!connectedWallet)
        return;


    /*
        EPT mint:
        Replace this constant with the exact
        EarthPayment EPT mint address if needed.
    */

    const EPT_MINT =
        "YOUR_EPT_MINT_ADDRESS";


    if (
        EPT_MINT ===
        "YOUR_EPT_MINT_ADDRESS"
    ) {

        eptBalance = 0;

        return;

    }


    try {

        const response =
            await fetch(
                "https://api.mainnet-beta.solana.com",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            jsonrpc:
                                "2.0",

                            id:
                                1,

                            method:
                                "getTokenAccountsByOwner",

                            params: [

                                connectedWallet,

                                {
                                    mint:
                                        EPT_MINT
                                },

                                {
                                    encoding:
                                        "jsonParsed"
                                }

                            ]

                        })

                }
            );


        const data =
            await response.json();


        let balance = 0;


        if (
            data &&
            data.result &&
            data.result.value
        ) {

            data.result.value.forEach(
                account => {

                    const amount =
                        account.account
                            .data
                            .parsed
                            .info
                            .tokenAmount
                            .uiAmount;


                    balance +=
                        Number(
                            amount || 0
                        );

                }
            );

        }


        eptBalance =
            balance;

    }

    catch (error) {

        console.error(
            "EPT balance error:",
            error
        );


        eptBalance =
            0;

    }

}


// ============================================
// SHORT WALLET
// ============================================

function shortWallet(
    wallet
) {

    if (!wallet)
        return "";


    return (
        wallet.substring(
            0,
            4
        ) +
        "..." +
        wallet.substring(
            wallet.length - 4
        )
    );

}


// ============================================
// CLOSE DETAIL
// ============================================

function closePollDetail() {

    document
        .getElementById(
            "poll-detail"
        )
        .classList.add(
            "hidden"
        );


    currentPoll =
        null;

}


// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        document
            .getElementById(
                "create-poll"
            )
            ?.addEventListener(
                "click",
                createPoll
            );


        document
            .getElementById(
                "refresh-polls"
            )
            ?.addEventListener(
                "click",
                loadPolls
            );


        document
            .getElementById(
                "close-poll-detail"
            )
            ?.addEventListener(
                "click",
                closePollDetail
            );


        document
            .getElementById(
                "vote-yes"
            )
            ?.addEventListener(
                "click",
                () =>
                    submitVote(
                        "YES"
                    )
            );


        document
            .getElementById(
                "vote-no"
            )
            ?.addEventListener(
                "click",
                () =>
                    submitVote(
                        "NO"
                    )
            );


        document
            .getElementById(
                "connect-wallet"
            )
            ?.addEventListener(
                "click",
                connectWallet
            );


        document
            .getElementById(
                "save-profile"
            )
            ?.addEventListener(
                "click",
                saveProfile
            );


        loadPolls();


        updateIdentityUI();

    }
);


// ============================================
// END
// ============================================

console.log(
    "EarthPayment Polls ready."
);
