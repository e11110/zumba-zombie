# PostureGuard Demo Guide 🚀

## Quick Demo Setup

### 1. Start the App
```bash
cd PostureGuard
npm start
```

### 2. Test Core Features

#### Permission Setup
- App will request notification permissions on first launch
- Grant permission to see the main interface

#### Main Interface
- **Header**: Shows "PostureGuard" with current monitoring status
- **Status Display**: Shows time since last movement and countdown to next alert
- **Control Buttons**: 
  - "🚀 Start Monitoring" - Begin posture monitoring
  - "🏃‍♀️ I'm Moving" - Reset movement timer (when monitoring)
  - "⏹️ Stop Monitoring" - Stop posture monitoring
- **Info Panel**: Explains how the app works

#### Posture Alert Simulation
To test the 15-minute alert without waiting:

1. **Modify the timer** (for demo purposes):
   - Open `App.tsx`
   - Change `POSTURE_CHECK_INTERVAL` from `15 * 60 * 1000` to `10 * 1000` (10 seconds)
   - Save and reload the app

2. **Start monitoring** and wait 10 seconds for the alert overlay to appear

3. **Alert Features**:
   - Shows random activity suggestion
   - Two action buttons:
     - "✅ I've completed the activity" - Marks activity as done
     - "🔄 Just moving around" - Indicates movement

#### Background Monitoring Test
1. **Start monitoring** in the app
2. **Send app to background** (press home button or switch apps)
3. **Wait for notification** (if permissions granted)
4. **Return to app** - Alert overlay should appear if 15+ minutes passed

### 3. Demo Scenarios

#### Scenario 1: New User Onboarding
- First launch experience
- Permission requests
- App setup and explanation

#### Scenario 2: Active Monitoring
- Show real-time status
- Demonstrate movement tracking
- Start/stop monitoring controls

#### Scenario 3: Posture Alert
- Trigger alert overlay
- Show activity suggestions
- Handle user responses

#### Scenario 4: Background Operation
- Background task registration
- Notification delivery
- App state management

### 4. Customization Demo

#### Change Alert Interval
```typescript
// In App.tsx, line 19
const POSTURE_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
```

#### Add New Activities
```typescript
// In getRandomActivity() function
const activities = [
  // ... existing activities
  "Do 30 seconds of planks",
  "Practice mindfulness for 2 minutes",
  "Send a message to a friend",
  "Do some light stretching"
];
```

#### Modify UI Colors
```typescript
// In styles object
backgroundColor: '#FF6B6B', // Change from '#007AFF'
```

### 5. Testing Checklist

- [ ] Notification permission request
- [ ] Main interface display
- [ ] Start monitoring functionality
- [ ] Status timer updates
- [ ] Control button functionality
- [ ] Alert overlay appearance
- [ ] Activity suggestions
- [ ] Button interactions
- [ ] Background task registration
- [ ] Notification permissions

### 6. Troubleshooting Demo Issues

#### Notifications Not Working
- Check device notification permissions
- Ensure app has notification access
- Verify background tasks are enabled

#### Alerts Not Appearing
- Verify notification permissions are granted
- Check if background tasks are enabled
- Ensure app is not in battery optimization mode

#### App Crashes
- Check console for error messages
- Verify all dependencies are installed
- Try clearing cache: `npm start --clear`

### 7. Performance Notes

- **Development Mode**: May have slower performance
- **Production Build**: Use `expo build` for better performance
- **Device Testing**: Test on physical devices for accurate background behavior

### 8. Demo Flow Example

1. **Launch App** → Show permission request
2. **Grant Permissions** → Display main interface
3. **Start Monitoring** → Show monitoring status
4. **Simulate Inactivity** → Wait for alert (or modify timer)
5. **Show Alert Overlay** → Display activity suggestion
6. **Complete Activity** → Return to monitoring
7. **Background Test** → Send app to background, wait for notification

---

**Demo Tip**: For presentations, consider pre-recording the app flow or using a device with the app already running to avoid permission delays.
