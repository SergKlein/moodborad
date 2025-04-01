# Moodboard AI Design Project

## Overview

This design project is a static HTML/CSS/JS prototype for the Moodboard AI project. The design follows a dark theme based on the UX principles from [dzine.ai](https://dzine.ai) and the interface structure and styling from [cnstrct.ai](https://cnstrct.ai).

## Project Structure

```
/design/
│
├── dashboard.html          # Main dashboard page
├── css/
│   ├── main.css            # Main styles
│   └── variables.css       # CSS variables (colors, fonts)
│
├── js/
│   └── dashboard.js        # Dashboard interactivity
│
└── assets/
    ├── images/             # Demo images
    └── icons/              # SVG icons
```

## Usage

1. Open `dashboard.html` in any modern browser.
2. For a complete demonstration, add project images to the `assets/images/` folder:
   - `project1.jpg` - image for "Modern Living Room" project
   - `project2.jpg` - image for "Scandinavian Bedroom" project
   - `project3.jpg` - image for "Minimalist Kitchen" project

## Implemented Features

- **Dark Theme**: Modern dark UI inspired by cnstrct.ai and dzine.ai
- **Navigation**: Minimal top navigation bar with key sections
- **Hero Section**: Clean, centered hero section with gradient text accents
- **Quick Actions**: Easy access to common tasks
- **Projects Display**: Grid layout for recent projects
- **Style Browser**: Visual style selection with hover effects
- **Features Section**: Highlighted platform capabilities with SVG icons
- **CTA Section**: Clear call-to-action for new users
- **Modal Windows**: Project creation dialog with options
- **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes

## Design Principles

1. **Color Scheme**: Dark theme with purple/indigo accent colors
2. **Typography**: Clean, readable Inter font with carefully chosen sizes and weights
3. **Spacing**: Consistent spacing using a variable-based system
4. **Interactivity**: Subtle hover effects and transitions to enhance usability
5. **Responsiveness**: Mobile-first approach with appropriate breakpoints

## Expansion Notes

For adding new pages and components, it is recommended to:

1. Follow the established dark theme color palette defined in variables.css
2. Maintain consistent spacing and typography
3. Use SVG icons with the same styling approach
4. Keep the minimalist aesthetic across all new elements

## Technical Notes

The prototype uses:
- CSS Variables for consistent theming
- Flexbox and Grid for layouts
- JavaScript for interactive elements
- SVG icons for better scaling and theme compatibility