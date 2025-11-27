import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SessionAlertModalProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  onRequestClose: () => void;
  onConfirm?: () => void;
}

const SessionAlertModal: React.FC<SessionAlertModalProps> = ({
  visible,
  title = "Completed!",
  subtitle = "Session saved to Statistics!",
  buttonLabel = "OK",
  onRequestClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onRequestClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={32} color="#fff" />
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          {subtitle ? (
            <Text style={styles.modalSubtitle}>{subtitle}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.modalButton}
            activeOpacity={0.85}
            onPress={handleConfirm}
          >
            <Text style={styles.modalButtonText}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#fff",
    borderRadius: 28,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  checkCircle: {
    width: 55.25,
    height: 55.25,
    borderRadius: 36,
    backgroundColor: "#2398F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "RobotoBold",
    color: "#2398F7",
  },
  modalSubtitle: {
    fontSize: 15,
    fontFamily: "RobotoRegular",
    color: "#090A0B",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButton: {
    marginTop: 14,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#2398F7",
    borderRadius: 24,
  },
  modalButtonText: {
    textAlign: "center",
    color: "#fff",
    fontFamily: "RobotoBold",
    fontSize: 14,
  },
});

export default SessionAlertModal;

