import { Link, Stack, usePathname } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../styles/tokens";

const tabs = [
  { href: "/(mobile)/home", label: "Dom", icon: "🏠" },
  { href: "/(mobile)/market", label: "Rynek", icon: "🏪" },
  { href: "/(mobile)/ranking", label: "Ranking", icon: "🏆" },
  { href: "/(mobile)/profile", label: "Profil", icon: "👤" },
] as const;

export default function MobileLayout() {
  const pathname = usePathname();

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href} asChild>
              <Pressable style={styles.tabBtn}>
                <Text
                  style={[styles.tabIcon, isActive && styles.tabTextActive]}
                >
                  {tab.icon}
                </Text>
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            </Link>
          );
        })}
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
  tabBar: {
    flexDirection: "row",
    width: "100%",
    maxWidth: Platform.OS === "web" ? 480 : undefined,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.slate200,
    paddingTop: 8,
    paddingBottom: 24,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  tabIcon: {
    fontSize: 22,
    color: colors.slate400,
  },
  tabText: {
    color: colors.slate400,
    fontSize: 10,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.mossGreen,
  },
});
