import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CheckIcon, DropIcon, RunningIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import { colors, radius, spacing } from "../../styles/tokens";
import { useAppStore } from "../../store/useAppStore";

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const step = useAppStore((s) => s.onboardingStep);
  const next = useAppStore((s) => s.nextOnboarding);
  const finish = useAppStore((s) => s.finishOnboarding);
  const [consentOne, setConsentOne] = useState(false);
  const [consentTwo, setConsentTwo] = useState(false);

  const steps = [
    {
      title: t("auth.onboarding.welcomeTitle"),
      desc: t("auth.onboarding.welcomeDesc"),
      icon: DropIcon,
    },
    {
      title: t("auth.onboarding.consentTitle"),
      desc: t("auth.onboarding.consentDesc"),
      icon: CheckIcon,
    },
    {
      title: t("auth.onboarding.goalTitle"),
      desc: t("auth.onboarding.goalDesc"),
      icon: RunningIcon,
    },
  ];

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
              {t("auth.onboarding.consentPersonal")}
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
              {t("auth.onboarding.consentActivity")}
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
          {isLast ? t("auth.onboarding.startAdventure") : t("auth.onboarding.next")}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          finish();
          router.replace("/(mobile)/home");
        }}
      >
        <Text style={styles.skip}>{t("auth.onboarding.skip")}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: "row",
    gap: spacing.x3s,
    justifyContent: "center",
    marginTop: spacing.x2s,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.slate300,
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.mossGreen,
    borderRadius: 10,
  },
  iconWrap: {
    marginTop: spacing.md,
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  title: {
    marginTop: spacing.xs,
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
    marginTop: spacing.xs,
    gap: 10,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.x2s,
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
    marginTop: spacing.xs,
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
    marginBottom: spacing.lg,
    textAlign: "center",
    color: colors.slate500,
    fontWeight: "600",
    fontSize: 14,
  },
});
