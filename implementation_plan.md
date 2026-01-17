# Fix 404 Errors on Image Resources

The user is experiencing 404 errors. Inspection reveals that `App.jsx` and `ThemeContext.jsx` use relative paths (`"logo.png"` and `"bg-image.jpg"`) for assets located in the `public` directory. If the application is accessed from any path other than root (or sometimes depending on browser/vite behavior), these relative paths might fail.

## Proposed Changes

### Configuration

- Add `"homepage": "https://vyceerulezu.github.io/ColGen"`

### Features

#### [MODIFY] [ThemeContext.jsx](file:///c:/Users/USER/Downloads/Frontend%20Boot%20Camp/Color%20Generator/src/context/ThemeContext.jsx)

- Add `randomizeTheme` function that generates a palette from a random hex code.

#### [MODIFY] [HeroSection.jsx](file:///c:/Users/USER/Downloads/Frontend%20Boot%20Camp/Color%20Generator/src/components/HeroSection.jsx)

- Add a "Surprise Me" button that calls `randomizeTheme` for instant generation without prompts.

## Verification Plan

### Manual Verification

- Run `npm run build` to ensure build succeeds.
- User to redeploy and verify 404s are gone.
