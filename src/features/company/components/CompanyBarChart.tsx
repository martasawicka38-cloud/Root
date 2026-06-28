import { Text, View } from "react-native";
import { styles } from "../company.styles";
import { colors } from "../../../styles/tokens";

export function CompanyBarChart({ data, emptyMsg }: {
  data: { label: string; steps: number }[];
  emptyMsg: string;
}) {
  if (data.length === 0) return (
    <View style={styles.chartCard}>
      <Text style={{ fontSize: 14, color: colors.slate500, textAlign: "center", padding: 20 }}>{emptyMsg}</Text>
    </View>
  );

  const max = Math.max(...data.map((d) => d.steps), 1);
  const total = data.reduce((sum, d) => sum + d.steps, 0);
  const avg = Math.round(total / data.length);

  return (
    <View style={styles.chartCard}>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-start", marginBottom: 16 }}>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.mossGreen }}>{total.toLocaleString("pl-PL")}</Text>
            <Text style={{ fontSize: 11, color: colors.slate500 }}>Suma</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.mossGreen }}>{avg.toLocaleString("pl-PL")}</Text>
            <Text style={{ fontSize: 11, color: colors.slate500 }}>Srednia</Text>
          </View>
        </View>
      </View>
      <View style={styles.chartRow}>
        {data.map((d, i) => (
          <View key={`${d.label}-${i}`} style={styles.chartCol}>
            <Text style={styles.chartBarValue}>{d.steps > 0 ? d.steps.toLocaleString("pl-PL") : ""}</Text>
            <View style={[styles.chartBar, { height: Math.max((d.steps / max) * 140, 4) }]} />
            <Text style={styles.chartLabel}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
