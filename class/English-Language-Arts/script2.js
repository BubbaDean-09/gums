// Sample leaderboard data
const leaderboardData = [
    { rank: 1, player: "PlayerOne", time: "1:23.45", track: "Track 1" },
    { rank: 2, player: "SpeedRacer", time: "1:25.67", track: "Track 2" },
    { rank: 3, player: "FastFury", time: "1:28.30", track: "Track 3" }
];

// Function to update leaderboard
function updateLeaderboard() {
    const tableBody = document.querySelector("#leaderboard tbody");
    tableBody.innerHTML = ""; // Clear previous entries

    leaderboardData.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${entry.rank}</td>
                         <td>${entry.player}</td>
                         <td>${entry.time}</td>
                         <td>${entry.track}</td>`;
        tableBody.appendChild(row);
    });
}

// Initialize leaderboard
updateLeaderboard();
