const daysBox = document.getElementById('days');
const headerText = document.getElementById('month-year-display');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const noteBox = document.getElementById('note-editor');
const noteTitle = document.getElementById('note-title');
const noteInput = document.getElementById('note-input');
const saveButton = document.getElementById('save-note-btn');
const closeButton = document.getElementById('close-note-btn');
const deleteButton = document.getElementById('delete-note-btn');

let today = new Date();
let notes = JSON.parse(localStorage.getItem('calendarNotes')) || {};
let chosenDay = null;

function saveTheNotes() {
    localStorage.setItem('calendarNotes', JSON.stringify(notes));
}

function deleteNoteForDay(dayKey) {
        localStorage.removeItem('calendarNotes');
        delete notes[dayKey];
        saveTheNotes();
        makeCalendar(today);
    
}

function showNoteBox(dayKey) {
    chosenDay = dayKey;
    noteTitle.textContent = 'Note for ' + dayKey;
    noteInput.value = notes[dayKey] || '';
    noteBox.style.display = 'block';
    noteInput.focus();
}

function hideNoteBox() {
    noteBox.style.display = 'none';
    chosenDay = null;
}

function makeCalendar(dateToShow) {
    const year = dateToShow.getFullYear();
    const month = dateToShow.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayNumber = firstDay.getDay();
    const monthName = firstDay.toLocaleString('default', { month: 'long' });

    headerText.textContent = monthName + ' ' + year;
    daysBox.innerHTML = '';

    for (let i = 0; i < firstDayNumber; i = i + 1) {
        const emptyBox = document.createElement('div');
        emptyBox.className = 'empty';
        daysBox.appendChild(emptyBox);
    }

    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber = dayNumber + 1) {
        const dayKey = year + '-' + (month + 1) + '-' + dayNumber;
        const dayBox = document.createElement('div');
        dayBox.className = 'day';

        const dateText = document.createElement('div');
        dateText.className = 'date-label';
        dateText.textContent = dayNumber;

        const noteText = document.createElement('div');
        noteText.className = 'note-text';

        if (notes[dayKey] && notes[dayKey].trim() !== '') {
            noteText.classList.add('has-note');
            noteText.textContent = notes[dayKey];
        } else {
            noteText.textContent = '';
        }

        dayBox.appendChild(dateText);
        dayBox.appendChild(noteText);

        dayBox.addEventListener('click', function () {
            showNoteBox(dayKey);
        });

        daysBox.appendChild(dayBox);
    }

    const totalBoxes = firstDayNumber + daysInMonth;
    const boxesLeft = (7 - (totalBoxes % 7)) % 7;

    for (let i = 0; i < boxesLeft; i = i + 1) {
        const emptyBox = document.createElement('div');
        emptyBox.className = 'empty';
        daysBox.appendChild(emptyBox);
    }
}

prevButton.addEventListener('click', function () {
    today = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    makeCalendar(today);
});

nextButton.addEventListener('click', function () {
    today = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    makeCalendar(today);
});

saveButton.addEventListener('click', function () {
    if (chosenDay) {
        notes[chosenDay] = noteInput.value;
        saveTheNotes();
        makeCalendar(today);
        hideNoteBox();
    }
});

closeButton.addEventListener('click', function () {
    hideNoteBox();
});

deleteButton.addEventListener('click', function () {
    if (chosenDay) {
        deleteNoteForDay(chosenDay);
        hideNoteBox();
    }
});

makeCalendar(today);
