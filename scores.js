function saveScore(name, score) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({ name, score });
    localStorage.setItem('scores', JSON.stringify(scores));
}

function getScores() {
    return JSON.parse(localStorage.getItem('scores')) || [];
}
