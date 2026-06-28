import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors } from "../../styles/tokens";
import { ekoStyles as styles } from "./eko.styles";

const STAGE_IMAGES: Record<number, any> = {
  1: require("../../../assets/00_seed.png"),
  2: require("../../../assets/01_seed.png"),
  3: require("../../../assets/02_seed.png"),
};

function StageImage({ level }: { level: number }) {
  const src = STAGE_IMAGES[level];
  return src ? <Image source={src} style={styles.stageImage} /> : null;
}

interface RootEvolutionCardProps {
  currentStage?: { name: string; level: number; expRequired: number } | null;
  nextStage?: { name: string; expRequired: number } | null;
  totalExp: number;
  canTransform: boolean;
  onTransform: () => void;
  transforming: boolean;
}

export function RootEvolutionCard({ currentStage, nextStage, totalExp, canTransform, onTransform, transforming }: RootEvolutionCardProps) {
  const { t } = useTranslation();
  const expProgress = nextStage
    ? Math.min(100, ((totalExp - (currentStage?.expRequired ?? 0)) / (nextStage.expRequired - (currentStage?.expRequired ?? 0))) * 100)
    : 100;

  return (
    <View style={[styles.card, styles.cardLight, { marginBottom: 16 }]}>
      <View style={styles.cardBody}>
        <View style={styles.row}>
          <StageImage level={currentStage?.level ?? 1} />
          <View style={styles.stageInfo}>
            <Text style={styles.stageName}>{currentStage?.name ?? "Ziarenko"}</Text>
            <Text style={styles.expLabel}>{totalExp} EXP</Text>
          </View>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.max(1, expProgress)}%` }]} />
        </View>
        {nextStage && <Text style={styles.nextStageText}>{nextStage.name} · {nextStage.expRequired} EXP</Text>}
        {canTransform && (
          <Pressable onPress={onTransform} style={[styles.btnPrimary, { marginTop: 8 }]}>
            {transforming ? <ActivityIndicator color={colors.brownDark} /> : <Text style={styles.btnPrimaryText}>{t("eco.evolve")}</Text>}
          </Pressable>
        )}
      </View>
    </View>
  );
}
