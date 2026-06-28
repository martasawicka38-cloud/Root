import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { LeafIcon, TrophyIcon } from "../../components/icons";
import { fetchCompanyBySlug, fetchCompanyEmployees } from "../../lib/api/endpoints";
import { colors } from "../../styles/tokens";
import { homeStyles as styles } from "./home.styles";

export function CompanyHome({ companySlug }: { companySlug: string }) {
  const { t } = useTranslation();
  const { data: company, isPending: companyPending } = useQuery({
    queryKey: ["company", companySlug],
    queryFn: () => fetchCompanyBySlug(companySlug),
    enabled: !!companySlug,
  });

  const { data: employees, isPending: employeesPending } = useQuery({
    queryKey: ["company", companySlug, "employees"],
    queryFn: () => fetchCompanyEmployees(companySlug),
    enabled: !!companySlug,
  });

  if (companyPending || employeesPending) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.mossGreen} /></View>;
  }

  const employeeCount = employees?.length ?? 0;
  const totalBalance = employees?.reduce((sum, e) => sum + e.balance, 0) ?? 0;
  const activeEmployees = employees?.filter((e) => e.isActive).length ?? 0;

  return (
    <>
      <Text style={styles.greeting}>{t("home.greeting")} <Text style={styles.greetingName}>{company?.name ?? t("common.company")}</Text></Text>

      <View style={[styles.card, styles.cardLight, { marginBottom: 16 }]}>
        <View style={styles.cardBody}>
          <Text style={styles.companyStatsTitle}>{t("home.companyDashboard")}</Text>
          <View style={styles.companyStatsRow}>
            <View style={styles.companyStatItem}>
              <Text style={styles.companyStatValue}>{employeeCount}</Text>
              <Text style={styles.companyStatLabel}>{t("home.employees")}</Text>
            </View>
            <View style={styles.companyStatItem}>
              <Text style={styles.companyStatValue}>{activeEmployees}</Text>
              <Text style={styles.companyStatLabel}>{t("home.active")}</Text>
            </View>
            <View style={styles.companyStatItem}>
              <Text style={styles.companyStatValue}>{totalBalance}</Text>
              <Text style={styles.companyStatLabel}>{t("home.totalEC")}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Link href="/(mobile)/ranking" asChild><Pressable style={styles.actionTile}><TrophyIcon size={28} color={colors.mossGreen} /><Text style={styles.actionLabel}>{t("home.employeeRanking")}</Text></Pressable></Link>
        <Link href="/company" asChild><Pressable style={styles.actionTile}><LeafIcon size={28} color={colors.mossGreen} /><Text style={styles.actionLabel}>{t("home.companyPanel")}</Text></Pressable></Link>
      </View>
    </>
  );
}
