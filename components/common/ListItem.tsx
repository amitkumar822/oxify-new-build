import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Theme } from "../../constants";

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <View style={[styles.container, style]}>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Theme.background.secondary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.border.dark,
    marginBottom: 12,
  },
  texts: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    color: Theme.text.primary,
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: Theme.text.secondary,
  },
  chevron: {
    fontSize: 24,
    color: Theme.text.secondary,
  },
});

export default ListItem;

