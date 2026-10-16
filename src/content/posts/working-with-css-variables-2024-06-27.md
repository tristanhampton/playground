---
layout: blog
type: post
title: Working with CSS Variables
date: 2024-06-27T19:33:37.238Z
summary: Thoughts on using CSS Variables and how they've impacted my day to day.
tags: blog
---
In the lifespan of the internet, I'm a fairly new developer at only five years old post grad. Most of my CSS knowledge was built on learning to use SCSS, @mixins, and SCSS variables.

Last year I built the theme on [Toronto Community Housing](https://torontohousing.ca). As is the case with lots of organizations, the design of a website can often change, and many times those changes can be foundational to the site. This can be difficult to handle depending on how the theme is built. 

During this build, I outlined a number of CSS variables in a single SCSS file called `_design-system.scss` that controlled the spacing for page margins, spacing between components, and a fluid type size that controlled the sizing of all other text elements in the site along with the use of `em`'s. 

Side note: I know em's have been around forever. In my front end education `em`'s were often described as difficult to work with and should often be avoided in favour of `rem`'s. My opinion on `em`s has grown since then and I've wholeheartedly embraced them, but that's a discussion for another post.

```SCSS
:root {
  --col: 5vw;
  --baseline: 1.2rem; // use multiples of this for vertical spacing

  --spacer-size: 2; // use this for spacing between components
  --spacer: calc(var(--baseline)*var(--spacer-size));

  // margin size handles the number of columns of space between content and browser edge
  --margin-large-size: 2;
  --margin-small-size: 2;
  --margin-small: calc(var(--col)*var(--margin-small-size));
  --margin-large: calc(var(--col)*var(--margin-large-size));

  // Typography
  --font-size: clamp(1.6rem, 2vw, 2rem);
  --heading-1: 2.6em;
  --heading-2: 2em;
  --heading-3: 1.6em;
  --heading-4: 1.4em;
  --heading-5: 1.2em;
  --heading-6: 1em;
  --intro-text: 1.2em;
  --small-text: 0.9em;
  --large-text: 1.5em;
  --heading-accordion: 1em;
  --captions: 0.75em;


  @media (min-width: 320px) {
    --spacer-size: 4;
  }

  @media (min-width: 768px) {
    --spacer-size: 6;
    --margin-large-size: 3;
  }

  @media (min-width: 1024px) {
    --small-text: 0.666em; 
  }

  @media (min-width: 1440px) {
    --spacer-size: 8;
    --margin-large-size: 5;
  }
  
  @media (min-width: 1920px) {
    --spacer-size: 10;
    --margin-large-size: 5;
    --margin-small-size: 2;
    --font-size: clamp(1.6rem, 1vw, 2.4rem);
  }

  @media (min-width: 2400px) {
    --margin-small-size: 3;
    --margin-large-size: 5;
  }
}
```
This was what now feels like a primitive implementation of a simple design system, but it made making updates and tweaks to spacing at different screen sizes incredibly easy because *I only had to make changes in this file and every component using these variables would update accordingly*. Now I could hop onto a call with the designer or QA analyst, share my screen, and make sweeping changes on the fly.

A year later, I've worked closely with a designer to make a more robust design system:

```SCSS
/* System Variables
 * ----------------------------------------------- */
:root {
  //set to 10px to use rem as font unit. 1.6rem = 16px
  font-size: 16px;
  font-size: 62.5%;
  
  --font-size: calc(clamp(1.6rem, 2vw, 2rem));

  --baseline: 0.8rem;
  --col: 5vw;

  --heading-1: 2.6em; // 72 // 52
  --heading-2: 2em; // 56 // 40
  --heading-3: 1.6em; // 48 // 32
  --heading-4: 1.4em; // 40 // 30
  --heading-5: 1.2em; // 36 // 28
  --heading-6: 1em; // 32 // 26

  --intro-text: 1.2em; // 24
  --small-text: 0.9em; // 18
  --large-text: 1.5em; // 36
  --heading-accordion: 1em; // 24
  --captions: 0.75em; // 18
}

/* Colours
 * ----------------------------------------------- */
:root {
  --black: #000;
  --white: #FFF;

  // Primary
  --white-000: #FFFFFF;
  --green-500: #00B38F;
  --black-500: #3D3F4D;
  --yellow-500: #FFE75D;
  --red-500: #DB6666;
  --snow-500: #F3F5FB;

  // Seconadry Greens
  --green-800: #004839;
  --green-400: #5CCFB8;
  --green-300: #99E1D2;
  --green-200: #C2EDE4;

  // Secondary Reds
  --red-600: #BA5454;
  --red-400: #E89D9D;
  --red-300: #F1C2C2;
  --red-200: #F7DADA;

  // Secondary Yellows
  --yellow-400: #FFF098;
  --yellow-300: #FFF5BE;
  --yellow-200: #FFF9D8;

  // Secondary Neutrals
  --black-400: #83848D;
  --black-300: #B1B2B8;
  --black-200: #D1D1D4;
  --snow-400: #F8F9FD;
  --snow-300: #FAFBFD;
  --snow-200: #FCFDFE;
}

/* Typography
 * ----------------------------------------------- */
:root {
  --text-primary: var(--black-500);
  --text-link-primary: var(--green-500);
  --text-link-hover: var(--green-800);
  --text-invert-primary: var(--snow-500);
  --text-invert-hover: var(--red-500);
  --text-invert-secondary: var(--black-300);

  // Vertical Spacing
  --vertical-type-spacing-size-xs: 1;
  --vertical-type-spacing-size-sm: 1;
  --vertical-type-spacing-size-med: 2;
  --vertical-type-spacing-size-lrg: 2;
  
  --vertical-type-spacing-xs: calc(var(--baseline) * var(--vertical-type-spacing-size-xs));
  --vertical-type-spacing-sm: calc(var(--baseline) * var(--vertical-type-spacing-size-sm));
  --vertical-type-spacing-med: calc(var(--baseline) * var(--vertical-type-spacing-size-med));
  --vertical-type-spacing-lrg: calc(var(--baseline) * var(--vertical-type-spacing-size-lrg));


  @media screen and (min-width: 768px) {
    --vertical-type-spacing-size-xs: 1;
    --vertical-type-spacing-size-sm: 2;
    --vertical-type-spacing-size-med: 3;
    --vertical-type-spacing-size-lrg: 3;
  }

  @media screen and (min-width: 1020px) {
    --vertical-type-spacing-size-xs: 1;
    --vertical-type-spacing-size-sm: 2;
    --vertical-type-spacing-size-med: 3;
    --vertical-type-spacing-size-lrg: 3;
  }
}

/* Surface
 * ----------------------------------------------- */
// Surface variables essentially work out to be background colours for things like CTA's, Tiles, etc
:root {
  --surface-primary: var(--snow-500);
  --surface-invert: var(--black-500);
  --surface-hover: var(--red-500);

  --surface-navigation-primary: var(--black-200);
  --surface-navigation-secondary: var(--black-200);

  --surface-link-primary: var(--green-500);
  --surface-link-hover: var(--red-500);
  --surface-link-invert: var(--snow-500);
  --surface-disabled: var(--black-400);

  --surface-alert: var(--snow-300);
  --surface-alert-warning: var(--yellow-300);
  --surface-alert-emergency: var(--red-300);
}

/* Icons
* ----------------------------------------------- */
:root {
  --icon-invert-primary: var(--black-300);
  --icon-primary: var(--black-500);
  --icon-invert-secondary: var(--snow-500);
  --icon-disabled: var(--black-300);
}

/* Borders
 * ----------------------------------------------- */
:root {

  // Color
  --border-color-primary: var(--red-500);
  --border-color-secondary: var(--black-500);
  --border-color-invert-primary: var(--red-500);
  --border-color-invert-secondary: var(--black-300);
  --border-color-link-primary: var(--green-500);
  --border-color-link-hover: var(--red-500);

  // Radius
  --border-radius-000: 0;
  --border-radius-200: 0.2rem;
  --border-radius-400: 0.4rem;
  --border-radius-800: 0.8rem;

  --radius-frame-000: var(--border-radius-000);
  --radius-frame-500: var(--border-radius-800);

  --radius-media-000: var(--border-radius-000);
  --radius-media-400: var(--border-radius-400);

  // Thickness
  --border-thickness-000: 0;
  --border-thickness-100: 0.1rem;
  --border-thickness-200: 0.2rem;
}

/* Spacing
 * ----------------------------------------------- */
:root {

  // Padding
  --padding-000: 0;
  --padding-100: calc(var(--baseline)*1);
  --padding-200: calc(var(--baseline)*2);
  --padding-300: calc(var(--baseline)*3);
  --padding-400: calc(var(--baseline)*4);
  --padding-500: calc(var(--baseline)*5);
  --padding-600: calc(var(--baseline)*6);
  --padding-700: calc(var(--baseline)*7);
  --padding-800: calc(var(--baseline)*8);
  --padding-900: calc(var(--baseline)*9);
  --padding-1000: calc(var(--baseline)*10);

  // Margin
  --margin-000: 0;
  --margin-100: calc(var(--baseline)*1);
  --margin-200: calc(var(--baseline)*2);
  --margin-300: calc(var(--baseline)*3);
  --margin-400: calc(var(--baseline)*4);
  --margin-500: calc(var(--baseline)*5);
  --margin-600: calc(var(--baseline)*6);
  --margin-700: calc(var(--baseline)*7);
  --margin-800: calc(var(--baseline)*8);
  --margin-900: calc(var(--baseline)*9);
  --margin-1000: calc(var(--baseline)*10);

  // Components
  --component-margin-top-first: var(--margin-500);
  --component-margin-top-default: var(--margin-1000);
  
  // Text
  --text-margin-100: calc(var(--baseline)*1);
  --text-margin-200: calc(var(--baseline)*2);
  --text-margin-300: calc(var(--baseline)*3);
  --text-margin-500: calc(var(--baseline)*5);

  // Page Margin
  --page-margin-100: calc(var(--col)*1);
  --page-margin-200: calc(var(--col)*2);
  --page-margin-300: calc(var(--col)*3);
  --page-margin-400: calc(var(--col)*4);
  --page-margin-500: calc(var(--col)*5);
  --page-margin-600: calc(var(--col)*6);
  --page-margin-700: calc(var(--col)*7);
  --page-margin-800: calc(var(--col)*8);

  --margin-small: var(--page-margin-100);
  --margin-medium: var(--page-margin-100);
  --margin-large: var(--page-margin-100);

  @media screen and (min-width: 768px) {
    --margin-small: var(--page-margin-100);
    --margin-medium: var(--page-margin-200);
    --margin-large: var(--page-margin-200);
  }

  @media screen and (min-width: 1020px) {
    --margin-small: var(--page-margin-200);
    --margin-medium: var(--page-margin-300);
    --margin-large: var(--page-margin-500);
  }

  @media screen and (min-width: 1440px) {
    --margin-small: var(--page-margin-200);
    --margin-medium: var(--page-margin-400);
    --margin-large: var(--page-margin-500);
  }
}

/* Buttons
 * ----------------------------------------------- */
// Primary/Secondary buttons are built in _buttons.scss and can be used as a class or mixin where needed
:root {
  --button-padding: var(--padding-200) var(--padding-300);
  --button-font-weight: 600;
  --button-border-radius: var(--border-radius-800);
  
  // Primary Button
  --button-primary-surface: var(--surface-link-hover);
  --button-primary-border: var(--border-thickness-200) solid var(--surface-link-hover);
  --button-primary-color: var(--text-invert-primary);
  --button-primary-surface: var(--surface-link-hover);
  --button-primary-border-hover: var(--border-thickness-200) solid var(--surface-link-hover);
  --button-primary-color: var(--text-invert-primary);

  --button-primary-surface-hover: var(--surface-link-invert);
  --button-primary-color-hover: var(--text-link-primary);
  
  // Secondary Button
  --button-secondary-surface: var(--surface-link-primary);
  --button-secondary-border: var(--border-thickness-200) solid var(--surface-link-primary);
  --button-secondary-color: var(--text-invert-primary);
  --button-secondary-surface: var(--surface-link-primary);
  --button-secondary-border-hover: var(--border-thickness-200) solid var(--surface-link-primary);
  --button-secondary-color: var(--text-invert-primary);

  --button-secondary-surface-hover: var(--surface-link-invert);
  --button-secondary-color-hover: var(--text-link-primary);
}

/* Webforms
 * ----------------------------------------------- */
:root {
  --form-item-spacing: var(--padding-400); // spacing between form items: input, select, textarea etc
  --form-input-spacing: var(--padding-100); // spacing between elements IN form items: label, input, description etc
  --input-height: calc(var(--baseline) * 5);
  --input-padding: var(--padding-100);
  --input-border: 0.1rem solid var(--black);
  --input-border-radius: var(--radius-media-400);

  --select-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12.07,15.21c.07-.11,6.47-6.58,9.62-9.71a1.08,1.08,0,0,1,.56-.31.72.72,0,0,1,.51.19c.33.28.62.6.93.9s.41.72,0,1.13L12.51,18.58a.62.62,0,0,1-1,0L.34,7.45c-.46-.46-.46-.74,0-1.2l.81-.81a.68.68,0,0,1,1.1,0Z'/%3E%3C/svg%3E%0A");

  --textarea-height: calc(var(--baseline)*10); // minimum height of a text area

  --fieldset-border: 0.1rem solid var(--black);
  --fieldset-padding: var(--padding-200);
  --fieldset-legend-size: var(--heading-3);
  --fieldset-legend-weight: 600;

  --check-radio-color: var(--green-800);
  --check-radio-size: calc(var(--baseline) * 3);
  --check-radio-spacing: var(--padding-100);
  --check-radio-label-size: var(--font-size);
  --check-radio-label-weight: 400;

  --label-size: var(--heading-6);
  --label-weight: 500;

  --description-size: var(--font-size);

  --file-help-size: var(--captions);

  --color-picker-width: calc(var(--baseline) * 14);
  --color-picker-height: calc(var(--baseline) * 2);

  --range-accent-color: var(--green-800);

  --scale-accent-color: var(--green-800);
}

/* Tables
 * ----------------------------------------------- */
:root {
  --table-header-surface: var(--black-400);
  --table-header-color: var(--black);
  --table-header-cell-padding: var(--padding-100) var(--padding-200);
  --table-header-cell-border: 0.1rem solid var(--black);

  --table-body-cell-padding: var(--padding-100) var(--padding-200);
  --table-body-cell-border: 0.1rem solid var(--black);

  --table-body-row-even-surface: var(--snow-500);
  --table-body-row-even-color: var(--black);
  --table-body-row-odd-surface: var(--snow-200);
  --table-body-row-odd-color: var(--black);
}

```
It's possible that I've gone a little overboard with the number of variables in this file. However, this has given me a very strong starting point when building new themes and makes it easy to make broad changes at the start of a project by updating a single file. The real power comes from being able to make media queries in a single file that apply to a variable rather than a component, so I don't have to worry about writing the same media query for each component that requires the same spacing.

What makes this even better is that the designer's Figma files use the same variable names throughout the mockups. So rather than roughly guessing at spacing and colours, or having a number of inconsistent values used throughout the site, we can both pick and choose from predetermined values. No more guess work! 

Now that every part of the site is built with these variables, development has sped up exponentially for me. Making QA changes has also sped up, and clients have been very happy with the speed that things are initially built and their requests for changes can be made.
