import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, AppState, TouchableOpacity, Dimensions, Modal } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';

const BACKGROUND_TASK = 'ZUMBA_ZOMBIE_MONITORING';
const DEFAULT_TIMER = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_TIMER = 30 * 60 * 1000; // 30 minutes in milliseconds

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('front');
  const [isPostureAlert, setIsPostureAlert] = useState(false);
  const [lastMovementTime, setLastMovementTime] = useState(Date.now());
  const [currentActivity, setCurrentActivity] = useState<string>('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_TIMER);
  const [customTimer, setCustomTimer] = useState(DEFAULT_TIMER);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [zompoints, setZompoints] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const appState = useRef(AppState.currentState);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Configure notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Background task for zombie monitoring
  TaskManager.defineTask(BACKGROUND_TASK, async () => {
    const now = Date.now();
    if (now - lastMovementTime > customTimer) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🧟‍♂️ ZOMBIE ALERT! 🧟‍♀️",
          body: "You're turning into a zombie! Time to move and stay alive!",
        },
        trigger: null,
      });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }
    return BackgroundFetch.BackgroundFetchResult.NoData;
  });

  // Format time as minutes:seconds
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format timer options for display
  const formatTimerOption = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  // Start countdown timer
  const startCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    countdownRef.current = setInterval(() => {
      setTimeRemaining(prevTime => {
        const newTime = prevTime - 1000; // Decrease by 1 second
        
        if (newTime <= 0) {
          // Time's up - show zombie alert
          const activityData = getRandomActivity();
          setIsPostureAlert(true);
          setCurrentActivity(activityData.activity);
          setPointsEarned(activityData.points);
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          return customTimer; // Reset to custom time
        }
        
        return newTime;
      });
    }, 1000); // Update every second
  };

  // Stop countdown timer
  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setTimeRemaining(customTimer);
  };

  // Reset countdown timer
  const resetCountdown = () => {
    setTimeRemaining(customTimer);
    if (isMonitoring) {
      startCountdown();
    }
  };

  // Update custom timer
  const updateTimer = (newTimer: number) => {
    setCustomTimer(newTimer);
    setTimeRemaining(newTimer);
    setShowTimerModal(false);
    if (isMonitoring) {
      stopCountdown();
      startCountdown();
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Request notification permissions
        const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
        if (notificationStatus !== 'granted') {
          Alert.alert('Permission needed', 'Notification permission is required for zombie alerts');
        } else {
          setHasPermission(true);
        }

        // Register background task
        try {
          await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
            minimumInterval: 60, // Check every minute
            stopOnTerminate: false,
            startOnBoot: true,
          });
        } catch (err) {
          console.log('Background task registration failed:', err);
        }
      } catch (error) {
        console.error('Error setting up permissions:', error);
        setHasPermission(false);
      }
    })();

    // Cleanup on unmount
    return () => {
      stopCountdown();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground, check if we need to show zombie alert
        const now = Date.now();
        if (now - lastMovementTime > customTimer) {
          const activityData = getRandomActivity();
          setIsPostureAlert(true);
          setCurrentActivity(activityData.activity);
          setPointsEarned(activityData.points);
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, [lastMovementTime, customTimer]);

  const getRandomActivity = (): { activity: string; points: number } => {
    const activities = [
      { activity: "Do 5 zombie arm raises", points: 10 },
      { activity: "Walk like a zombie for 2 minutes", points: 25 },
      { activity: "Do 10 zombie shuffles", points: 15 },
      { activity: "Take 5 deep zombie breaths", points: 8 },
      { activity: "Zombie dance for 1 minute", points: 20 },
      { activity: "Do a zombie yoga pose", points: 18 },
      { activity: "Call a friend and do zombie voice", points: 30 },
      { activity: "Do some zombie neck stretches", points: 12 },
      { activity: "Do 20 zombie jumping jacks", points: 25 },
      { activity: "Practice zombie mindfulness for 3 minutes", points: 22 },
      { activity: "Send a zombie message to family", points: 15 },
      { activity: "Do a quick zombie dance move", points: 12 },
      { activity: "Zombie walk around the room", points: 18 },
      { activity: "Practice zombie survival moves", points: 35 }
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  const handleMovement = () => {
    setLastMovementTime(Date.now());
    setIsPostureAlert(false);
    resetCountdown();
  };

  const handleChangeTask = () => {
    // Get a new random activity
    const activityData = getRandomActivity();
    setCurrentActivity(activityData.activity);
    setPointsEarned(activityData.points);
    // Keep the alert open with the new activity
  };

  const handleActivityComplete = () => {
    // Award points and show animation
    setZompoints(prev => prev + pointsEarned);
    setShowPointsAnimation(true);
    
    // Hide animation after 2 seconds
    setTimeout(() => {
      setShowPointsAnimation(false);
    }, 2000);
    
    setIsPostureAlert(false);
    setLastMovementTime(Date.now());
    resetCountdown();
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setLastMovementTime(Date.now());
    setTimeRemaining(customTimer);
    startCountdown();
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    stopCountdown();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Setting up Zumba Zombie...</Text>
        </View>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Permission Required</Text>
          <Text style={styles.errorText}>
            Zumba Zombie needs notification permissions to send you zombie alerts.
          </Text>
          <Text style={styles.errorText}>
            Please enable notification permissions in your device settings.
          </Text>
        </View>
      </View>
    );
  }

  // For testing purposes, show zombie alert directly
  if (isPostureAlert) {
    return (
      <View style={styles.alertContainer}>
        <View style={styles.alertContent}>
          {/* Zompoints display */}
          <View style={styles.zompointsDisplay}>
            <Text style={styles.zompointsText}>🧟‍♂️ Zompoints: {zompoints}</Text>
          </View>

          <Text style={styles.alertTitle}>🧟‍♂️ ZOMBIE ALERT! 🧟‍♀️</Text>
          <Text style={styles.alertText}>
            You're turning into a zombie! Time to move and stay alive!
          </Text>
          <Text style={styles.activityText}>
            {currentActivity || "Do 5 zombie arm raises"}
          </Text>
          
          {/* Points reward display */}
          <View style={styles.pointsReward}>
            <Text style={styles.pointsRewardText}>
              Earn {pointsEarned || 10} Zompoints! 🧟‍♂️
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleActivityComplete}>
              <Text style={styles.buttonText}>✅ Activity Complete!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleChangeTask}>
              <Text style={styles.buttonText}>🔄 Change Task</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Points animation overlay */}
        {showPointsAnimation && (
          <View style={styles.pointsAnimation}>
            <Text style={styles.pointsAnimationText}>
              +{pointsEarned} Zompoints! 🧟‍♂️
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraSimulation}>
        <View style={styles.cameraHeader}>
          <Text style={styles.cameraText}>🧟‍♂️ Zombie Monitor</Text>
          <Text style={styles.cameraSubtext}>
            {cameraType === 'front' ? 'Front Camera Active' : 'Back Camera Active'}
          </Text>
        </View>
        
        <View style={styles.cameraContent}>
          <Text style={styles.cameraPlaceholder}>
            {isMonitoring ? '🧟‍♂️ Monitoring for Zombies...' : '🧟‍♀️ Ready to Hunt Zombies'}
          </Text>
          <Text style={styles.cameraInfo}>
            Camera integration will be added when expo-camera API stabilizes
          </Text>
        </View>
      </View>

      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.headerText}>🧟‍♂️ Zumba Zombie 🧟‍♀️</Text>
          <Text style={styles.subtitle}>
            {isMonitoring ? 'Hunting for zombie behavior...' : 'Ready to start zombie hunting'}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Last movement: {Math.floor((Date.now() - lastMovementTime) / 1000)}s ago
          </Text>
          <Text style={styles.statusText}>
            Next zombie alert in: {formatTime(timeRemaining)}
          </Text>
          <Text style={styles.timerInfo}>
            Timer set to: {formatTimerOption(customTimer)}
          </Text>
        </View>

        <View style={styles.controls}>
          {!isMonitoring ? (
            <>
              <TouchableOpacity style={styles.controlButton} onPress={startMonitoring}>
                <Text style={styles.controlButtonText}>🧟‍♂️ Start Zombie Hunt</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={() => setShowTimerModal(true)}>
                <Text style={styles.controlButtonText}>⏰ Set Timer</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.controlButton} onPress={handleMovement}>
                <Text style={styles.controlButtonText}>🏃‍♀️ I'm Moving!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={() => setCameraType(
                cameraType === 'back' ? 'front' : 'back'
              )}>
                <Text style={styles.controlButtonText}>📷 Switch Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={stopMonitoring}>
                <Text style={styles.controlButtonText}>⏹️ Stop Hunting</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <Text style={styles.infoText}>• Monitors for zombie-like behavior</Text>
          <Text style={styles.infoText}>• Alerts when you become too still</Text>
          <Text style={styles.infoText}>• Suggests zombie-fighting activities</Text>
          <Text style={styles.infoText}>• Customizable timer up to 30 minutes</Text>
        </View>
      </View>

      {/* Timer Settings Modal */}
      <Modal
        visible={showTimerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⏰ Set Zombie Alert Timer</Text>
            <Text style={styles.modalSubtitle}>Choose how long before you turn into a zombie</Text>
            
            {[5, 10, 15, 20, 25, 30].map((minutes) => (
              <TouchableOpacity
                key={minutes}
                style={[
                  styles.timerOption,
                  customTimer === minutes * 60 * 1000 && styles.timerOptionSelected
                ]}
                onPress={() => updateTimer(minutes * 60 * 1000)}
              >
                <Text style={[
                  styles.timerOptionText,
                  customTimer === minutes * 60 * 1000 && styles.timerOptionTextSelected
                ]}>
                  {minutes} minute{minutes !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowTimerModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraSimulation: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraHeader: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  cameraText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff00',
    textAlign: 'center',
  },
  cameraSubtext: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    opacity: 0.7,
    textAlign: 'center',
  },
  cameraContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  cameraPlaceholder: {
    fontSize: 32,
    color: '#00ff00',
    textAlign: 'center',
    marginBottom: 20,
  },
  cameraInfo: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff00',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    opacity: 0.8,
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: 'white',
    marginVertical: 5,
    textAlign: 'center',
    fontWeight: '600',
  },
  timerInfo: {
    fontSize: 14,
    color: '#00ff00',
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
  controls: {
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(0,255,0,0.2)',
    padding: 15,
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 30,
    minWidth: 180,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  controlButtonText: {
    fontSize: 16,
    color: '#00ff00',
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: 'white',
    marginVertical: 3,
    opacity: 0.9,
    textAlign: 'center',
  },
  alertContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContent: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    maxWidth: 350,
    borderWidth: 2,
    borderColor: '#00ff00',
    position: 'relative',
  },
  zompointsDisplay: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: '#00ff00',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  zompointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 15,
    textAlign: 'center',
  },
  alertText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  activityText: {
    fontSize: 18,
    color: '#00ff00',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#00ff00',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  pointsReward: {
    backgroundColor: 'rgba(0,255,0,0.2)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  pointsRewardText: {
    fontSize: 16,
    color: '#00ff00',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pointsAnimation: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  pointsAnimationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00ff00',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    fontSize: 20,
    color: '#00ff00',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 24,
    opacity: 0.9,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    maxWidth: 350,
    borderWidth: 2,
    borderColor: '#00ff00',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 25,
    opacity: 0.8,
  },
  timerOption: {
    backgroundColor: 'rgba(0,255,0,0.1)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    minWidth: 200,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,255,0,0.3)',
  },
  timerOptionSelected: {
    backgroundColor: '#00ff00',
    borderColor: '#00ff00',
  },
  timerOptionText: {
    fontSize: 16,
    color: '#00ff00',
    fontWeight: '600',
  },
  timerOptionTextSelected: {
    color: '#000',
  },
  modalButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
