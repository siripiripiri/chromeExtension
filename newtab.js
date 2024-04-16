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
    const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeFormat = is24HourFormat ? `${hours}:${minutes}` : `${hours}:${minutes} ${ampm}`;

    document.getElementById('clock').innerText = timeFormat;
    document.getElementById('date').innerText = date;
}

document.getElementById('formatButton').addEventListener('click', function() {
    is24HourFormat = !is24HourFormat;
    updateTimeAndDate(); 
});

setInterval(updateTimeAndDate, 1000);
updateTimeAndDate();


document.addEventListener("DOMContentLoaded", function() {
    const shortcutsContainer = document.getElementById('shortcuts');
    const addShortcutBtn = document.getElementById('addShortcutBtn');
    const shortcutUrlInput = document.getElementById('shortcutUrl');

    // Function to retrieve stored shortcuts from localStorage
    function getShortcuts() {
        return JSON.parse(localStorage.getItem('shortcuts')) || [];
    }

    // Function to save shortcuts to localStorage
    function saveShortcuts(shortcuts) {
        localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    }

    // Function to display shortcuts
    function displayShortcuts() {
        shortcutsContainer.innerHTML = ''; // Clear previous shortcuts
        const shortcuts = getShortcuts();

        // Loop through shortcuts and create HTML elements for each
        shortcuts.forEach((shortcut, index) => {
            const shortcutDiv = document.createElement('div');
            shortcutDiv.classList.add('shortcut');

            const link = document.createElement('a');
            link.classList.add('link');
            link.href = shortcut.url;
            link.textContent = shortcut.name; // Use the name of the website as the shortcut name
            link.target = '_blank'; // Open in new tab
            shortcutDiv.appendChild(link);

            // Add delete button for each shortcut
                    // Add delete button for each shortcut
        // Add delete button for each shortcut
// Add delete button for each shortcut
        const deleteBtn = document.createElement('button');

        // Create img element
        const imgIcon = document.createElement('img');
        imgIcon.classList.add('delete-icon');
        imgIcon.src = 'del-icon.svg'; // Set the path to your delete icon image
        imgIcon.alt = 'Delete'; // Add alt text for accessibility

        // Append img icon to delete button
        deleteBtn.appendChild(imgIcon);
        deleteBtn.classList.add('delete-btn')

        // Add event listener to delete button
        deleteBtn.addEventListener('click', function() {
            // Remove the shortcut from the array and update localStorage
            shortcuts.splice(index, 1);
            saveShortcuts(shortcuts);
            // Display updated shortcuts
            displayShortcuts();
        });

        shortcutDiv.appendChild(deleteBtn);


            shortcutsContainer.appendChild(shortcutDiv);
        });
    }

    // Add event listener to the '+' button
    addShortcutBtn.addEventListener('click', function() {
        const url = shortcutUrlInput.value.trim();

        if (url !== '') {
            // Use the name of the website as the shortcut name
            const name = new URL(url).hostname.replace('www.', '');
            // Retrieve existing shortcuts and append the new one
            const shortcuts = getShortcuts();
            shortcuts.push({ name, url });
            saveShortcuts(shortcuts);

            // Display updated shortcuts
            displayShortcuts();

            // Clear input field
            shortcutUrlInput.value = '';
        }
    });

    // Display initial shortcuts when the page loads
    displayShortcuts();

    let settingFlag = 0;
    const settingsButton = document.getElementById("settings-button");

    settingsButton.addEventListener("click", () => {
        settingFlag = settingFlag === 0 ? 1 : 0;

        const shortcutUrl = document.getElementById('shortcutUrl');
        const shortcutUrlInput = document.getElementById('shortcutUrlInput');
        const addShortcut = document.getElementById('addShortcut');
        const deleteBtn = document.querySelectorAll('.delete-btn');
        const addShortcutBtn = document.getElementById("addShortcutBtn")
        if (settingFlag === 1) {
            // Hide elements when settingFlag is 1
            shortcutUrl.classList.add("hidden");
            shortcutUrlInput.classList.add("hidden");
            addShortcutBtn.classList.add("hidden");
            addShortcut.classList.add("hidden");
            deleteBtn.add("hidden");
        } else {
            // Show elements when settingFlag is 0
            shortcutUrl.classList.remove("hidden");
            shortcutUrlInput.classList.remove("hidden");
            addShortcutBtn.classList.remove("hidden");
            deleteBtn.remove("hidden");
            addShortcut.classList.remove("hidden");
        }
    });
});