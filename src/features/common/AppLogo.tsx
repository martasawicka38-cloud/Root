import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { colors, radius, shadows, spacing } from "../../styles/tokens";

type AppLogoProps = {
  subtitle?: string;
  compact?: boolean;
};

function LeafSVG({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8 2 4 6 4 10c0 4 2 7 5 9l3-3 3 3c3-2 5-5 5-9 0-4-4-8-8-8Z"
        fill={colors.sage}
        stroke={colors.mossGreen}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11l-2-2"
        stroke={colors.mossGreen}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

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
          <LeafSVG size={22} />
          <LeafSVG size={22} />
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
        <LeafSVG size={26} />
        <LeafSVG size={26} />
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

  subtitle: {
    color: colors.slate600,
    textAlign: "center",
    fontWeight: "500",
  },
});
