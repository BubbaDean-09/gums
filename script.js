const saveBankURL = "ocheyedancommunity.shop/save-handler.html";
const iframe = document.createElement("iframe");
iframe.src = saveBankURL;
iframe.style.display = "none";
document.body.appendChild(iframe);

// Function to save data to the global bank
function globalSave(gameKey, data) {
    iframe.contentWindow.postMessage({ action: "save", key: gameKey, value: data }, "*");
}

// Function to request data from the global bank
function globalLoad(gameKey) {
    iframe.contentWindow.postMessage({ action: "load", key: gameKey }, "*");
}

window.addEventListener("message", (event) => {
    if (event.data.action === "load-result") {
        console.log("Loaded save for " + event.data.key + ": ", event.data.value);
        // Put logic here to push event.data.value back into the game's iframe
    }
});