// =========================================================
// EARTHPAYMENT HUB
// COMMUNITY
// =========================================================

console.log("EarthPayment Community loaded");


// =========================================================
// ELEMENTS
// =========================================================

const profileModal =
    document.getElementById("profileModal");

const walletModal =
    document.getElementById("walletModal");

const walletButton =
    document.getElementById("walletButton");

const createProfileButton =
    document.getElementById("createProfileButton");

const sidebarProfileButton =
    document.getElementById("sidebarProfileButton");

const closeProfileModal =
    document.getElementById("closeProfileModal");

const closeWalletModal =
    document.getElementById("closeWalletModal");

const profileForm =
    document.getElementById("profileForm");

const profilePreview =
    document.getElementById("profilePreview");

const newPostButton =
    document.getElementById("newPostButton");

const postCreator =
    document.getElementById("postCreator");

const publishPost =
    document.getElementById("publishPost");

const postText =
    document.getElementById("postText");


// =========================================================
// MINI GLOBAL DATA
// =========================================================

function updateMiniTime() {

    const timeElement =
        document.getElementById("miniTime");

    if (!timeElement) return;

    const now = new Date();

    timeElement.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


setInterval(
    updateMiniTime,
    1000
);

updateMiniTime();


// ---------------------------------------------------------
// Temporary values
// These can later be replaced by the same global-data
// logic used by Hub / Global Pulse.
// ---------------------------------------------------------

const miniWeather =
    document.getElementById("miniWeather");

const miniCurrency =
    document.getElementById("miniCurrency");


if (miniWeather) {

    miniWeather.textContent =
        "--°C";

}


if (miniCurrency) {

    miniCurrency.textContent =
        "USD/EUR --";

}


// =========================================================
// PROFILE
// =========================================================

function openProfileModal() {

    loadProfile();

    profileModal.classList.remove("hidden");

}


function closeProfile() {

    profileModal.classList.add("hidden");

}


createProfileButton.addEventListener(
    "click",
    openProfileModal
);


sidebarProfileButton.addEventListener(
    "click",
    openProfileModal
);


closeProfileModal.addEventListener(
    "click",
    closeProfile
);


// =========================================================
// LOAD PROFILE
// =========================================================

function loadProfile() {

    const savedProfile =
        localStorage.getItem(
            "earthpayment_community_profile"
        );


    if (!savedProfile) {

        document.getElementById(
            "profileName"
        ).value = "";

        document.getElementById(
            "profileCountry"
        ).value = "";

        document.getElementById(
            "profileBio"
        ).value = "";

        document.getElementById(
            "profileInterests"
        ).value = "";

        return;

    }


    try {

        const profile =
            JSON.parse(savedProfile);


        document.getElementById(
            "profileName"
        ).value =
            profile.name || "";


        document.getElementById(
            "profileCountry"
        ).value =
            profile.country || "";


        document.getElementById(
            "profileBio"
        ).value =
            profile.bio || "";


        document.getElementById(
            "profileInterests"
        ).value =
            profile.interests || "";

    }

    catch (error) {

        console.error(
            "Profile load error:",
            error
        );

    }

}


// =========================================================
// SAVE PROFILE
// =========================================================

profileForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const profile = {

            name:
                document.getElementById(
                    "profileName"
                ).value.trim(),

            country:
                document.getElementById(
                    "profileCountry"
                ).value,

            bio:
                document.getElementById(
                    "profileBio"
                ).value.trim(),

            interests:
                document.getElementById(
                    "profileInterests"
                ).value.trim(),

            updatedAt:
                new Date().toISOString()

        };


        localStorage.setItem(
            "earthpayment_community_profile",
            JSON.stringify(profile)
        );


        renderProfile(profile);

        closeProfile();

    }
);


// =========================================================
// RENDER PROFILE
// =========================================================

function renderProfile(profile) {

    if (!profile || !profile.name) {

        profilePreview.innerHTML = `

            <div class="profile-placeholder">

                <div class="profile-avatar">
                    👤
                </div>

                <strong>
                    Create your profile
                </strong>

                <p>
                    Introduce yourself to the community.
                </p>

                <button
                    class="small-primary-button"
                    id="sidebarProfileButton"
                    type="button">
                    Create Profile
                </button>

            </div>

        `;

        document
            .getElementById(
                "sidebarProfileButton"
            )
            .addEventListener(
                "click",
                openProfileModal
            );

        return;

    }


    let countryFlag = "🌎";


    const flags = {

        CZ: "🇨🇿",
        DE: "🇩🇪",
        FR: "🇫🇷",
        GB: "🇬🇧",
        US: "🇺🇸",
        ES: "🇪🇸"

    };


    if (flags[profile.country]) {

        countryFlag =
            flags[profile.country];

    }


    profilePreview.innerHTML = `

        <div class="profile-placeholder">

            <div class="profile-avatar">
                👤
            </div>

            <strong>
                ${escapeHTML(profile.name)}
            </strong>

            <p>
                ${countryFlag}
                ${escapeHTML(profile.country || "Global")}
            </p>

            <p>
                ${escapeHTML(profile.bio || "Community member")}
            </p>

            <button
                class="small-primary-button"
                id="sidebarProfileButton"
                type="button">
                Edit Profile
            </button>

        </div>

    `;


    document
        .getElementById(
            "sidebarProfileButton"
        )
        .addEventListener(
            "click",
            openProfileModal
        );

}


// =========================================================
// INITIAL PROFILE
// =========================================================

function initializeProfile() {

    const savedProfile =
        localStorage.getItem(
            "earthpayment_community_profile"
        );


    if (!savedProfile) {

        renderProfile(null);

        return;

    }


    try {

        renderProfile(
            JSON.parse(savedProfile)
        );

    }

    catch {

        renderProfile(null);

    }

}


initializeProfile();


// =========================================================
// WALLET
// =========================================================

walletButton.addEventListener(
    "click",
    function() {

        walletModal.classList.remove(
            "hidden"
        );

    }
);


closeWalletModal.addEventListener(
    "click",
    function() {

        walletModal.classList.add(
            "hidden"
        );

    }
);


// =========================================================
// PHANTOM
// =========================================================

const phantomWalletButton =
    document.getElementById(
        "phantomWalletButton"
    );


phantomWalletButton.addEventListener(
    "click",
    async function() {

        if (
            !window.solana ||
            !window.solana.isPhantom
        ) {

            alert(
                "Phantom wallet was not detected."
            );

            return;

        }


        try {

            const response =
                await window.solana.connect();


            const publicKey =
                response.publicKey.toString();


            localStorage.setItem(
                "earthpayment_wallet_connected",
                "true"
            );


            /*
             IMPORTANT:

             The wallet address is intentionally NOT
             stored inside the Community profile.

             It remains a separate identity.
            */


            walletButton.textContent =
                "🔗 Wallet Connected";


            walletModal.classList.add(
                "hidden"
            );


            console.log(
                "Wallet connected:",
                publicKey
            );

        }

        catch (error) {

            console.error(
                "Wallet connection failed:",
                error
            );

        }

    }
);


// =========================================================
// DEMO WALLET
// =========================================================

const demoWalletButton =
    document.getElementById(
        "demoWalletButton"
    );


demoWalletButton.addEventListener(
    "click",
    function() {

        localStorage.setItem(
            "earthpayment_wallet_connected",
            "demo"
        );


        walletButton.textContent =
            "🔗 Wallet Connected";


        walletModal.classList.add(
            "hidden"
        );

    }
);


// =========================================================
// RESTORE WALLET STATE
// =========================================================

function restoreWalletState() {

    const connected =
        localStorage.getItem(
            "earthpayment_wallet_connected"
        );


    if (connected) {

        walletButton.textContent =
            "🔗 Wallet Connected";

    }

}


restoreWalletState();


// =========================================================
// POST CREATOR
// =========================================================

newPostButton.addEventListener(
    "click",
    function() {

        postCreator.classList.toggle(
            "hidden"
        );


        if (
            !postCreator.classList.contains(
                "hidden"
            )
        ) {

            postText.focus();

        }

    }
);


// =========================================================
// PUBLISH POST
// =========================================================

publishPost.addEventListener(
    "click",
    function() {

        const text =
            postText.value.trim();


        if (!text) {

            return;

        }


        const profile =
            getProfile();


        const displayName =
            profile?.name ||
            "Community Member";


        const article =
            document.createElement(
                "article"
            );


        article.className =
            "community-post";


        article.innerHTML = `

            <div class="post-header">

                <div class="post-avatar">
                    👤
                </div>

                <div>

                    <strong>
                        ${escapeHTML(displayName)}
                    </strong>

                    <span>
                        Community · just now
                    </span>

                </div>

            </div>


            <div class="post-content">

                <p>
                    ${escapeHTML(text)}
                </p>

            </div>


            <div class="post-actions">

                <button type="button">
                    ❤️ <span>0</span>
                </button>

                <button type="button">
                    💬 <span>0</span>
                </button>

                <button type="button">
                    🔗 Share
                </button>

            </div>

        `;


        document
            .getElementById(
                "communityFeed"
            )
            .prepend(article);


        postText.value = "";

        postCreator.classList.add(
            "hidden"
        );

    }
);


// =========================================================
// TABS
// =========================================================

const communityTabs =
    document.querySelectorAll(
        ".community-tab"
    );


communityTabs.forEach(
    function(tab) {

        tab.addEventListener(
            "click",
            function() {

                communityTabs.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                tab.classList.add(
                    "active"
                );


                const target =
                    document.getElementById(
                        tab.dataset.section
                    );


                if (target) {

                    target.scrollIntoView({

                        behavior: "smooth",
                        block: "start"

                    });

                }

            }
        );

    }
);


// =========================================================
// SIDEBAR SCROLL
// =========================================================

document
    .querySelectorAll(
        "[data-scroll]"
    )
    .forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const target =
                        document.getElementById(
                            button.dataset.scroll
                        );


                    if (target) {

                        target.scrollIntoView({

                            behavior: "smooth",
                            block: "start"

                        });

                    }

                }
            );

        }
    );


// =========================================================
// DISCOVER BUTTON
// =========================================================

document
    .getElementById(
        "discoverButton"
    )
    .addEventListener(
        "click",
        function() {

            document
                .getElementById(
                    "people"
                )
                .scrollIntoView({

                    behavior: "smooth"

                });

        }
    );


// =========================================================
// PROFILE HELPER
// =========================================================

function getProfile() {

    const saved =
        localStorage.getItem(
            "earthpayment_community_profile"
        );


    if (!saved) {

        return null;

    }


    try {

        return JSON.parse(saved);

    }

    catch {

        return null;

    }

}


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeHTML(value) {

    return String(value)

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


// =========================================================
// MODAL BACKGROUND CLOSE
// =========================================================

profileModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            profileModal
        ) {

            closeProfile();

        }

    }
);


walletModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            walletModal
        ) {

            walletModal.classList.add(
                "hidden"
            );

        }

    }
);


// =========================================================
// ESCAPE KEY
// =========================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key !== "Escape") {

            return;

        }


        profileModal.classList.add(
            "hidden"
        );


        walletModal.classList.add(
            "hidden"
        );

    }
);
