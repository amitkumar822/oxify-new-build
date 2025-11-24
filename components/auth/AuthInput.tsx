import React from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import { Theme } from "../../constants";

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  error,
  autoCapitalize = "none",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Theme.text.secondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.text.inverse,
    marginBottom: 8,
  },
  input: {
    width: Math.min(screenWidth - 32, 358),
    height: 54,
    backgroundColor: '#797979',
    borderRadius: 14,
    paddingRight: 16,
    paddingLeft: 16,
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'normal',
    fontSize: 16,
    lineHeight: 54,
    letterSpacing: 0,
    color: Theme.text.primary,
    borderWidth: 1,
    borderColor: "transparent",
    opacity: 1,
    marginBottom: 10,
  },
  inputError: {
    borderColor: Theme.status.error,
  },
  errorText: {
    fontSize: 14,
    color: Theme.status.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default AuthInput;
