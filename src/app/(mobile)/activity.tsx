import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTranslation } from "react-i18next";

import { BikeIcon, RunningIcon } from "../../components/icons";
import { Screen } from "../../features/common/Screen";
import {
  addActivity,
  deleteActivity,
  fetchActivities,
} from "../../lib/api/endpoints";
import { colors, radius, spacing } from "../../styles/tokens";

function SwimIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 17c2-2 4-1 6 0s4 2 6 0 4-2 6 0"
        stroke={colors.slate700}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M2 21c2-2 4-1 6 0s4 2 6 0 4-2 6 0"
        stroke={colors.slate700}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M2 13l2-6 4 2 3-5 4 3 3-4"
        stroke={colors.slate700}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function YogaIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke={colors.slate700}
        strokeWidth={1.5}
      />
      <Path
        d="M7 22l3-6 2 3 4-6"
        stroke={colors.slate700}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 14l3-2 4 2"
        stroke={colors.slate700}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function GymIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14" stroke={colors.slate700} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M3 8v8" stroke={colors.slate700} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M21 8v8" stroke={colors.slate700} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M7 5l2 14" stroke={colors.slate700} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M17 5l-2 14" stroke={colors.slate700} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

const types = ["walking", "running", "cycling", "swimming", "yoga", "gym"] as const;

export default function ActivityScreen() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [type, setType] = useState<(typeof types)[number]>("walking");
  const [minutes, setMinutes] = useState("30");
  const { data: log = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
  });
  const createMutation = useMutation({
    mutationFn: addActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const typeMeta = useMemo<Record<string, { label: string; icon: typeof RunningIcon }>>(() => ({
    walking: { label: t("activity.types.walking"), icon: RunningIcon },
    running: { label: t("activity.types.running"), icon: RunningIcon },
    cycling: { label: t("activity.types.cycling"), icon: BikeIcon },
    swimming: { label: t("activity.types.swimming"), icon: SwimIcon },
    yoga: { label: t("activity.types.yoga"), icon: YogaIcon },
    gym: { label: t("activity.types.gym"), icon: GymIcon },
  }), [t]);

  const estimate = useMemo(() => {
    const map = {
      walking: 120,
      running: 200,
      cycling: 150,
      swimming: 180,
      yoga: 50,
      gym: 100,
    } as const;
    const m = Number(minutes) || 0;
    const steps = m * map[type];
    return { steps, points: Math.min(40, Math.floor(steps / 200)) };
  }, [minutes, type]);

  return (
    <Screen>
      <Text style={styles.title}>{t("activity.title")}</Text>

      <Text style={styles.sectionLabel}>{t("activity.selectType")}</Text>
      <View style={styles.typeGrid}>
        {types.map((t) => {
          const meta = typeMeta[t];
          const isActive = t === type;
          return (
            <Pressable
              key={t}
              style={[styles.typeBtn, isActive && styles.typeBtnActive]}
              onPress={() => setType(t)}
            >
              <meta.icon size={22} />
              <Text style={[styles.typeText, isActive && styles.typeTextActive]}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>{t("activity.duration")}</Text>
      <TextInput
        value={minutes}
        onChangeText={setMinutes}
        keyboardType="number-pad"
        style={styles.input}
        placeholder="np. 30"
      />

      <View style={styles.estimateCard}>
        <Text style={styles.estimateLabel}>{t("activity.estimated")}</Text>
        <View style={styles.estimateRow}>
          <Text style={styles.estimateValue}>
            {estimate.steps.toLocaleString("pl-PL")}
          </Text>
          <Text style={styles.estimateUnit}>{t("activity.stepsUnit")}</Text>
        </View>
        <View style={styles.estimateRow}>
          <Text style={styles.estimatePoints}>+{estimate.points} EC</Text>
        </View>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => {
          const m = Number(minutes) || 0;
          if (m > 0) createMutation.mutate({ type, minutes: m });
        }}
      >
        <Text style={styles.buttonText}>{t("activity.title")}</Text>
      </Pressable>

      <Text style={styles.sectionLabel}>{t("activity.log")}</Text>
      {log.length === 0 && (
        <Text style={styles.emptyText}>{t("activity.empty")}</Text>
      )}
      {log.map((item) => (
        <View key={item.id} style={styles.logItem}>
          <View style={styles.logItemLeft}>
            <Text style={styles.logType}>
              {typeMeta[item.type]?.label ?? item.type}
            </Text>
            <Text style={styles.logDetail}>
              {item.minutes} min • +{item.points} EC
            </Text>
          </View>
          <Pressable onPress={() => deleteMutation.mutate(item.id)}>
            <Text style={styles.logDelete}>{t("common.delete")}</Text>
          </Pressable>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.deepForest,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.slate500,
    marginTop: 12,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.x3s,
  },
  typeBtn: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.x3s,
    backgroundColor: colors.inputBg,
  },
  typeBtnActive: {
    borderColor: colors.mossGreen,
    backgroundColor: colors.mist,
  },
  typeText: {
    fontSize: 14,
    color: colors.slate700,
    fontWeight: "600",
  },
  typeTextActive: {
    color: colors.mossGreen,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
    fontSize: 16,
    color: colors.slate900,
    backgroundColor: colors.inputBg,
  },
  estimateCard: {
    marginTop: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
    gap: spacing.x3s,
  },
  estimateLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.slate500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  estimateRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  estimateValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.deepForest,
  },
  estimateUnit: {
    fontSize: 14,
    color: colors.slate500,
  },
  estimatePoints: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.mossGreen,
  },
  button: {
    marginTop: 12,
    backgroundColor: colors.mossGreen,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    color: colors.slate400,
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  logItem: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.inputBg,
  },
  logItemLeft: {
    gap: 2,
  },
  logType: {
    fontSize: 15,
    color: colors.slate900,
    fontWeight: "600",
  },
  logDetail: {
    fontSize: 13,
    color: colors.slate500,
  },
  logDelete: {
    color: colors.error,
    fontWeight: "600",
    fontSize: 14,
  },
});
