import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

interface KeyboardState {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
}

interface UseKeyboardOptions {
  onKeyboardShow?: (keyboardHeight: number) => void;
  onKeyboardHide?: () => void;
  dismissOnMount?: boolean;
}

/**
 * Custom hook to manage keyboard state and events
 * @param options - Configuration options for keyboard behavior
 * @returns Object containing keyboard state and utility functions
 */
export const useKeyboard = (options: UseKeyboardOptions = {}) => {
  const {
    onKeyboardShow,
    onKeyboardHide,
    dismissOnMount = false,
  } = options;

  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isKeyboardVisible: false,
    keyboardHeight: 0,
  });

  // Dismiss keyboard utility function
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Show keyboard utility function
  const showKeyboard = () => {
    Keyboard.emit('keyboardDidShow', { height: 0 });
  };

  // Check if keyboard is currently visible
  const isKeyboardOpen = () => {
    return keyboardState.isKeyboardVisible;
  };

  // Get current keyboard height
  const getKeyboardHeight = () => {
    return keyboardState.keyboardHeight;
  };

  useEffect(() => {
    // Dismiss keyboard on mount if requested
    if (dismissOnMount) {
      dismissKeyboard();
    }

    // Keyboard show listener
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        const keyboardHeight = event.endCoordinates?.height || 0;
        setKeyboardState({
          isKeyboardVisible: true,
          keyboardHeight,
        });
        onKeyboardShow?.(keyboardHeight);
      }
    );

    // Keyboard hide listener
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardState({
          isKeyboardVisible: false,
          keyboardHeight: 0,
        });
        onKeyboardHide?.();
      }
    );

    // Cleanup listeners
    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, [onKeyboardShow, onKeyboardHide, dismissOnMount]);

  return {
    // State
    isKeyboardVisible: keyboardState.isKeyboardVisible,
    keyboardHeight: keyboardState.keyboardHeight,
    
    // Utility functions
    dismissKeyboard,
    showKeyboard,
    isKeyboardOpen,
    getKeyboardHeight,
  };
};

/**
 * Hook specifically for screens that need to dismiss keyboard on mount
 * Useful for preventing keyboard flickering when navigating between screens
 */
export const useKeyboardDismissOnMount = () => {
  return useKeyboard({ dismissOnMount: true });
};

/**
 * Hook for screens that need keyboard state but don't need to dismiss on mount
 */
export const useKeyboardState = () => {
  return useKeyboard({ dismissOnMount: false });
};

export default useKeyboard;
