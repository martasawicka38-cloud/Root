import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppLogo } from "../../features/common/AppLogo";
import { Screen } from "../../features/common/Screen";
import { colors } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

const steps = [
  {
    title: "Kazdy krok ma znaczenie",
    desc: "Zamien codzienna aktywnosc w punkty. Spacer, bieganie i joga - wszystko sie liczy.",
  },
  {
    title: "Wybieraj eko na co dzien",
    desc: "Deklaruj dobre dzialania: mniej plastiku, rower zamiast auta i lokalne zakupy.",
  },
  {
    title: "Nagrody czekaja",
    desc: "Wymieniaj Eco-Coins na znizki i benefity od swojego pracodawcy.",
  },
];

export default function OnboardingScreen() {
  const step = useAppStore((s) => s.onboardingStep);
  const next = useAppStore((s) => s.nextOnboarding);
  const finish = useAppStore((s) => s.finishOnboarding);

  const item = steps[step] ?? steps[0];
  const isLast = step >= steps.length - 1;

  return (
    <Screen>
      <AppLogo />
      <View style={styles.badgeRow}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          if (isLast) {
            finish();
            router.replace("/(mobile)/home");
            return;
          }
          next();
        }}
      >
        <Text style={styles.buttonText}>{isLast ? "Rozpocznij" : "Dalej"}</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          finish();
          router.replace("/(mobile)/home");
        }}
      >
        <Text style={styles.skip}>Pomijam onboarding</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.slate300,
  },
  dotActive: { width: 24, backgroundColor: colors.mossGreen },
  title: {
    marginTop: 28,
    fontSize: 28,
    fontWeight: "700",
    color: colors.deepForest,
    textAlign: "center",
  },
  desc: {
    marginTop: 8,
    color: colors.slate600,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.mossGreen,
    borderRadius: 12,
    padding: 14,
  },
  buttonText: { textAlign: "center", color: colors.white, fontWeight: "700" },
  skip: {
    marginTop: 12,
    textAlign: "center",
    color: colors.slate600,
    fontWeight: "600",
  },
});
