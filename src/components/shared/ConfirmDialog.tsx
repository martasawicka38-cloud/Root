import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, radius } from "../../styles/tokens";

interface ConfirmDialogProps {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({ message, onConfirm, onCancel, confirmLabel, cancelLabel, loading }: ConfirmDialogProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message ?? t("common.deleteConfirm")}</Text>
      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.confirmBtn, loading && { opacity: 0.5 }]} onPress={onConfirm} disabled={loading}>
          <Text style={[styles.btnText, { color: colors.error }]}>{loading ? t("common.deleting") : (confirmLabel ?? t("common.yes"))}</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={onCancel}>
          <Text style={styles.btnText}>{cancelLabel ?? t("common.no")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  message: { fontSize: 13, color: colors.error, fontWeight: "600", alignSelf: "center" },
  actions: { flexDirection: "row", gap: 4 },
  btn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.sm, borderWidth: 1, alignItems: "center" },
  confirmBtn: { borderColor: colors.errorBorder, backgroundColor: colors.errorBg },
  btnText: { fontSize: 12, fontWeight: "600" },
});
