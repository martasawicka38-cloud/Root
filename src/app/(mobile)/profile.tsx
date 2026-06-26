import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { fetchMe } from "../../lib/api/endpoints";
import { colors, radius, spacing, typography } from "../../styles/tokens";

export default function ProfileScreen() {
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const name = me?.name ?? "Jan Kowalski";
  const email = me?.email ?? "jan@intel.com";

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Text style={styles.back}>‹</Text>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.back}> </Text>
      </View>

      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{name[0]?.toUpperCase() ?? "J"}</Text>
        <View style={styles.avatarBadge}>
          <Text style={styles.avatarBadgeText}>✏️</Text>
        </View>
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🔥5</Text>
          <Text style={styles.statLabel}>Passa (dni)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🥇12</Text>
          <Text style={styles.statLabel}>Osiagniecia</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🌿24</Text>
          <Text style={styles.statLabel}>Deklaracje</Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        <Link href="/(mobile)/edit-profile" style={styles.link}>
          👤 Edytuj profil
        </Link>
        <Link href="/(mobile)/history" style={styles.link}>
          📋 Historia transakcji
        </Link>
        <Link href="/(mobile)/achievements" style={styles.link}>
          🥇 Osiagniecia
        </Link>
        <Link href="/(mobile)/settings" style={styles.link}>
          🔔 Ustawienia
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  back: {
    width: 24,
    fontSize: 22,
    color: colors.slate900,
  },
  title: {
    ...typography.h1,
    color: colors.deepForest,
    textAlign: "center",
    flex: 1,
  },
  avatarCircle: {
    marginTop: spacing.xs,
    width: 82,
    height: 82,
    borderRadius: radius.full,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4FB38D",
    position: "relative",
  },
  avatarText: {
    color: colors.white,
    fontSize: 42,
    fontWeight: "700",
  },
  avatarBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mossGreen,
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarBadgeText: {
    fontSize: 12,
  },
  name: {
    marginTop: spacing.x3s,
    color: colors.slate900,
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  email: { color: colors.slate600, marginTop: 4, textAlign: "center" },
  statsRow: {
    marginTop: spacing.xs,
    flexDirection: "row",
    gap: spacing.x3s,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.sm,
    backgroundColor: "#EEF2F5",
    paddingVertical: spacing.x2s,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    ...typography.h2,
    color: colors.deepForest,
    fontWeight: "800",
  },
  statLabel: {
    ...typography.caption,
    color: colors.slate600,
  },
  menuCard: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    backgroundColor: "#EEF2F5",
    overflow: "hidden",
  },
  link: {
    borderBottomWidth: 1,
    borderBottomColor: colors.slate200,
    padding: 12,
    color: colors.slate900,
    fontWeight: "600",
  },
});
