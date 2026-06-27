import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";

import {
  EditIcon,
  FireIcon,
  HistoryIcon,
  LeafIcon,
  MedalIcon,
  SettingsIcon,
} from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import { fetchMe } from "../../lib/api/endpoints";
import { colors, radius } from "../../styles/tokens";

const menuItems = [
  { href: "/(mobile)/edit-profile", icon: EditIcon, label: "Edytuj profil" },
  { href: "/(mobile)/history", icon: HistoryIcon, label: "Historia transakcji" },
  { href: "/(mobile)/achievements", icon: MedalIcon, label: "Osiagniecia" },
  { href: "/(mobile)/settings", icon: SettingsIcon, label: "Ustawienia" },
] as const;

export default function ProfileScreen() {
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const name = me?.name ?? "";
  const email = me?.email ?? "";

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerBack}>‹</Text>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={styles.headerBack} />
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0]?.toUpperCase() ?? "J"}</Text>
          <Link href="/(mobile)/edit-profile" style={styles.avatarEdit}>
            <EditIcon size={12} color={colors.white} />
          </Link>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: "#FEE2E2" }]}>
            <FireIcon size={20} color={colors.error} />
          </View>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Passa (dni)</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: "#FEF3C7" }]}>
            <MedalIcon size={20} color={colors.warmGold} />
          </View>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Osiagniecia</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: "#D1FAE5" }]}>
            <LeafIcon size={20} color={colors.mossGreen} />
          </View>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Deklaracje</Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        {menuItems.map(({ href, icon: Icon, label }, idx) => (
          <Link
            key={href}
            href={href}
            style={[styles.menuItem, idx < menuItems.length - 1 && styles.menuItemBorder]}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIconWrap}>
                <Icon size={18} color={colors.slate600} />
              </View>
              <Text style={styles.menuLabel}>{label}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </Link>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerBack: {
    width: 24,
    fontSize: 22,
    color: colors.slate900,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.deepForest,
    textAlign: "center",
    flex: 1,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: "#4FB38D",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarText: {
    color: colors.white,
    fontSize: 36,
    fontWeight: "700",
  },
  avatarEdit: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.mossGreen,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
  },
  name: {
    color: colors.slate900,
    fontWeight: "700",
    fontSize: 20,
  },
  email: {
    color: colors.slate500,
    fontSize: 14,
  },
  statsRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    gap: 8,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.deepForest,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.slate500,
  },
  menuCard: {
    marginTop: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.slate100,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: 15,
    color: colors.slate900,
    fontWeight: "600",
  },
  menuArrow: {
    fontSize: 20,
    color: colors.slate400,
    fontWeight: "600",
  },
});
