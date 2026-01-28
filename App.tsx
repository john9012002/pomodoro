import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  Modal,
  Switch,
  TextInput,
} from 'react-native';

const { width } = Dimensions.get('window');

type SessionType = 'focus' | 'shortBreak' | 'longBreak';

interface Settings {
  focusTime: number; // in minutes
  shortBreakTime: number;
  longBreakTime: number;
  autoTransition: boolean;
  darkMode: boolean;
  longBreakInterval: number; // after how many focus sessions
}

export default function App() {
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>('focus');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0); // for long break tracking

  // Settings state
  const [settings, setSettings] = useState<Settings>({
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoTransition: true,
    darkMode: true,
    longBreakInterval: 4,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<Settings>(settings);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Initialize timer based on session type
  useEffect(() => {
    const duration = getSessionDuration(sessionType);
    setTimeLeft(duration * 60);
  }, [sessionType, settings]);

  // Countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Pulse animation when active
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive]);

  // Continuous rotation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const getSessionDuration = (type: SessionType): number => {
    switch (type) {
      case 'focus':
        return settings.focusTime;
      case 'shortBreak':
        return settings.shortBreakTime;
      case 'longBreak':
        return settings.longBreakTime;
      default:
        return settings.focusTime;
    }
  };

  const handleSessionComplete = () => {
    setIsActive(false);

    // Celebration animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Determine next session
    if (sessionType === 'focus') {
      const newPomodoroCount = pomodoroCount + 1;
      const newSessionCount = sessionCount + 1;
      setPomodoroCount(newPomodoroCount);
      setSessionCount(newSessionCount);

      // Check if it's time for long break
      if (newSessionCount % settings.longBreakInterval === 0) {
        setSessionType('longBreak');
      } else {
        setSessionType('shortBreak');
      }
    } else {
      setSessionType('focus');
    }

    // Auto-transition if enabled
    if (settings.autoTransition) {
      setTimeout(() => {
        setIsActive(true);
      }, 1000);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);

    Animated.spring(scaleAnim, {
      toValue: isActive ? 1 : 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const resetTimer = () => {
    setIsActive(false);
    const duration = getSessionDuration(sessionType);
    setTimeLeft(duration * 60);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const changeSession = (type: SessionType) => {
    setIsActive(false);
    setSessionType(type);
    const duration = getSessionDuration(type);
    setTimeLeft(duration * 60);
  };

  const resetPomodoros = () => {
    setPomodoroCount(0);
    setSessionCount(0);
  };

  const openSettings = () => {
    setTempSettings({ ...settings });
    setShowSettings(true);
  };

  const saveSettings = () => {
    setSettings(tempSettings);
    setShowSettings(false);
    setIsActive(false);
    const duration = getSessionDuration(sessionType);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / (getSessionDuration(sessionType) * 60);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getThemeColors = () => {
    if (settings.darkMode) {
      return {
        background: sessionType === 'focus' ? '#0a0e27' : '#1a0f2e',
        primary: '#40E0D0',
        secondary: '#FF4757',
        text: '#FFFFFF',
        textSecondary: '#8892b0',
        cardBg: 'rgba(15, 20, 45, 0.8)',
        shapeOpacity: 0.1,
      };
    } else {
      return {
        background: sessionType === 'focus' ? '#f0f4f8' : '#fdf4f5',
        primary: '#00897b',
        secondary: '#e91e63',
        text: '#1a1a1a',
        textSecondary: '#5a6c7d',
        cardBg: 'rgba(255, 255, 255, 0.9)',
        shapeOpacity: 0.15,
      };
    }
  };

  const colors = getThemeColors();

  const getSessionLabel = () => {
    switch (sessionType) {
      case 'focus':
        return 'FOCUS';
      case 'shortBreak':
        return 'SHORT BREAK';
      case 'longBreak':
        return 'LONG BREAK';
      default:
        return 'FOCUS';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={settings.darkMode ? 'light-content' : 'dark-content'} />

      {/* Background geometric shapes */}
      <Animated.View
        style={[
          styles.backgroundShape1,
          {
            backgroundColor: `rgba(${settings.darkMode ? '255, 71, 87' : '233, 30, 99'}, ${colors.shapeOpacity})`,
            transform: [{ rotate: spin }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundShape2,
          {
            backgroundColor: `rgba(${settings.darkMode ? '64, 224, 208' : '0, 137, 123'}, ${colors.shapeOpacity})`,
            transform: [{ rotate: spin }],
          },
        ]}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.modeText, { color: colors.primary }]}>
          /// {getSessionLabel()} ///
        </Text>
        <View style={styles.statsRow}>
          <Text style={[styles.sessionText, { color: colors.textSecondary }]}>
            🍅 POMODOROS: {pomodoroCount}
          </Text>
          <TouchableOpacity onPress={openSettings}>
            <Text style={[styles.settingsIcon, { color: colors.primary }]}>⚙</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Session Selector */}
      <View style={styles.sessionSelector}>
        <TouchableOpacity
          style={[
            styles.sessionButton,
            sessionType === 'focus' && { borderColor: colors.primary, borderWidth: 2 },
          ]}
          onPress={() => changeSession('focus')}
        >
          <Text
            style={[
              styles.sessionButtonText,
              { color: sessionType === 'focus' ? colors.primary : colors.textSecondary },
            ]}
          >
            Focus
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sessionButton,
            sessionType === 'shortBreak' && { borderColor: colors.primary, borderWidth: 2 },
          ]}
          onPress={() => changeSession('shortBreak')}
        >
          <Text
            style={[
              styles.sessionButtonText,
              { color: sessionType === 'shortBreak' ? colors.primary : colors.textSecondary },
            ]}
          >
            Short Break
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sessionButton,
            sessionType === 'longBreak' && { borderColor: colors.primary, borderWidth: 2 },
          ]}
          onPress={() => changeSession('longBreak')}
        >
          <Text
            style={[
              styles.sessionButtonText,
              { color: sessionType === 'longBreak' ? colors.primary : colors.textSecondary },
            ]}
          >
            Long Break
          </Text>
        </TouchableOpacity>
      </View>

      {/* Timer Display */}
      <Animated.View
        style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}
      >
        {/* Progress Ring */}
        <View style={[styles.progressRing, { borderColor: `${colors.primary}33` }]}>
          <View
            style={[
              styles.progressFill,
              { height: `${progress * 100}%`, backgroundColor: `${colors.primary}4D` },
            ]}
          />
        </View>

        <View
          style={[
            styles.timerInner,
            { backgroundColor: colors.cardBg, borderColor: colors.primary },
          ]}
        >
          <Text
            style={[
              styles.timerText,
              { color: colors.text, textShadowColor: `${colors.text}4D` },
            ]}
          >
            {formatTime(timeLeft)}
          </Text>
          <View style={[styles.timerDivider, { backgroundColor: colors.secondary }]} />
          <Text style={[styles.timerLabel, { color: colors.secondary }]}>
            {getSessionLabel()}
          </Text>
        </View>
      </Animated.View>

      {/* Controls */}
      <View style={styles.controls}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: colors.secondary, borderColor: colors.text },
            ]}
            onPress={toggleTimer}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {isActive ? '║║ PAUSE' : '▶ START'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.secondaryControls}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={resetTimer}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              ⟲ RESET
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={resetPomodoros}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              🍅 CLEAR
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={[styles.footerLine, { backgroundColor: colors.primary }]} />
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          POMODORO PROTOCOL
        </Text>
        <View style={[styles.footerLine, { backgroundColor: colors.primary }]} />
      </View>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: settings.darkMode ? '#0f1429' : '#ffffff' },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: settings.darkMode ? '#40E0D0' : '#00897b' },
                ]}
              >
                ⚙ SETTINGS
              </Text>

              {/* Theme Toggle */}
              <View style={styles.settingRow}>
                <Text
                  style={[
                    styles.settingLabel,
                    { color: settings.darkMode ? '#FFFFFF' : '#1a1a1a' },
                  ]}
                >
                  Dark Mode
                </Text>
                <Switch
                  value={tempSettings.darkMode}
                  onValueChange={(value) =>
                    setTempSettings({ ...tempSettings, darkMode: value })
                  }
                  trackColor={{ false: '#767577', true: '#40E0D0' }}
                  thumbColor={tempSettings.darkMode ? '#FFFFFF' : '#f4f3f4'}
                />
              </View>

              {/* Auto-transition Toggle */}
              <View style={styles.settingRow}>
                <Text
                  style={[
                    styles.settingLabel,
                    { color: settings.darkMode ? '#FFFFFF' : '#1a1a1a' },
                  ]}
                >
                  Auto-transition
                </Text>
                <Switch
                  value={tempSettings.autoTransition}
                  onValueChange={(value) =>
                    setTempSettings({ ...tempSettings, autoTransition: value })
                  }
                  trackColor={{ false: '#767577', true: '#40E0D0' }}
                  thumbColor={tempSettings.autoTransition ? '#FFFFFF' : '#f4f3f4'}
                />
              </View>

              <View style={styles.divider} />

              {/* Time Settings */}
              <Text
                style={[
                  styles.sectionTitle,
                  { color: settings.darkMode ? '#8892b0' : '#5a6c7d' },
                ]}
              >
                SESSION DURATIONS (minutes)
              </Text>

              <View style={styles.inputRow}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: settings.darkMode ? '#FFFFFF' : '#1a1a1a' },
                  ]}
                >
                  Focus Time
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: settings.darkMode ? '#FFFFFF' : '#1a1a1a',
                      borderColor: settings.darkMode ? '#40E0D0' : '#00897b',
                      backgroundColor: settings.darkMode ? '#1a1f3a' : '#f5f5f5',
                    },
                  ]}
                  value={tempSettings.focusTime.toString()}
                  onChangeText={(text) =>
                    setTempSettings({
                      ...tempSettings,
                      focusTime: parseInt(text) || 25,
                    })
                  }
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>

              <View style={styles.inputRow}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: settings.darkMode ? '#FFFFFF' : '#1a1a1a' },
                  ]}
                >
                  Short Break
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: settings.darkMode ? '#FFFFFF' : '#1a1a1a',
                      borderColor: settings.darkMode ? '#40E0D0' : '#00897b',
                      backgroundColor: settings.darkMode ? '#1a1f3a' : '#f5f5f5',
                    },
                  ]}
                  value={tempSettings.shortBreakTime.toString()}
                  onChangeText={(text) =>
                    setTempSettings({
                      ...tempSettings,
                      shortBreakTime: parseInt(text) || 5,
                    })
                  }
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>

              <View style={styles.inputRow}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: settings.darkMode ? '#FFFFFF' : '#1a1a1a' },
                  ]}
                >
                  Long Break
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: settings.darkMode ? '#FFFFFF' : '#1a1a1a',
                      borderColor: settings.darkMode ? '#40E0D0' : '#00897b',
                      backgroundColor: settings.darkMode ? '#1a1f3a' : '#f5f5f5',
                    },
                  ]}
                  value={tempSettings.longBreakTime.toString()}
                  onChangeText={(text) =>
                    setTempSettings({
                      ...tempSettings,
                      longBreakTime: parseInt(text) || 15,
                    })
                  }
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>

              <View style={styles.inputRow}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: settings.darkMode ? '#FFFFFF' : '#1a1a1a' },
                  ]}
                >
                  Long Break Interval
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: settings.darkMode ? '#FFFFFF' : '#1a1a1a',
                      borderColor: settings.darkMode ? '#40E0D0' : '#00897b',
                      backgroundColor: settings.darkMode ? '#1a1f3a' : '#f5f5f5',
                    },
                  ]}
                  value={tempSettings.longBreakInterval.toString()}
                  onChangeText={(text) =>
                    setTempSettings({
                      ...tempSettings,
                      longBreakInterval: parseInt(text) || 4,
                    })
                  }
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>

              {/* Modal Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor: settings.darkMode ? '#FF4757' : '#e91e63',
                    },
                  ]}
                  onPress={saveSettings}
                >
                  <Text style={styles.modalButtonText}>✓ SAVE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.modalButtonSecondary,
                    {
                      borderColor: settings.darkMode ? '#40E0D0' : '#00897b',
                    },
                  ]}
                  onPress={() => setShowSettings(false)}
                >
                  <Text
                    style={[
                      styles.modalButtonTextSecondary,
                      { color: settings.darkMode ? '#40E0D0' : '#00897b' },
                    ]}
                  >
                    ✕ CANCEL
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  backgroundShape1: {
    position: 'absolute',
    width: 300,
    height: 300,
    top: -100,
    right: -100,
    borderRadius: 20,
    transform: [{ rotate: '45deg' }],
  },
  backgroundShape2: {
    position: 'absolute',
    width: 200,
    height: 200,
    bottom: -50,
    left: -50,
    borderRadius: 100,
  },
  header: {
    alignItems: 'center',
    zIndex: 10,
    width: '100%',
  },
  modeText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
    fontFamily: 'monospace',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  sessionText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  settingsIcon: {
    fontSize: 28,
    fontWeight: '700',
  },
  sessionSelector: {
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
    marginTop: 20,
  },
  sessionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sessionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  timerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginTop: 20,
  },
  progressRing: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  progressFill: {
    width: '100%',
  },
  timerInner: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: 4,
    fontFamily: 'monospace',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  timerDivider: {
    width: 60,
    height: 2,
    marginVertical: 12,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 6,
    fontFamily: 'monospace',
  },
  controls: {
    width: '100%',
    gap: 16,
    zIndex: 10,
  },
  secondaryControls: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
    fontFamily: 'monospace',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  footerLine: {
    width: 40,
    height: 1,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 3,
    fontFamily: 'monospace',
    marginBottom: 24,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(136, 146, 176, 0.2)',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
    flex: 1,
  },
  input: {
    width: 80,
    height: 44,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  modalButtons: {
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
});