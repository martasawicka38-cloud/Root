import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../../styles/tokens";

interface TableColumn {
  label: string;
  flex: number;
  align?: "left" | "center" | "right";
}

interface TableHeaderProps {
  columns: TableColumn[];
}

export function TableHeader({ columns }: TableHeaderProps) {
  return (
    <View style={styles.row}>
      {columns.map((col, i) => (
        <Text key={i} style={[styles.cell, { flex: col.flex, textAlign: col.align ?? "left" }]}>
          {col.label}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", backgroundColor: colors.slate100, borderWidth: 1, borderColor: colors.slate200, borderRadius: radius.sm, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 4 },
  cell: { fontSize: 12, fontWeight: "700", color: colors.slate500, textTransform: "uppercase", letterSpacing: 0.5 },
});
