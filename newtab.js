let is24HourFormat = false;
let settingFlag = 1; // Move the declaration and initialization here

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
        const shortcuts = getShortcuts();
        const shortcutElements = shortcutsContainer.querySelectorAll('.shortcut');
    
        // Remove deleted shortcuts
        for (let i = 0; i < shortcutElements.length; i++) {
            const shortcutElement = shortcutElements[i];
            const shortcutUrl = shortcutElement.querySelector('.link').href;
            if (!shortcuts.some(shortcut => shortcut.url === shortcutUrl)) {
                shortcutsContainer.removeChild(shortcutElement);
            } else {
                // Update visibility of delete buttons for existing shortcuts
                const deleteBtn = shortcutElement.querySelector('.delete-btn');
                deleteBtn.classList.toggle('hidden', settingFlag !== 0);
            }
        }
    
        // Add new shortcuts
        shortcuts.forEach((shortcut, index) => {
            const existingShortcutElement = shortcutsContainer.querySelector(`.shortcut .link[href="${shortcut.url}"]`);
            if (!existingShortcutElement) {
                const shortcutDiv = document.createElement('div');
                shortcutDiv.classList.add('shortcut');
    
                const link = document.createElement('a');
                link.classList.add('link');
                link.href = shortcut.url;
                link.textContent = shortcut.name;
                link.target = '_blank';
                shortcutDiv.appendChild(link);
    
                const deleteBtn = document.createElement('button');
                const imgIcon = document.createElement('img');
                imgIcon.classList.add('delete-icon');
                imgIcon.src = 'del-icon.svg';
                imgIcon.alt = 'Delete';
                deleteBtn.appendChild(imgIcon);
                deleteBtn.classList.add('delete-btn');
                deleteBtn.classList.toggle('hidden', settingFlag !== 0); // Initial visibility based on settingFlag
    
                deleteBtn.addEventListener('click', function() {
                    shortcuts.splice(index, 1);
                    saveShortcuts(shortcuts);
                    displayShortcuts();
                });
    
                shortcutDiv.appendChild(deleteBtn);
                shortcutsContainer.appendChild(shortcutDiv);
            }
        });
    }

    // Add event listener to the '+' button
    addShortcutBtn.addEventListener('click', function() {
        let url = shortcutUrlInput.value.trim();

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }

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

    const settingsButton = document.getElementById("settings-button");
    const addShortcut = document.getElementById('addShortcut');
    const deleteBtn = document.querySelectorAll('.delete-btn');
    const msgElement = document.querySelector('.msg');
    const options= document.querySelector('.options');

    // Retrieve the stored message from localStorage on page load
    const storedMessage = localStorage.getItem('customMessage');
    if (storedMessage) {
        msgElement.textContent = storedMessage;
    }

    settingsButton.addEventListener("click", () => {
        settingFlag = settingFlag === 0 ? 1 : 0;
    
        if (settingFlag === 1) {
            // Hide elements when settingFlag is 1
            addShortcut.classList.add('hidden');
            addShortcutBtn.classList.add('hidden');
            deleteBtn.forEach(btn => btn.classList.add('hidden'));
            msgElement.removeAttribute('contenteditable'); // Make the msg element non-editable
            msgElement.removeEventListener('keydown', handleEnterKey);
            options.classList.add('hidden');
        } else {
            // Show elements when settingFlag is 0
            addShortcut.classList.remove('hidden');
            addShortcutBtn.classList.remove('hidden');
            options.classList.remove('hidden');
            msgElement.setAttribute('contenteditable', 'true'); // Make the msg element editable
            msgElement.addEventListener('keydown', handleEnterKey);
            // msgElement.focus();
        }
    
        // Update visibility of delete buttons
        displayShortcuts();
    });
    

    // Event listener for changes to the msg element
    msgElement.addEventListener('input', () => {
        const updatedMessage = msgElement.textContent;
        localStorage.setItem('customMessage', updatedMessage);
    });

    function handleEnterKey(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default behavior of the "Enter" key
            msgElement.blur(); // Exit the editable text
            msgElement.removeEventListener('keydown', handleEnterKey); // Remove the event listener
        }
    }
});