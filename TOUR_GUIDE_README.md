# Tour Guide Implementation

## Overview

A comprehensive onboarding tour guide has been implemented for new carrier users using **react-joyride**. The tour automatically starts for first-time carrier users and guides them through the main features of the application.

## Features

### ✅ Automatic Tour Start
- Tour automatically starts for new carrier users (not brokers)
- Starts 1 second after page load for smooth user experience
- Only shows once per user (tracked in localStorage)

### ✅ Interactive Steps
The tour includes 8 steps that guide users through:

1. **Welcome Message** - Introduction to Lodify
2. **Dashboard** - Overview of the dashboard and its features
3. **Trips Management** - Main trips page navigation
4. **Trip Categories** - Explanation of trip tabs (Upcoming, Active, etc.)
5. **Create New Trips** - How to add new trips
6. **Notifications** - Real-time notification system
7. **Profile & Settings** - Account management
8. **Completion** - Final message with success confirmation

### ✅ Smart Navigation
- Automatically navigates to relevant pages during the tour
- Waits for page transitions before showing next step
- Smooth transitions between steps

### ✅ User Control
- **Next/Back buttons** - Navigate through steps
- **Skip button** - Exit tour at any time
- **Progress indicator** - Shows current step (e.g., "1 of 8")
- **Keyboard support** - ESC to close, Arrow keys to navigate

### ✅ Customized Design
- White tooltip with shadow for clarity
- Brand colors (primary: #EF6820)
- Rounded corners and smooth animations
- Overlay backdrop for focus
- Mobile-responsive design

## Implementation Details

### Files Created

1. **`src/components/TourGuide/TourGuide.jsx`**
   - Main tour guide component
   - Handles tour logic and navigation
   - Manages localStorage persistence
   - Provides `window.restartCarrierTour()` function for manual tour restart

2. **`src/components/TourGuide/index.js`**
   - Export file for clean imports

### Files Modified

1. **`src/layouts/AdminLayout.jsx`**
   - Added TourGuide component import and integration

2. **`src/layouts/Sidebar.jsx`**
   - Added data-tour attributes to menu items:
     - `data-tour="dashboard"` - Dashboard menu
     - `data-tour="trips"` - Trips menu
     - `data-tour="notifications"` - Notifications menu

3. **`src/layouts/SidebarFooter.jsx`**
   - Added `data-tour="profile"` to footer section

4. **`src/pages/Trips/index.jsx`**
   - Added `data-tour="trips-tabs"` to tab list
   - Added `data-tour="add-trip"` to add trip button

### Package Installed

```bash
npm install react-joyride
```

## Usage

### Automatic Start
The tour automatically starts for new carrier users when they first log in.

### Manual Restart
To manually restart the tour from anywhere in the app:

```javascript
window.restartCarrierTour();
```

You can add this to a settings page or help menu:

```jsx
<Button onClick={() => window.restartCarrierTour()}>
  Restart Tour
</Button>
```

### Tour Completion Tracking
Tour completion is tracked in localStorage:
```javascript
localStorage.getItem(`tour_completed_${userId}`)
```

To reset the tour for a user:
```javascript
localStorage.removeItem(`tour_completed_${userId}`);
```

## Customization

### Adding New Steps

Edit `src/components/TourGuide/TourGuide.jsx` and add new steps to the `steps` array:

```javascript
{
  target: '[data-tour="your-element"]',
  content: (
    <Box>
      <Text fontSize="16px" fontWeight="600" mb="8px">
        Step Title
      </Text>
      <Text fontSize="14px" color="#6B7280">
        Step description
      </Text>
    </Box>
  ),
  placement: "right",
  disableBeacon: true,
},
```

### Adding Data Tour Attributes

Add `data-tour="unique-id"` to any element you want to highlight:

```jsx
<div data-tour="feature-name">
  Your content here
</div>
```

### Changing Colors

Update the theme in `TourGuide.jsx`:

```javascript
styles={{
  options: {
    primaryColor: "#YOUR_COLOR", // Main brand color
    overlayColor: "rgba(0, 0, 0, 0.5)", // Backdrop opacity
  },
}}
```

## Tour Flow

```
1. Welcome (Center) 
   ↓
2. Dashboard (Sidebar - Right)
   ↓
3. Trips Menu (Sidebar - Right) → Navigates to /admin/trips
   ↓
4. Trip Tabs (Bottom)
   ↓
5. Add Trip Button (Left)
   ↓
6. Notifications (Sidebar - Bottom)
   ↓
7. Profile (Sidebar - Bottom)
   ↓
8. Completion (Center)
```

## Best Practices

1. **Keep steps concise** - Maximum 2-3 sentences per step
2. **Use clear language** - Avoid technical jargon
3. **Logical flow** - Guide users through a natural workflow
4. **Test thoroughly** - Ensure all target elements exist
5. **Mobile responsive** - Tour works on all screen sizes

## Troubleshooting

### Tour Not Showing
- Check if user is a carrier (not broker)
- Check localStorage: `tour_completed_${userId}`
- Verify data-tour attributes exist on target elements

### Element Not Found
- Ensure the target element exists before showing that step
- Check if element has correct `data-tour` attribute
- Verify element is visible and not hidden

### Tour Stuck
- Use browser console to call: `window.restartCarrierTour()`
- Clear localStorage and refresh

## Future Enhancements

Potential improvements:
- [ ] Add more steps for advanced features
- [ ] Different tours for brokers vs carriers
- [ ] Contextual tours for specific pages
- [ ] Video tutorials in tour steps
- [ ] Multi-language support
- [ ] Analytics tracking for tour completion
- [ ] A/B testing different tour flows

## Support

For issues or questions about the tour guide:
1. Check this documentation
2. Review `src/components/TourGuide/TourGuide.jsx`
3. Check react-joyride documentation: https://docs.react-joyride.com/

---

**Last Updated:** January 2026
**Version:** 1.0.0

