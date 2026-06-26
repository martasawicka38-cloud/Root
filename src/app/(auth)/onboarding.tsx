import { useState } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../../features/common/Screen";
import { colors, radius, spacing, typography } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

const steps = [
  {
    title: "Witaj w Root! 🌱",
    desc: "Kazdy krok, kazda eko-deklaracja i kazda aktywnosc fizyczna przybliza Cie do lepszej wersji siebie i zdrowszej planety.",
    icon: "💧",
  },
  {
    title: "Zgoda na przetwarzanie danych",
    desc: "Abys mogl w pelni korzystac z Root, potrzebujemy Twojej zgody na przetwarzanie danych osobowych i danych dotyczacych aktywnosci fizycznej.",
    icon: "☑️",
  },
  {
    title: "Twoj pierwszy cel",
    desc: "Zrob dzis 8 000 krokow - to zaledwie godzina spaceru! Zbierzesz pierwsze Eco-Coins i odblokujesz osiagniecie Pierwszy krok.",
    icon: "🏃",
  },
];

export default function OnboardingScreen() {
  const step = useAppStore((s) => s.onboardingStep);
  const next = useAppStore((s) => s.nextOnboarding);
  const finish = useAppStore((s) => s.finishOnboarding);
  const [consentOne, setConsentOne] = useState(false);
  const [consentTwo, setConsentTwo] = useState(false);

  const item = steps[step] ?? steps[0];
  const isLast = step >= steps.length - 1;
  const consentStep = step === 1;
  const consentValid = consentOne && consentTwo;

  return (
    <Screen>
      <View style={styles.badgeRow}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>

      {consentStep ? (
        <View style={styles.consentsWrap}>
          <Pressable
            style={styles.consentRow}
            onPress={() => setConsentOne((v) => !v)}
          >
            <Text style={styles.checkbox}>{consentOne ? "☑" : "☐"}</Text>
            <Text style={styles.consentText}>
              Zgadzam sie na przetwarzanie moich danych osobowych zgodnie z
              polityka prywatnosci.
            </Text>
          </Pressable>
          <Pressable
            style={styles.consentRow}
            onPress={() => setConsentTwo((v) => !v)}
          >
            <Text style={styles.checkbox}>{consentTwo ? "☑" : "☐"}</Text>
            <Text style={styles.consentText}>
              Wyrazam zgode na przetwarzanie danych dotyczacych mojej aktywnosci
              fizycznej.
            </Text>
          </Pressable>
        </View>
      ) : null}

      <Pressable
        style={[
          styles.button,
          consentStep && !consentValid && styles.buttonDisabled,
        ]}
        disabled={consentStep && !consentValid}
        onPress={() => {
          if (isLast) {
            finish();
            router.replace("/(mobile)/home");
            return;
          }
          next();
        }}
      >
        <Text style={styles.buttonText}>
          {isLast ? "Rozpocznij przygode!" : "Dalej"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          finish();
          router.replace("/(mobile)/home");
        }}
      >
        <Text style={styles.skip}>Pomin</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.slate300,
  },
  dotActive: { width: 24, backgroundColor: colors.mossGreen, borderRadius: 10 },
  iconCircle: {
    marginTop: spacing.x3l,
    width: 120,
    height: 120,
    borderRadius: radius.full,
    backgroundColor: "#BDEBCB",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  iconText: {
    fontSize: 42,
  },
  title: {
    marginTop: 28,
    fontSize: 42,
    fontWeight: "700",
    color: colors.deepForest,
    textAlign: "center",
    lineHeight: 50,
  },
  desc: {
    marginTop: spacing.x3s,
    color: colors.slate600,
    textAlign: "center",
    lineHeight: 36,
    fontSize: 32,
    fontWeight: "500",
  },
  consentsWrap: {
    marginTop: spacing.xs,
    gap: spacing.x2s,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.x3s,
  },
  checkbox: {
    fontSize: 20,
    color: colors.slate600,
    marginTop: 2,
  },
  consentText: {
    flex: 1,
    ...typography.body,
    color: colors.slate900,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.mossGreen,
    borderRadius: radius.md,
    padding: 14,
  },
  buttonDisabled: {
    backgroundColor: colors.slate300,
  },
  buttonText: { textAlign: "center", color: colors.white, fontWeight: "700" },
  skip: {
    marginTop: "auto",
    marginBottom: spacing.x2l,
    textAlign: "center",
    color: colors.slate600,
    fontWeight: "600",
  },
});
