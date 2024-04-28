let is24HourFormat = getStoredFormat();
let settingFlag = 1;
let currentTheme = getCurrentTheme();
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
updateLightMode();

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


// Function to update the font family of the clock based on the selected font
function updateClockFontFamily(font) {
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        switch (font) {
            case 'groovy':
                clockElement.style.fontFamily = 'Eugusto';
                break;
            case 'bright':
                clockElement.style.fontFamily = 'Adventuro';
                break;
            case 'subtle':
                clockElement.style.fontFamily = 'Monas';
                break;
            default:
                // Default font family
                clockElement.style.fontFamily = 'Eugusto'; // Change this to your default font family if needed
        }
        // Store the selected font in localStorage
        localStorage.setItem('selectedFont', font);
    } else {
        console.error('Clock element not found');
    }
}

// Function to retrieve the selected font from localStorage
function getSelectedFont() {
    return localStorage.getItem('selectedFont');
}

// Add event listeners for font selection
const fontOptions = document.querySelectorAll('.input[name="font"]');
fontOptions.forEach(option => {
    option.addEventListener('change', () => {
        const selectedFont = document.querySelector('input[name="font"]:checked').value;
        updateClockFontFamily(selectedFont);
    });
});


const initialFont = getSelectedFont() || document.querySelector('input[name="font"]:checked').value;
updateClockFontFamily(initialFont);

const selectedFontInput = document.querySelector(`input[name="font"][value="${initialFont}"]`);
if (selectedFontInput) {
    selectedFontInput.checked = true;
}

document.getElementById(currentTheme).classList.add('is-selected');
document.querySelector('.current-theme + p b').textContent = currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);

document.addEventListener("DOMContentLoaded", function() {
    const shortcutsContainer = document.getElementById('shortcuts');
    const addShortcutBtn = document.getElementById('addShortcutBtn');
    const shortcutUrlInput = document.getElementById('shortcutUrl');

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

    //save shortcuts to localStorage
    function saveShortcuts(shortcuts) {
        localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    }
    
// Define the default shortcuts array
const defaultShortcuts = [
    { name: 'gemini', url: 'https://gemini.google.com/app', icon: 'gemini.svg' },
    { name: 'chat', url: 'https://chat.openai.com', icon: 'chat.svg' },
    { name: 'youtube', url: 'https://youtube.com', icon: 'yt.svg' },
    { name: 'github', url: 'https://github.com', icon: 'github.svg' },
    { name: 'amazon', url: 'https://amazon.in', icon: 'amazon.svg' }
  ];
  
  function getShortcuts() {
    const storedShortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
    const allShortcuts = [...defaultShortcuts, ...storedShortcuts];
    return allShortcuts;
  }
  
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
  
    // Add shortcuts
    shortcuts.forEach((shortcut, index) => {
      const existingShortcutElement = shortcutsContainer.querySelector(`.shortcut .link[href="${shortcut.url}"]`);
      if (!existingShortcutElement) {
        const shortcutDiv = document.createElement('div');
        shortcutDiv.classList.add('shortcut');
  
        const link = document.createElement('a');
        link.classList.add('link');
        link.href = shortcut.url;
        link.target = '_blank';
        shortcutDiv.appendChild(link);
  
        if (shortcut.icon) {
            const shortcutIcon = document.createElement('img');
            shortcutIcon.classList.add('shortcut-icon');
            shortcutIcon.src = shortcut.icon;
            link.appendChild(shortcutIcon);
        } else {
            const urlName = new URL(shortcut.url).hostname.replace('www.', '');
            const urlNameParagraph = document.createElement('p');
            urlNameParagraph.textContent = urlName;
            urlNameParagraph.classList.add('shortcut-text')
            link.appendChild(urlNameParagraph);
        }

        shortcutDiv.appendChild(link);
  
        const deleteBtn = document.createElement('button');
        const imgIcon = document.createElement('img');
        imgIcon.classList.add('delete-icon');
        imgIcon.src = 'del-icon.svg';
        imgIcon.alt = 'Delete';
        deleteBtn.appendChild(imgIcon);
        deleteBtn.classList.add('delete-btn');
        deleteBtn.classList.toggle('hidden', settingFlag !== 0);
  
        deleteBtn.addEventListener('click', function() {
          const filteredShortcuts = shortcuts.filter(s => s.url !== shortcut.url);
          saveShortcuts(filteredShortcuts);
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
            const name = new URL(url).hostname.replace('www.', '');
            const shortcuts = getShortcuts();
            shortcuts.push({ name, url });
            saveShortcuts(shortcuts);
            displayShortcuts();
            shortcutUrlInput.value = '';
        }
    });

    // Display initial shortcuts when the page loads
    displayShortcuts();

    const settingsButton = document.getElementById("settings-button");
    const addShortcut = document.getElementById('addShortcut');
    const deleteBtn = document.querySelectorAll('.delete-btn');
    const msgElement = document.querySelector('.msg');

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
            addShortcutBtn.addEventListener('keydown', handleEnterKey);
            // msgElement.focus();
        }
    
        // Update visibility of delete buttons
        displayShortcuts();
    });

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
