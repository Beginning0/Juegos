function saveScore(name, score) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({ name, score });
    // Ordenar del mayor al menor
    scores.sort((a, b) => b.score - a.score);
    // Guardar solo los 10 mejores
    scores = scores.slice(0, 10);
    localStorage.setItem('scores', JSON.stringify(scores));
}

function getScores() {
    return JSON.parse(localStorage.getItem('scores')) || [];
}

function getTopScores(limit = 3) {
    const scores = getScores();
    return scores.slice(0, limit);
}
