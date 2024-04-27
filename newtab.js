let is24HourFormat = getStoredFormat();
let settingFlag = 1;
let currentTheme = getCurrentTheme();
// let isLightMode = getStoredLightMode();

// function getStoredLightMode() {
//     return localStorage.getItem('isLightMode') === 'true';
// }

let isLightMode = localStorage.getItem('isLightMode') === 'true';

function getStoredFormat() {
  return localStorage.getItem('is24HourFormat') === 'true';
}

function getCurrentTheme() {
  return localStorage.getItem('currentTheme') || 'lavender';
}

// Function to update styles when light mode is enabled/disabled
function updateLightMode() {
    const bodyParallel = document.querySelector('.body-parallel');
    const clock = document.getElementById('clock');
    const date = document.getElementById('date');
    const shortcutsContainer = document.getElementById('shortcuts');
    const addShortcutBtn = document.getElementById('addShortcutBtn');

    if (isLightMode) {
        // Light mode is enabled
        const currentThemeColor = getComputedStyle(document.getElementById(currentTheme)).backgroundColor;
        bodyParallel.style.backgroundColor = currentThemeColor;
        clock.style.color = '#343434'; // Set text color of clock to #343434
        date.style.color = '#343434'; // Set text color of date to #343434
        shortcutsContainer.style.backgroundColor = 'transparent';
        addShortcutBtn.style.backgroundColor = '#af93d0';
        bodyParallel.classList.add('light-mode'); // Add light-mode class to bodyParallel
    } else {
        // Light mode is disabled
        const themeColor = getComputedStyle(document.documentElement).getPropertyValue(`--${currentTheme}-color`);
        bodyParallel.style.backgroundColor = '#0b1215';
        clock.style.color = themeColor;
        date.style.color = `rgba(${parseInt(themeColor.slice(4, -1).split(', ')[0])}, ${parseInt(themeColor.slice(4, -1).split(', ')[1])}, ${parseInt(themeColor.slice(4, -1).split(', ')[2])}, 0.7)`;
        shortcutsContainer.style.backgroundColor = '#2f2e30';
        addShortcutBtn.style.backgroundColor = '#af93d0';
        bodyParallel.classList.remove('light-mode'); // Remove light-mode class from bodyParallel
    }
}



// Call updateLightMode function initially to set styles based on stored light mode preference
updateLightMode();

// Add event listener to light mode toggle switch
const lightSwitch = document.getElementById('light-switch').querySelector('input');
lightSwitch.checked = isLightMode; // Set the initial state of the checkbox

lightSwitch.addEventListener('change', function () {
    isLightMode = this.checked;
    localStorage.setItem('isLightMode', isLightMode);
    updateLightMode(); // Update styles based on the new light mode state
});


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
    const bodyParallel = document.querySelector('.body-parallel')

    const clockElement = document.getElementById('clock');
    clockElement.innerText = timeFormat;

    const dateElement = document.getElementById('date');
    dateElement.innerText = date;
    
    const themeColor = getComputedStyle(document.getElementById(currentTheme)).backgroundColor;
    // Calculate RGBA color with 70% opacity
    const rgbaColor = `rgba(${parseInt(themeColor.slice(4, -1).split(', ')[0])}, ${parseInt(themeColor.slice(4, -1).split(', ')[1])}, ${parseInt(themeColor.slice(4, -1).split(', ')[2])}, 0.7)`;

    // Set font color with 70% opacity based on theme color for date element
    dateElement.style.color = rgbaColor;
    clockElement.style.color = getComputedStyle(document.documentElement).getPropertyValue(`--${currentTheme}-color`);
    
    const shortcutsDiv = document.getElementById('shortcuts');
    shortcutsDiv.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(`--${currentTheme}-color`);

    const addShortcutButton = document.getElementById('addShortcutBtn');
    addShortcutButton.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(`--${currentTheme}-color`);

    
}


const formatSwitch = document.getElementById('format-switch').querySelector('input');
formatSwitch.checked = is24HourFormat; // Set the initial state of the checkbox

formatSwitch.addEventListener('change', function () {
  is24HourFormat = this.checked;
  localStorage.setItem('is24HourFormat', is24HourFormat);
  clearInterval(intervalId); // Clear the existing interval
  intervalId = setInterval(updateTimeAndDate, 1000); // Set a new interval with the updated time format
  updateTimeAndDate(); // Immediately update the time with the new format
});

let intervalId = setInterval(updateTimeAndDate, 1000);
updateTimeAndDate();


// Set the initial theme
const initialThemeOption = document.getElementById(currentTheme);
initialThemeOption.classList.add('is-selected');

// Add event listeners for theme selection
const themeOptions = document.querySelectorAll('.theme');
themeOptions.forEach(option => {
  option.addEventListener('click', () => {
    const selectedTheme = option.id;
    currentTheme = selectedTheme;
    localStorage.setItem('currentTheme', selectedTheme);
    document.querySelector('.is-selected').classList.remove('is-selected');
    option.classList.add('is-selected');
    document.querySelector('.current-theme + p b').textContent = selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1);

    const bodyParallel = document.querySelector('.body-parallel');
    if (isLightMode) {
        bodyParallel.style.backgroundColor = getComputedStyle(document.getElementById(selectedTheme)).backgroundColor;
    }

    updateTimeAndDate();
    
    // Update the color of the clock based on the selected theme
    const clockElement = document.getElementById('clock');
    const shortcutsContainer = document.getElementById('shortcuts')
    shortcutsContainer.classList.remove(...clockElement.classList); // Remove all existing classes
    shortcutsContainer.classList.add(selectedTheme); // Add the selected theme class

    clockElement.classList.remove(...clockElement.classList); // Remove all existing classes
    clockElement.classList.add(selectedTheme); // Add the selected theme class
  });
});



// Set the initial theme
document.getElementById(currentTheme).classList.add('is-selected');
document.querySelector('.current-theme + p b').textContent = currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);

// ... (rest of your code)

document.addEventListener("DOMContentLoaded", function() {
    const shortcutsContainer = document.getElementById('shortcuts');
    const addShortcutBtn = document.getElementById('addShortcutBtn');
    const shortcutUrlInput = document.getElementById('shortcutUrl');

    function updateTheme() {
        // Retrieve stored theme and light mode preferences from localStorage
        const currentTheme = localStorage.getItem('currentTheme') || 'lavender';
        const isLightMode = localStorage.getItem('isLightMode') === 'true';

        // Check if light mode is enabled
        if (isLightMode) {
            // Light mode is enabled, update body background color and text colors
            const themeColor = getComputedStyle(document.getElementById(currentTheme)).backgroundColor;
            const bodyParallel = document.querySelector('.body-parallel');
            bodyParallel.style.backgroundColor = themeColor;

            const clock = document.getElementById('clock');
            const date = document.getElementById('date');
            clock.style.color = '#343434';
            date.style.color = '#343434';
        } else {
            // Light mode is disabled, update clock color based on selected theme
            const clock = document.getElementById('clock');
            const themeColor = getComputedStyle(document.documentElement).getPropertyValue(`--${currentTheme}-color`);
            clock.style.color = themeColor;

            // Update date color with 70% opacity based on theme color
            const date = document.getElementById('date');
            date.style.color = `rgba(${parseInt(themeColor.slice(4, -1).split(', ')[0])}, ${parseInt(themeColor.slice(4, -1).split(', ')[1])}, ${parseInt(themeColor.slice(4, -1).split(', ')[2])}, 0.7)`;
        }
    }

    const themeOptions = document.querySelectorAll('.theme');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedTheme = option.id;
            currentTheme = selectedTheme;
            localStorage.setItem('currentTheme', selectedTheme);
            document.querySelector('.is-selected').classList.remove('is-selected');
            option.classList.add('is-selected');
            document.querySelector('.current-theme + p b').textContent = selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1);
            updateTimeAndDate(); // Update the time and date with the new theme color
        });
    });

    // Set the initial theme
    document.getElementById(currentTheme).classList.add('is-selected');
    document.querySelector('.current-theme + p b').textContent = currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);




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
        event.stopPropagation();
        settingFlag = settingFlag === 0 ? 1 : 0;
        const options = document.querySelector('.options');
        options.style.offsetWidth; // Force a reflow
        setTimeout(function() {
            options.classList.toggle('show');
        }, 10);

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

    // document.addEventListener('click', function(event) {
    //     const optionsDiv = document.querySelector('.options');
    //     const settingsButton = document.getElementById('settings-button');
        
    //     if (!optionsDiv.contains(event.target) && event.target !== settingsButton) {
    //         // Delay toggling the class by a very short duration
    //         setTimeout(function() {
    //             optionsDiv.classList.remove('show');
    //         }, 10);
    //     }
    // });

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
