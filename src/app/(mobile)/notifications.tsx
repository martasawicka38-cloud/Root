import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import {
  fetchNotifications,
  readAllNotifications,
} from "../../lib/api/endpoints";
import { colors } from "../../styles/tokens";

export default function NotificationsScreen() {
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
      <Text style={styles.title}>Powiadomienia</Text>
      <Text style={styles.meta}>Nieprzeczytane: {unread}</Text>
      <Pressable style={styles.button} onPress={() => clear.mutate()}>
        <Text style={styles.buttonText}>Wyczysc status nieprzeczytanych</Text>
      </Pressable>
      {notifications.map((item) => (
        <View style={styles.item} key={item.id}>
          <Text>{item.title}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "700", color: colors.deepForest },
  meta: { color: colors.slate600 },
  button: { backgroundColor: colors.mossGreen, borderRadius: 10, padding: 12 },
  buttonText: { color: colors.white, textAlign: "center", fontWeight: "700" },
  item: {
    borderWidth: 1,
    borderColor: colors.slate300,
    borderRadius: 10,
    padding: 12,
  },
});
