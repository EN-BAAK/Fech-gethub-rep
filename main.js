//  Main Variables
let theInput = document.querySelector(".get-repos input");
let getButton = document.querySelector(".get-button");
let reposData = document.querySelector(".show-data");
let showContainer = document.querySelector(".saved-container");

//! Main

setData();

getButton.onclick = function () {
    getRepos();
};

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("saved-repo")) {
        theInput.value = e.target.innerHTML;

        getButton.click();
    }
});

//! Functions

//  Get Repos
function getRepos() {
    if (theInput.value == "") {
        reposData.innerHTML = `<span>Please Write Github Username.</span>`;
    } else if (getButton.classList.contains("loading")) {
        reposData.innerHTML = `<span>Please wait a seconds.</span>`;
    } else {
        getButton.innerHTML = "Loading...";
        getButton.classList.add("loading");
        fetch(`https://api.github.com/users/${theInput.value}/repos`)
            .then((reponse) => reponse.json())

            .then((data) => {
                reposData.innerHTML = "";

                let isExistData = data.length >= 1;

                data.forEach((repo) => {
                    let mainDiv = document.createElement("div");

                    let repoName = document.createTextNode(repo.name);

                    mainDiv.appendChild(repoName);

                    let theUrl = document.createElement("a");

                    let theUrlText = document.createTextNode("visit");

                    theUrl.appendChild(theUrlText);

                    theUrl.href = `https://github.com/${theInput.value}/${repo.name}`;

                    theUrl.setAttribute("target", "_blank");

                    mainDiv.appendChild(theUrl);

                    let starsSpan = document.createElement("span");

                    let starsText = document.createTextNode(
                        `stars ${repo.stargazers_count}`
                    );

                    starsSpan.appendChild(starsText);

                    mainDiv.appendChild(starsSpan);

                    let repoDescription = document.createElement("p");

                    repoDescription.classList.add("description");

                    let description = document.createTextNode(repo.description);

                    repoDescription.appendChild(description);

                    mainDiv.appendChild(repoDescription);

                    mainDiv.className = `repo-box`;

                    reposData.appendChild(mainDiv);
                });

                if (isExistData) {
                    let data = localStorage.getItem("github-repo") || [];

                    if (data.length > 0) {
                        data = JSON.parse(data);
                    }

                    let sameData = false;

                    for (i of data) {
                        console.log(i);
                        if (i === theInput.value) {
                            sameData = true;
                            break;
                        }
                    }

                    if (!sameData) {
                        let savedUrl = document.createElement("span");

                        let textSavedUrl = document.createTextNode(
                            theInput.value
                        );

                        savedUrl.appendChild(textSavedUrl);

                        savedUrl.classList.add("saved-repo");

                        showContainer.appendChild(savedUrl);

                        data.push(theInput.value);

                        data = JSON.stringify(data);

                        window.localStorage.setItem("github-repo", data);
                    }
                }
            })
            .finally(() => {
                getButton.innerHTML = "Get Repos";
                getButton.classList.remove("loading");
            });
    }
}

function setData() {
    let data = window.localStorage.getItem("github-repo");

    if (!data) return;

    data = JSON.parse(data);

    data.forEach((repo) => {
        let savedUrl = document.createElement("span");

        savedUrl.classList.add("saved-repo");

        let textSavedUrl = document.createTextNode(repo);

        savedUrl.appendChild(textSavedUrl);

        showContainer.appendChild(savedUrl);
    });
}
