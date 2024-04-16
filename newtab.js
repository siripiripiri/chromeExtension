let is24HourFormat = false; 

function updateTimeAndDate() {
    const now = new Date();
    let hours, ampm;

    if (is24HourFormat) {
        hours = String(now.getHours()).padStart(2, '0');
    } else {
        hours = (now.getHours() % 12 || 12).toString();
        ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    }

    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeFormat = is24HourFormat ? `${hours}:${minutes}` : `${hours}:${minutes} ${ampm}`;

    document.getElementById('clock').innerText = timeFormat;
    document.getElementById('date').innerText = date;
}

// Toggle between 24-hour and 12-hour formats
document.getElementById('formatButton').addEventListener('click', function() {
    is24HourFormat = !is24HourFormat;
    updateTimeAndDate(); // Update the time and date format immediately after toggling
});

// Update the clock and date every second
setInterval(updateTimeAndDate, 1000);

// Initial call to display the clock and date immediately
updateTimeAndDate();