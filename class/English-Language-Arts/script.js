document.addEventListener("DOMContentLoaded", function () {
    // Fullscreen toggle function
    window.toggleFullscreen = function () {
        const gameContainer = document.querySelector(".game-container");
        if (gameContainer) {
            if (gameContainer.requestFullscreen) {
                gameContainer.requestFullscreen();
            } else if (gameContainer.mozRequestFullScreen) {
                gameContainer.mozRequestFullScreen();
            } else if (gameContainer.webkitRequestFullscreen) {
                gameContainer.webkitRequestFullscreen();
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
