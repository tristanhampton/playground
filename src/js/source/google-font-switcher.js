/**
 * Fetches Google Fonts from the Google Fonts API. Stores in localStorage for caching.
 * @returns {Promise<Array>} Array of Google Fonts
 */
const fetchGoogleFonts = async () => {
  const storageKey = "googleFonts";
  const cacheTimeKey = "googleFontsCacheTime";
  const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Check localStorage for cached data
  const cachedFonts = localStorage.getItem(storageKey);
  const cacheTime = localStorage.getItem(cacheTimeKey);

  if (cachedFonts && cacheTime && Date.now() - cacheTime < cacheDuration) {
    console.info("Using cached Google Fonts");
    return JSON.parse(cachedFonts);
  }

  console.info('Fetching fresh font data from Google');
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${'AIzaSyDe2d6-kgFd-M3b86YFxnVkbaIU1G4glWg'}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch Google fonts: ' + response.statusText);
    }

    const data = await response.json();
    const fonts = data.items.map(font => font);

    // Store in localStorage
    localStorage.setItem(storageKey, JSON.stringify(fonts));
    localStorage.setItem(cacheTimeKey, Date.now());

    return fonts; // Extract font names
  } catch (error) {
    console.error("Error fetching Google Fonts:", error);
    return [];
  }
}

/**
 * Builds the font switcher markup and appends it to the body
 * @param {array} fonts 
 */
const buildSwitcherMarkup = (fonts) => {
  const body = document.querySelector('body');
  const switcher = document.createElement('div');
  switcher.classList.add('google-font-switcher');
  switcher.innerHTML = `
    <label for="google-font-switcher">Choose a Google font:</label>
    <select id="google-font-switcher">
      <option value="">Default</option>
      ${fonts.map(font => `<option 
        data-100="${font.files[100] ? font.files[100] : ''}" 
        data-200="${font.files[200] ? font.files[200] : ''}" 
        data-300="${font.files[300] ? font.files[300] : ''}" 
        data-400="${font.files[400] ? font.files[400] : ''}" 
        data-500="${font.files[500] ? font.files[500] : ''}" 
        data-600="${font.files[600] ? font.files[600] : ''}" 
        data-700="${font.files[700] ? font.files[700] : ''}" 
        data-800="${font.files[800] ? font.files[800] : ''}" 
        data-900="${font.files[900] ? font.files[900] : ''}" 
        value="${font.family}">
        ${font.family}
      </option>`).join('')}
    </select>
  `;
  body.appendChild(switcher);
}

/**
 * Appends styles for the font switcher
 */
const appendSwitcherStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .google-font-switcher {
      position: fixed;
      bottom: 1rem;
      left: 1rem;
      padding: 1rem;
      background-color: white;
      border: 1px solid black;
      z-index: 1000;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Takes a font family and applies it to the document by creating a link to the font file and updating the font styles
 * @param {string} font the human readable font family
 */
const applyFont = (font) => {
  console.log(font)
  // Remove previous font file link if we have one
  const fontLink = document.querySelector('#google-font-link');
  if (fontLink) {
    fontLink.remove();
  }

  // Remove previous font styles if we have any
  const styleLink = document.querySelector('#google-font-style');
  if (styleLink) {
    styleLink.remove();
  }

  if (font) {
    // Download font
    const link = document.createElement('link');
    link.id = 'google-font-link';
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Update font styles
    const style = document.createElement('style');
    style.id = 'google-font-style';
    style.innerHTML = `
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      .h1,
      .h2,
      .h3,
      .h4,
      .h5,
      .h6 {
        font-family: '${font}' !important;
      }
    `;

    document.head.appendChild(style);
  }
}

/**
 * Initializes the change event on the font switcher
 */
const initChangeOnSwitch = () => {
  const switcher = document.querySelector('#google-font-switcher');
  switcher.addEventListener('change', (event) => {
    const selectedFont = event.target.value;
    applyFont(selectedFont);
  });
}

/**
 * Initializes keyboard controls to swap back and forth between fonts using alt + left/right
 * @param {array} fonts 
 */
const initKeyboardControls = (fonts) => {
  const switcher = document.querySelector('#google-font-switcher');

  document.addEventListener('keydown', (event) => {
    let switcherActiveIndex = switcher.selectedIndex;

    if (!switcher) return;


    if (event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();

      if (fonts.length === 0) return;

      if (event.key === "ArrowRight") {
        switcherActiveIndex = (switcherActiveIndex + 1) % fonts.length;
      } else if (event.key === "ArrowLeft") {
        switcherActiveIndex = (switcherActiveIndex - 1 + fonts.length) % fonts.length;
      }

      const fontFamily = fonts[switcherActiveIndex].family;
      applyFont(fontFamily);
      switcher.selectedIndex = switcherActiveIndex
    }
  });
}

/**
 * Initializes the Google Font Switcher module
 */
export const initGoogleFontSwitcher = async () => {
  const fonts = await fetchGoogleFonts();
  buildSwitcherMarkup(fonts);
  appendSwitcherStyles();
  initChangeOnSwitch();
  initKeyboardControls(fonts);
}