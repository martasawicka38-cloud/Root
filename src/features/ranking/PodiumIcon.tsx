import { Text, View } from "react-native";
import { colors } from "../../styles/tokens";
import { rankingStyles as styles } from "./ranking.styles";

export function PodiumIcon({ rank }: { rank: number }) {
  const bgColors = [colors.greenBright, colors.creamDark, colors.creamMedium];
  return (
    <View style={[styles.podiumIcon, { backgroundColor: bgColors[rank - 1] ?? colors.creamDark }]}>
      <Text style={styles.podiumIconText}>{rank}</Text>
    </View>
  );
}
