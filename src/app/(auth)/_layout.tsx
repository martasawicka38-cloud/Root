import { Stack } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

import { AppLogo } from "../../features/common/AppLogo";
import { colors, spacing } from "../../styles/tokens";

export default function AuthLayout() {
  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <View style={styles.header}>
          <AppLogo size={22} />
        </View>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.slate100,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 480 : undefined,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === "web" ? 8 : 50,
    paddingBottom: 4,
  },
});
