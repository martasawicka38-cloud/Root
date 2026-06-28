import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { BellIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import {
  fetchNotifications,
  readAllNotifications,
} from "../../lib/api/endpoints";
import { colors, radius, spacing } from "../../styles/tokens";

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });
  const clear = useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unread = notifications.filter((item) => !item.read).length;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{t("notifications.title")}</Text>
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unread} {t("notifications.unread")}</Text>
        </View>
      </View>

      <Pressable style={styles.clearButton} onPress={() => clear.mutate()}>
        <BellIcon size={16} color={colors.white} />
        <Text style={styles.clearText}>{t("notifications.markAllRead")}</Text>
      </Pressable>

      {notifications.length === 0 && (
        <View style={styles.emptyState}>
          <BellIcon size={48} color={colors.slate200} />
          <Text style={styles.emptyText}>{t("notifications.empty")}</Text>
        </View>
      )}

      {notifications.map((item) => (
        <View
          key={item.id}
          style={[styles.card, !item.read && styles.cardUnread]}
        >
          <View
            style={[
              styles.iconWrap,
              item.read
                ? { backgroundColor: colors.slate100 }
                : { backgroundColor: colors.mist },
            ]}
          >
            <BellIcon
              size={18}
              color={item.read ? colors.slate400 : colors.mossGreen}
            />
          </View>
          <Text
            style={[styles.cardText, !item.read && styles.cardTextUnread]}
          >
            {item.title}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
  },
  unreadBadge: {
    backgroundColor: colors.mist,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  unreadText: {
    fontSize: 12,
    color: colors.mossGreen,
    fontWeight: "600",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.x3s,
    backgroundColor: colors.mossGreen,
    borderRadius: radius.md,
    paddingVertical: 12,
    marginBottom: 10,
  },
  clearText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    gap: spacing.x3s,
    marginTop: 24,
  },
  emptyText: {
    color: colors.slate400,
    fontSize: 15,
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
    backgroundColor: colors.inputBg,
  },
  cardUnread: {
    borderColor: colors.sage,
    backgroundColor: colors.mist,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    flex: 1,
    fontSize: 14,
    color: colors.slate600,
    lineHeight: 20,
  },
  cardTextUnread: {
    color: colors.slate900,
    fontWeight: "600",
  },
});
