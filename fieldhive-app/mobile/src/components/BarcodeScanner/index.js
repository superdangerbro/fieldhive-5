import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Vibration,
  Linking
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as IntentLauncher from 'expo-intent-launcher';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BarcodeScanner = ({
  onScan,
  onClose,
  barcodeTypes = [
    BarCodeScanner.Constants.BarCodeType.qr,
    BarCodeScanner.Constants.BarCodeType.code128,
    BarCodeScanner.Constants.BarCodeType.code39,
    BarCodeScanner.Constants.BarCodeType.ean13,
    BarCodeScanner.Constants.BarCodeType.ean8,
  ]
}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);

    // Provide haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Vibration.vibrate(100);
    }

    onScan({ type, data });
  };

  const openSettings = async () => {
    if (Platform.OS === 'ios') {
      await Linking.openSettings();
    } else {
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.APPLICATION_SETTINGS
      );
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={openSettings}
        >
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        barCodeScannerSettings={{
          barCodeTypes: barcodeTypes,
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        flashMode={torch ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
      >
        <View style={styles.overlay}>
          {/* Top section */}
          <View style={styles.overlaySection} />

          {/* Middle section with scanner window */}
          <View style={styles.middleSection}>
            <View style={styles.overlaySection} />
            <View style={styles.scanWindow}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.overlaySection} />
          </View>

          {/* Bottom section */}
          <View style={styles.overlaySection}>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setTorch(!torch)}
              >
                <MaterialIcons
                  name={torch ? 'flash-on' : 'flash-off'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, styles.closeButton]}
                onPress={onClose}
              >
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Camera>

      {scanned && (
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.rescanText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  overlaySection: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleSection: {
    flexDirection: 'row',
    height: SCREEN_WIDTH * 0.7, // Square scanning window
  },
  scanWindow: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  topLeft: {
    top: -1,
    left: -1,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: -1,
    right: -1,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: -1,
    left: -1,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  controlButton: {
    padding: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginHorizontal: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.3)', // Red tint
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  rescanButton: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  rescanText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BarcodeScanner;
