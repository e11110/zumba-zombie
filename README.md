# Zumba Zombie 🧘‍♀️

A React Native/Expo social media health app that monitors your posture and encourages movement every 15 minutes to prevent sedentary behavior and promote better health habits.

## Features

- **Smart Movement Monitoring**: Tracks your movement patterns and inactivity periods
- **15-Minute Movement Alerts**: Automatically detects when you've been inactive for 15 minutes
- **Interactive Activities**: Provides engaging movement suggestions like yoga poses, stretches, and social interactions
- **Background Processing**: Continues monitoring even when the app is in the background
- **Smart Notifications**: Sends push notifications to remind you to move
- **Movement Tracking**: Tracks your last movement and shows countdown to next alert
- **User Control**: Start/stop monitoring and manual movement tracking

## How It Works

1. **Permission Setup**: The app requests notification permissions on first launch
2. **Background Monitoring**: Runs a background task that checks your movement status every minute
3. **Movement Detection**: Uses manual input and background task monitoring to track activity
4. **Alert System**: After 15 minutes of inactivity, shows an overlay with movement suggestions
5. **Activity Completion**: Users can mark activities as complete or indicate they're moving around

## Activities Included

- Do 5 shoulder rolls
- Stand up and stretch for 2 minutes
- Do 10 arm circles
- Take 5 deep breaths
- Walk around for 1 minute
- Do a quick yoga pose
- Call a friend and chat for 5 minutes
- Do some neck stretches
- Do 20 jumping jacks
- Practice deep breathing for 3 minutes
- Call a family member
- Do a quick dance move

## Technical Implementation

- **React Native + Expo**: Cross-platform mobile development
- **Background Tasks**: Implements `expo-background-fetch` and `expo-task-manager`
- **Notifications**: Uses `expo-notifications` for push alerts
- **State Management**: React hooks for app state and user interactions
- **Permission Handling**: Comprehensive permission requests for iOS and Android
- **Touch Interactions**: Smooth button interactions with TouchableOpacity

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PostureGuard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Configuration

### App Permissions

The app automatically requests the following permissions:

- **Notifications**: Required for movement alerts
- **Background Processing**: Required for continuous monitoring
- **Microphone**: Optional for voice-based activities

### Customization

You can modify the following constants in `App.tsx`:

- `POSTURE_CHECK_INTERVAL`: Time between posture checks (default: 15 minutes)
- `BACKGROUND_TASK`: Name of the background task
- Activity list in `getRandomActivity()` function

## Platform Support

- ✅ iOS (with background modes)
- ✅ Android (with foreground service)
- ⚠️ Web (limited background functionality)

## Background Processing

### iOS
- Uses `UIBackgroundModes` for background fetch and processing
- Limited by iOS background execution policies

### Android
- Implements foreground service for continuous monitoring
- Uses `WAKE_LOCK` permission for reliable background execution

## User Interface

### Main Screen
- **Header**: App title and current monitoring status
- **Status Display**: Shows time since last movement and countdown to next alert
- **Control Buttons**: Start/stop monitoring and manual movement tracking
- **Information Panel**: Explains how the app works

### Alert Overlay
- **Posture Alert**: Prominent notification after 15 minutes of inactivity
- **Activity Suggestion**: Random movement activity to complete
- **Action Buttons**: Mark activity complete or indicate movement

## Future Enhancements

- **AI Posture Detection**: Implement machine learning for accurate posture recognition
- **Camera Integration**: Add camera-based posture monitoring (when expo-camera API stabilizes)
- **Social Features**: Share movement achievements with friends
- **Custom Activities**: Allow users to create personalized movement routines
- **Analytics Dashboard**: Track posture improvement over time
- **Integration**: Connect with fitness apps and health platforms

## Troubleshooting

### Common Issues

1. **Notification Permission Denied**: Go to device settings and enable notification access
2. **Background Notifications Not Working**: Ensure notification permissions are granted
3. **App Stops Monitoring**: Check if battery optimization is disabled for the app

### Development Notes

- The app uses manual movement tracking for reliability
- Background tasks may be limited on some devices due to OS restrictions
- Notification permissions are required for the app to function

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on both iOS and Android
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Note**: This app is designed for educational and health improvement purposes. Always consult with healthcare professionals for medical advice related to posture and movement.
