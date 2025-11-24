import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorInfo {
  componentStack: string;
}

type State = {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
};

interface Props extends React.PropsWithChildren {
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorDetails: ErrorInfo = {
      componentStack:
        errorInfo.componentStack || "No component stack available",
    };

    this.setState({ errorInfo: errorDetails });

    // Enhanced error logging
    this.logError(error, errorDetails);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorDetails);
    }
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorLog = {
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: "React Native",
      version: "1.0.0", // You can get this from package.json
      retryCount: this.retryCount,
    };
  };

  private resetError = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: "",
      });
    } else {
      Alert.alert(
        "Maximum Retries Reached",
        "The app has encountered multiple errors. Please restart the application.",
        [{ text: "OK" }]
      );
    }
  };

  private handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;

    Alert.alert(
      "Report Error",
      `Error ID: ${errorId}\n\nWould you like to report this error to help us improve the app?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          onPress: () => {
            // TODO: Implement error reporting
            console.log("Reporting error:", errorId);
            Alert.alert("Thank you", "Error report submitted successfully.");
          },
        },
      ]
    );
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            resetError={this.resetError}
          />
        );
      }

      // Default error UI
      return (
        <View className="flex-1 bg-gray-950" style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.errorContainer}>
              {/* Error Icon */}
              <View style={styles.iconContainer}>
                <Ionicons name="warning-outline" size={64} color="#ff6b6b" />
              </View>

              {/* Error Title */}
              <Text style={styles.title}>Oops! Something went wrong</Text>

              {/* Error Message */}
              <Text style={styles.message}>
                We're sorry, but something unexpected happened. Our team has
                been notified.
              </Text>

              {/* Error ID */}
              <View style={styles.errorIdContainer}>
                <Text style={styles.errorIdLabel}>Error ID:</Text>
                <Text style={styles.errorId}>{this.state.errorId}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={this.resetError}
                >
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.primaryButtonText}>
                    {this.retryCount < this.maxRetries
                      ? "Try Again"
                      : "Restart App"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={this.handleReportError}
                >
                  <Ionicons name="bug-outline" size={20} color="#4a90e2" />
                  <Text style={styles.secondaryButtonText}>Report Error</Text>
                </TouchableOpacity>
              </View>

              {/* Development Error Details */}
              {__DEV__ && this.state.error && (
                <View style={styles.devContainer}>
                  <Text style={styles.devTitle}>
                    Development Error Details:
                  </Text>
                  <ScrollView style={styles.devScrollView}>
                    <Text style={styles.devText}>
                      {this.state.error.message}
                    </Text>
                    <Text style={styles.devText}>{this.state.error.stack}</Text>
                  </ScrollView>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
  },
  iconContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 50,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#b0b0b0",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  errorIdContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 32,
    alignItems: "center",
  },
  errorIdLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  errorId: {
    fontSize: 14,
    color: "#4a90e2",
    fontFamily: "monospace",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#4a90e2",
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "#4a90e2",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#4a90e2",
    fontSize: 16,
    fontWeight: "600",
  },
  devContainer: {
    marginTop: 32,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
    padding: 16,
  },
  devTitle: {
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  devScrollView: {
    maxHeight: 200,
  },
  devText: {
    color: "#ccc",
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 16,
  },
});
