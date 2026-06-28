import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { LeafIcon, SettingsIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import { fetchMe } from "../../lib/api/endpoints";
import { colors, radius, spacing } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const partner = me?.partner ?? "intel";
  const logout = useAppStore((s) => s.logout);

  return (
    <Screen>
      <Text style={styles.title}>{t("settings.title")}</Text>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={[styles.iconWrap, { backgroundColor: colors.mist }]}>
            <LeafIcon size={20} color={colors.mossGreen} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Partner</Text>
            <Text style={styles.cardValue}>
              {partner === "intel" ? "Intel Poland" : "ERGO Hestia"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={[styles.iconWrap, { backgroundColor: colors.slate100 }]}>
            <SettingsIcon size={20} color={colors.slate600} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>{t("settings.version")}</Text>
            <Text style={styles.cardValue}>1.0.0</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={styles.logoutButton}
        onPress={() => {
          logout();
          router.replace("/(auth)/login");
        }}
      >
        <Text style={styles.logoutText}>{t("settings.logout")}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
    marginBottom: 6,
  },
  card: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    gap: 2,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.slate500,
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 15,
    color: colors.slate900,
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 15,
    color: colors.error,
    fontWeight: "700",
  },
});
