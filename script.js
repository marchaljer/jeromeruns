function toggleDone(checkbox) {
    let row = checkbox.parentElement.parentElement;
    let distanceCell = row.cells[3];
    let distance = parseFloat(distanceCell.innerText) || 0;
    let completedDistance = parseFloat(document.getElementById('completed-distance').innerText) || 0;
    let totalDistance = parseFloat(document.getElementById('total-distance').innerText);

    if (checkbox.checked) {
        row.classList.add('done');
        completedDistance += distance;
    } else {
        row.classList.remove('done');
        completedDistance -= distance;
    }

    document.getElementById('completed-distance').innerText = completedDistance.toFixed(2);
    document.getElementById('remaining-distance').innerText = (totalDistance - completedDistance).toFixed(2);
    updateProgress(completedDistance, totalDistance);
    saveState();
}

function updateProgress(completed, total) {
    let progress = (completed / total) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-text').innerText = Math.round(progress) + '%';
}

function saveState() {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let state = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem('trainingState', JSON.stringify(state));
    localStorage.setItem('completedDistance', document.getElementById('completed-distance').innerText);
}

function loadState() {
    let state = JSON.parse(localStorage.getItem('trainingState'));
    let completedDistance = localStorage.getItem('completedDistance');
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');

    if (state) {
        state.forEach((checked, index) => {
            checkboxes[index].checked = checked;
            if (checked) {
                checkboxes[index].parentElement.parentElement.classList.add('done');
            }
        });
    }

    if (completedDistance) {
        document.getElementById('completed-distance').innerText = completedDistance;
        let totalDistance = parseFloat(document.getElementById('total-distance').innerText);
        document.getElementById('remaining-distance').innerText = (totalDistance - parseFloat(completedDistance)).toFixed(2);
        updateProgress(parseFloat(completedDistance), totalDistance);
    }
}

window.onload = loadState;