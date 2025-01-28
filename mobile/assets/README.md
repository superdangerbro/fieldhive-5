# FieldHive Mobile App Assets

This directory contains the app's image assets:

- `icon.png`: Main app icon (1024x1024 px)
- `adaptive-icon.png`: Android adaptive icon foreground (1024x1024 px)
- `splash.png`: Splash screen image (2048x2048 px)
- `favicon.png`: Web favicon (48x48 px)

## Image Requirements

### icon.png
- Size: 1024x1024 pixels
- Format: PNG
- Background: Transparent or solid color
- Purpose: Main app icon for iOS and basic Android icon

### adaptive-icon.png
- Size: 1024x1024 pixels
- Format: PNG
- Background: Transparent
- Safe zone: Keep important elements within the center 672x672 pixels
- Purpose: Android adaptive icon foreground layer

### splash.png
- Size: 2048x2048 pixels
- Format: PNG
- Background: Transparent
- Purpose: Splash screen image shown during app loading

### favicon.png
- Size: 48x48 pixels
- Format: PNG
- Purpose: Web browser favicon

## Design Guidelines

1. Keep the design consistent across all icons
2. Use simple, recognizable shapes
3. Ensure good contrast and visibility at small sizes
4. Follow platform-specific guidelines:
   - iOS: https://developer.apple.com/design/human-interface-guidelines/app-icons
   - Android: https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive

## Generating Icons

You can use tools like:
- Android Asset Studio: https://romannurik.github.io/AndroidAssetStudio/
- App Icon Generator: https://appicon.co/
- Figma with appropriate templates

Remember to test icons at various sizes and on different devices to ensure they look good in all contexts.
