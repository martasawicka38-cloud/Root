import { Link, Stack, usePathname } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { AppLogo } from "../../features/common/AppLogo";
import {
  BellIcon,
  CoinIcon,
  HomeIcon,
  MarketIcon,
  ProfileIcon,
  SproutIcon,
  RankingIcon,
} from "../../components/icons";
import { fetchNotifications, fetchWallet } from "../../lib/api/endpoints";
import { colors, radius, spacing } from "../../styles/tokens";

const tabs = [
  { href: "/(mobile)/home", label: "Dom", icon: HomeIcon },
  { href: "/(mobile)/market", label: "Rynek", icon: MarketIcon },
  { href: "/(mobile)/eko", label: "Eko", icon: SproutIcon },
  { href: "/(mobile)/ranking", label: "Ranking", icon: RankingIcon },
  { href: "/(mobile)/profile", label: "Profil", icon: ProfileIcon },
] as const;

export default function MobileLayout() {
  const pathname = usePathname();

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: fetchWallet,
  });
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const balance = wallet?.balance ?? 0;
  const hasUnread = notifications?.some((n) => !n.read) ?? false;

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <View style={styles.header}>
          <AppLogo size={22} />
          <View style={styles.headerActions}>
            <View style={styles.balancePill}>
              <CoinIcon size={16} color={colors.warmGold} />
              <Text style={styles.balanceValue}>{balance}</Text>
              <Text style={styles.balanceUnit}>EC</Text>
            </View>
            <Link href="/(mobile)/notifications" asChild>
              <Pressable style={styles.bellButton}>
                <BellIcon size={22} color={colors.warmGold} />
                {hasUnread && <View style={styles.bellDot} />}
              </Pressable>
            </Link>
          </View>
        </View>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link key={tab.href} href={tab.href} asChild>
              <Pressable style={styles.tabBtn}>
                <Icon
                  size={22}
                  color={isActive ? colors.mossGreen : colors.slate400}
                />
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
  tabText: {
    color: colors.slate400,
    fontSize: 10,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.mossGreen,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === "web" ? 8 : 50,
    paddingBottom: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  balancePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#C6ECD2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  balanceValue: {
    color: colors.deepForest,
    fontWeight: "800",
    fontSize: 18,
  },
  balanceUnit: {
    color: colors.slate600,
    fontWeight: "600",
    fontSize: 13,
  },
  bellButton: {
    position: "relative",
    padding: 4,
  },
  bellDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.error,
  },
});
