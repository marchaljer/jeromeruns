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

document.getElementById('toggle-view-switch').addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    const rows = document.querySelectorAll('tbody tr');
    const label = document.getElementById('toggle-view-label');
    const today = new Date();
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const currentWeekEnd = new Date(today.setDate(today.getDate() + 6));

    if (isChecked) {
        // Vue de la semaine en cours
        rows.forEach(row => {
            let rowDate = row.cells[0].innerText.split('/').reverse().join('-');
            let sessionDate = new Date(rowDate);
            if (sessionDate >= currentWeekStart && sessionDate <= currentWeekEnd) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        label.innerText = 'Vue Semaine';
    } else {
        // Vue globale
        rows.forEach(row => row.style.display = '');
        label.innerText = 'Vue Globale';
    }
});

window.onload = loadState;
