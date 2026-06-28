import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
import { colors } from "../../styles/tokens";

const menuItems = [
  { href: "/(mobile)/edit-profile", icon: EditIcon, label: "Edytuj profil" },
  {
    href: "/(mobile)/history",
    icon: HistoryIcon,
    label: "Historia transakcji",
  },
  {
    href: "/(mobile)/achievements",
    icon: MedalIcon,
    label: "Osiagniecia",
  },
  { href: "/(mobile)/settings", icon: SettingsIcon, label: "Ustawienia" },
] as const;

function CompanyProfile({ name, email }: { name: string; email: string }) {
  return (
    <>
      <Text style={styles.title}>Profil firmy</Text>

      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {name[0]?.toUpperCase() ?? "F"}
            </Text>
          </View>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={[styles.card, styles.cardLight, { marginTop: 24 }]}>
        <View style={styles.menuContainer}>
          <Link href="/(mobile)/edit-profile" asChild>
            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconBox}>
                  <EditIcon size={18} color={colors.slate700} />
                </View>
                <Text style={styles.menuLabel}>Edytuj profil</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </>
  );
}

export default function ProfileScreen() {
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const name = me?.name ?? "";
  const email = me?.email ?? "";

  if (me?.role === "company") {
    return (
      <Screen>
        <CompanyProfile name={name} email={email} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Profil</Text>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {name[0]?.toUpperCase() ?? "J"}
            </Text>
          </View>
          <Link href="/(mobile)/edit-profile" style={styles.editBadge}>
            <EditIcon size={12} color={colors.white} />
          </Link>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.card, styles.cardLight, { flex: 1 }]}>
          <View style={styles.statCardBody}>
            <View style={[styles.statIconBox, { backgroundColor: "rgba(139, 69, 19, 0.1)" }]}>
              <FireIcon size={20} color={colors.sunset} />
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Passa (dni)</Text>
          </View>
        </View>

        <View style={[styles.card, styles.cardLight, { flex: 1 }]}>
          <View style={styles.statCardBody}>
            <View style={[styles.statIconBox, { backgroundColor: colors.creamDark }]}>
              <MedalIcon size={20} color={colors.mossGreen} />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Osiagniecia</Text>
          </View>
        </View>

        <View style={[styles.card, styles.cardLight, { flex: 1 }]}>
          <View style={styles.statCardBody}>
            <View style={[styles.statIconBox, { backgroundColor: colors.greenLight }]}>
              <LeafIcon size={20} color={colors.mossGreen} />
            </View>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Deklaracje</Text>
          </View>
        </View>
      </View>

      {/* Menu */}
      <View style={[styles.card, styles.cardLight, { marginTop: 24 }]}>
        <View style={styles.menuContainer}>
          {menuItems.map(({ href, icon: Icon, label }, idx) => (
            <Link key={href} href={href} asChild>
              <Pressable
                style={idx < menuItems.length - 1 ? styles.menuItemWithBorder : styles.menuItem}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconBox}>
                    <Icon size={18} color={colors.slate700} />
                  </View>
                  <Text style={styles.menuLabel}>{label}</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.brownDark,
    marginBottom: 16,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 9999,
    backgroundColor: colors.greenBright,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "700",
  },
  editBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: colors.olive,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.brownDark,
  },
  email: {
    fontSize: 14,
    color: colors.olive,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.creamDark,
    borderRadius: 12,
  },
  cardLight: {
    backgroundColor: colors.creamLight,
  },
  statCardBody: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.brownDark,
  },
  statLabel: {
    fontSize: 12,
    color: colors.olive,
  },
  menuContainer: {
    padding: 0,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuItemWithBorder: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.creamMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: colors.brownDark,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.olive,
  },
});
