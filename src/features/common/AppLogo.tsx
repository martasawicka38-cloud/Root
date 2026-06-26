import { StyleSheet, Text, View } from "react-native";

import { colors, radius, shadows, spacing } from "../../styles/tokens";

type AppLogoProps = {
  subtitle?: string;
  compact?: boolean;
};

export function AppLogo({ subtitle, compact = false }: AppLogoProps) {
  if (compact) {
    return (
      <View style={styles.inlineWrap}>
        <View style={[styles.mark, styles.markCompact]}>
          <View style={styles.bookSpine} />
          <View style={styles.bookLeft} />
          <View style={styles.bookRight} />
        </View>
        <View style={styles.wordmarkRow}>
          <Text style={[styles.wordmark, styles.wordmarkCompact]}>R</Text>
          <Text style={styles.leaf}>🍃</Text>
          <Text style={styles.leaf}>🍃</Text>
          <Text style={[styles.wordmark, styles.wordmarkCompact]}>t</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.mark}>
        <View style={styles.bookSpine} />
        <View style={styles.bookLeft} />
        <View style={styles.bookRight} />
      </View>
      <View style={styles.wordmarkRow}>
        <Text style={styles.wordmark}>R</Text>
        <Text style={styles.leaf}>🍃</Text>
        <Text style={styles.leaf}>🍃</Text>
        <Text style={styles.wordmark}>t</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: spacing.x3s,
  },
  inlineWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.x2s,
  },
  mark: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.sage,
    borderWidth: 1,
    borderColor: colors.sage,
    ...shadows.sm,
  },
  markCompact: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  bookSpine: {
    position: "absolute",
    width: 3,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.white,
  },
  bookLeft: {
    position: "absolute",
    left: 16,
    width: 12,
    height: 18,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 6,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    borderWidth: 2,
    borderColor: colors.white,
    borderRightWidth: 0,
  },
  bookRight: {
    position: "absolute",
    right: 16,
    width: 12,
    height: 18,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    borderWidth: 2,
    borderColor: colors.white,
    borderLeftWidth: 0,
  },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  wordmark: {
    fontSize: 46,
    fontWeight: "800",
    color: colors.deepForest,
    letterSpacing: -1,
    lineHeight: 50,
  },
  wordmarkCompact: {
    fontSize: 38,
    lineHeight: 40,
  },
  leaf: {
    fontSize: 26,
    marginTop: 3,
  },
  subtitle: {
    color: colors.slate600,
    textAlign: "center",
    fontWeight: "500",
  },
});
