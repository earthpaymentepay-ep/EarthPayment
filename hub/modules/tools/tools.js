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
