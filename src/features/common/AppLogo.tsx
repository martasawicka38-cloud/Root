import { StyleSheet, Text, View } from "react-native";

import { colors, radius, shadows, spacing } from "../../styles/tokens";

type AppLogoProps = {
  subtitle?: string;
};

export function AppLogo({ subtitle }: AppLogoProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.mark}>
        <Text style={styles.markIcon}>🌿</Text>
      </View>
      <Text style={styles.brand}>Root</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: spacing.x3s,
  },
  mark: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mist,
    borderWidth: 1,
    borderColor: colors.sage,
    ...shadows.sm,
  },
  markIcon: {
    fontSize: 28,
  },
  brand: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.deepForest,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.slate600,
    textAlign: "center",
  },
});
