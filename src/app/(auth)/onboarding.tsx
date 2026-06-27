import { useState } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CheckIcon, DropIcon, RunningIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import { colors, radius } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

const steps = [
  {
    title: "Witaj w Root!",
    desc: "Kazdy krok, kazda eko-deklaracja i kazda aktywnosc fizyczna przybliza Cie do lepszej wersji siebie i zdrowszej planety.",
    icon: DropIcon,
  },
  {
    title: "Zgoda na przetwarzanie danych",
    desc: "Abys mogl w pelni korzystac z Root, potrzebujemy Twojej zgody na przetwarzanie danych osobowych i danych dotyczacych aktywnosci fizycznej.",
    icon: CheckIcon,
  },
  {
    title: "Twoj pierwszy cel",
    desc: "Zrob dzis 8 000 krokow - to zaledwie godzina spaceru! Zbierzesz pierwsze Eco-Coins i odblokujesz osiagniecie Pierwszy krok.",
    icon: RunningIcon,
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
      <View style={styles.dots}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.iconWrap}>
        <item.icon size={48} color={colors.mossGreen} />
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.desc}</Text>

      {consentStep && (
        <View style={styles.consents}>
          <Pressable
            style={styles.consentRow}
            onPress={() => setConsentOne((v) => !v)}
          >
            <View style={[styles.checkbox, consentOne && styles.checkboxChecked]}>
              {consentOne && <CheckIcon size={12} color={colors.white} />}
            </View>
            <Text style={styles.consentText}>
              Zgadzam sie na przetwarzanie moich danych osobowych zgodnie z
              polityka prywatnosci.
            </Text>
          </Pressable>
          <Pressable
            style={styles.consentRow}
            onPress={() => setConsentTwo((v) => !v)}
          >
            <View style={[styles.checkbox, consentTwo && styles.checkboxChecked]}>
              {consentTwo && <CheckIcon size={12} color={colors.white} />}
            </View>
            <Text style={styles.consentText}>
              Wyrazam zgode na przetwarzanie danych dotyczacych mojej aktywnosci
              fizycznej.
            </Text>
          </Pressable>
        </View>
      )}

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
          } else {
            next();
          }
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
  dots: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.slate300,
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.mossGreen,
    borderRadius: 10,
  },
  iconWrap: {
    marginTop: 24,
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "700",
    color: colors.deepForest,
    textAlign: "center",
    lineHeight: 32,
  },
  desc: {
    marginTop: 10,
    fontSize: 15,
    color: colors.slate600,
    textAlign: "center",
    lineHeight: 22,
  },
  consents: {
    marginTop: 16,
    gap: 10,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.slate300,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.mossGreen,
    borderColor: colors.mossGreen,
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    color: colors.slate700,
    lineHeight: 20,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.mossGreen,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.slate300,
  },
  buttonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "700",
  },
  skip: {
    marginTop: "auto",
    marginBottom: 32,
    textAlign: "center",
    color: colors.slate500,
    fontWeight: "600",
    fontSize: 14,
  },
});
