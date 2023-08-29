# 💖 NextTS - Atomic Design 💖

_Author:_ **Foxdemon 💌**

---

## Project Folder Structure

This document outlines the folder and subfolder structure of the project.

- `.husky`: Checks commit conventions and code before committing to Git.
- `components`: Contains all UI components, organized according to the Atomic Design architecture.
  - `atoms`: The most basic components that cannot be broken down into smaller components. Examples: buttons, inputs, text.
  - `molecules`: Combines atoms to create simpler components. Examples: form groups, card components.
  - `organisms`: Combines atoms, molecules, and other components to create larger components. Examples: header, footer.
  - `templates`: Layouts or overall interfaces for pages or page sections. Examples: Home page, Product page.
- `constants`: Contains constants and files related to fixed settings for the application.
- `contexts`: Contains React contexts for managing global state in the application.
- `hooks`: Contains custom hooks, aiding in reusing logic and avoiding logic in components within the application.
- `lib`: Contains self-created libraries and utilities.
- `locales`: Contains language files for i18n (multilingual) purposes in the application.
- `pages`: Contains the application's pages (routes).
- `public`: Contains static files like images, fonts, ...
- `services`: Handles interactions with APIs and WebSockets.
- `store`: Utilizes Redux to manage the global state of the application.
- `styles`: Contains CSS or SCSS files.
- `types`: Defines TypeScript types used in the application. Examples: request and response, ...
