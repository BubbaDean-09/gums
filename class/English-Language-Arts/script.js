document.addEventListener("DOMContentLoaded", function () {
    const gameIframe = document.querySelector(".game-container iframe");
    const saveBank = document.getElementById("saveBank");
    const bankOrigin = "https://your-boring-bank-domain.com"; // CHANGE THIS to your actual bank URL

    // 1. AUTO-LOAD: When the page (and bank) is ready, ask for the save
    if (saveBank) {
        saveBank.onload = function() {
            // Ask for data using a unique key for this game
            saveBank.contentWindow.postMessage({ action: "load", key: "game_save_data" }, bankOrigin);
        };
    }

    // 2. THE POST OFFICE: Listen for data flying between frames
    window.addEventListener("message", (event) => {
        // If message is from the BANK, send it into the GAME
        if (event.origin === bankOrigin && event.data.action === "load-result") {
            gameIframe.contentWindow.postMessage({ type: "load-save-data", data: event.data.value }, "*");
        }
        
        // If message is from the GAME, send it into the BANK
        if (event.data.type === "save-game-data") {
            saveBank.contentWindow.postMessage({ 
                action: "save", 
                key: "game_save_data", 
                value: event.data.data 
            }, bankOrigin);
        }
    });

    // 3. FULLSCREEN & SAVE TRIGGER
    window.toggleFullscreen = function () {
        const gameContainer = document.querySelector(".game-container");
        
        // Before going fullscreen, tell the game to "Prepare a Save"
        // This ensures the most recent progress is sent to the bank
        if (gameIframe) {
            gameIframe.contentWindow.postMessage({ type: "request-save" }, "*");
        }

        if (gameContainer) {
            if (gameContainer.requestFullscreen) {
                gameContainer.requestFullscreen();
            } else if (gameContainer.webkitRequestFullscreen) {
                gameContainer.webkitRequestFullscreen();
            } else if (gameContainer.mozRequestFullScreen) {
                gameContainer.mozRequestFullScreen();
            } else if (gameContainer.msRequestFullscreen) {
                gameContainer.msRequestFullscreen();
            }
        }
    };

    // Back button functionality
    window.goBack = function () {
        window.history.back();
    };
});