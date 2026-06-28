import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { AdminDashboard, AnalyticsUser, UserStepsPayload } from "../../../lib/types/api";
import { fetchAnalyticsUsers, fetchAdminDashboard, fetchUserSteps } from "../../../lib/api/endpoints";
import { IconSteps, IconTrophy, IconActivity } from "../components/Icons";
import { styles } from "../admin.styles";
import { colors, radius, spacing } from "../../../styles/tokens";
import { LoadingState } from "../../../components/shared/LoadingState";

type AnalyticsSubTab = "steps" | "ranking" | "activity";
type StepsPeriod = "day" | "week" | "month" | "custom";

export function AnalyticsTab() {
  const { t } = useTranslation();
  const [subTab, setSubTab] = useState<AnalyticsSubTab>("steps");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const usersQuery = useQuery({
    queryKey: ["admin", "analytics-users"],
    queryFn: fetchAnalyticsUsers,
  });

  const dashboardQuery = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: fetchAdminDashboard,
  });

  if (usersQuery.isPending) return <LoadingState />;
  if (usersQuery.error) return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>{t("common.errorLoading")}</Text>
      <Text style={styles.errorDetail}>{usersQuery.error.message}</Text>
    </View>
  );

  const users = usersQuery.data ?? [];
  const dashboard = dashboardQuery.data;

  if (users.length === 0) return (
    <View>
      <Text style={styles.pageTitle}>{t("admin.analytics.title")}</Text>
      <View style={styles.analyticsPlaceholder}>
        <Text style={styles.analyticsPlaceholderText}>{t("admin.analytics.noUsers")}</Text>
      </View>
    </View>
  );

  if (!selectedUserId && users.length > 0) {
    setSelectedUserId(users[0].id);
  }

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? users[0];

  const SUB_TABS: { key: AnalyticsSubTab; label: string; icon: React.ReactNode }[] = [
    { key: "steps", label: t("admin.analytics.steps"), icon: <IconSteps color={subTab === "steps" ? colors.mossGreen : colors.slate500} /> },
    { key: "ranking", label: t("admin.analytics.employeeRanking"), icon: <IconTrophy color={subTab === "ranking" ? colors.mossGreen : colors.slate500} /> },
    { key: "activity", label: t("admin.analytics.recentActivity"), icon: <IconActivity color={subTab === "activity" ? colors.mossGreen : colors.slate500} /> },
  ];

  return (
    <View style={styles.analyticsLayout}>
      <View style={styles.analyticsSidebar}>
        {SUB_TABS.map((item) => (
          <Pressable
            key={item.key}
            style={[styles.analyticsSidebarItem, subTab === item.key && styles.analyticsSidebarItemActive]}
            onPress={() => setSubTab(item.key)}
          >
            <View style={styles.analyticsSidebarIcon}>{item.icon}</View>
            <Text style={[styles.analyticsSidebarLabel, subTab === item.key && styles.analyticsSidebarLabelActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.analyticsMain}>
        <View style={{ minHeight: 500 }}>
        {subTab === "steps" && (
          <AnalyticsStepsView
            users={users}
            selectedUserId={selectedUserId}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUserId}
          />
        )}

        {subTab === "ranking" && (
          <AnalyticsRankingView dashboard={dashboard} isLoading={dashboardQuery.isPending} />
        )}

        {subTab === "activity" && (
          <AnalyticsActivityView dashboard={dashboard} isLoading={dashboardQuery.isPending} />
        )}
        </View>
      </View>
    </View>
  );
}

function AnalyticsStepsView({
  users, selectedUserId, selectedUser, onSelectUser,
}: {
  users: AnalyticsUser[];
  selectedUserId: string;
  selectedUser: AnalyticsUser;
  onSelectUser: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<StepsPeriod>("day");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const getEffectivePeriod = (): "day" | "week" | "month" => {
    if (period !== "custom") return period;
    if (!customFrom || !customTo) return "day";
    const diffMs = new Date(customTo).getTime() - new Date(customFrom).getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays <= 14) return "day";
    if (diffDays <= 90) return "week";
    return "month";
  };

  const effectivePeriod = getEffectivePeriod();
  const from = period === "custom" ? customFrom : undefined;
  const to = period === "custom" ? customTo : undefined;

  const stepsQuery = useQuery({
    queryKey: ["admin", "user-steps", selectedUserId, effectivePeriod, from, to],
    queryFn: () => fetchUserSteps(selectedUserId, effectivePeriod, from, to),
    enabled: selectedUserId.length > 0 && (period !== "custom" || (!!customFrom && !!customTo)),
  });

  const PERIOD_OPTIONS: { key: StepsPeriod; label: string }[] = [
    { key: "day", label: t("admin.analytics.periods.7days") },
    { key: "week", label: t("admin.analytics.periods.9weeks") },
    { key: "month", label: t("admin.analytics.periods.12months") },
    { key: "custom", label: t("admin.analytics.periods.custom") },
  ];

  const formatLabel = (label: string) => {
    if (effectivePeriod === "day") {
      const d = new Date(label);
      if (period === "day") return d.toLocaleDateString("pl-PL", { weekday: "short" });
      return d.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
    }
    if (effectivePeriod === "week") {
      const parts = label.split("-W");
      return parts.length === 2 ? `T${parts[1]}` : label;
    }
    if (effectivePeriod === "month") {
      const monthNames = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paz", "Lis", "Gru"];
      const idx = parseInt(label.split("-")[1], 10) - 1;
      return monthNames[idx] ?? label;
    }
    return label;
  };

  return (
    <>
      <View style={styles.analyticsSelector}>
        <Text style={styles.analyticsSelectorLabel}>{t("admin.analytics.selectUser")}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <View style={styles.analyticsUserList}>
            {users.map((u) => (
              <Pressable
                key={u.id}
                style={[styles.analyticsUserBtn, selectedUserId === u.id && styles.analyticsUserBtnActive]}
                onPress={() => onSelectUser(u.id)}
              >
                <Text style={[styles.analyticsUserBtnText, selectedUserId === u.id && styles.analyticsUserBtnTextActive]}>
                  {u.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.analyticsUserInfo}>
        <Text style={styles.analyticsUserName}>{selectedUser.name}</Text>
        {selectedUser.rootStage && (
          <Text style={styles.analyticsUserStage}>
            {selectedUser.rootStage.name} (lvl {selectedUser.rootStage.level})
          </Text>
        )}
        <Text style={styles.analyticsUserExp}>{selectedUser.totalExp} XP</Text>
      </View>

      <View style={styles.periodSelector}>
        {PERIOD_OPTIONS.map((opt) => (
          <Pressable
            key={opt.key}
            style={[styles.periodBtn, period === opt.key && styles.periodBtnActive]}
            onPress={() => setPeriod(opt.key)}
          >
            <Text style={[styles.periodBtnText, period === opt.key && styles.periodBtnTextActive]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {period === "custom" && (
        <View style={styles.customDateRow}>
          <View style={styles.customDateField}>
            <Text style={styles.customDateLabel}>{t("admin.analytics.from")}</Text>
            <TextInput
              style={styles.customDateInput}
              placeholder="RRRR-MM-DD"
              value={customFrom}
              onChangeText={setCustomFrom}
              placeholderTextColor={colors.inputPlaceholder}
            />
          </View>
          <View style={styles.customDateField}>
            <Text style={styles.customDateLabel}>{t("admin.analytics.to")}</Text>
            <TextInput
              style={styles.customDateInput}
              placeholder="RRRR-MM-DD"
              value={customTo}
              onChangeText={setCustomTo}
              placeholderTextColor={colors.inputPlaceholder}
            />
          </View>
        </View>
      )}

      <BarChartSection
        query={stepsQuery}
        formatLabel={formatLabel}
        emptyMsg={t("common.noData")}
      />
    </>
  );
}

function AnalyticsRankingView({ dashboard, isLoading }: {
  dashboard?: AdminDashboard;
  isLoading: boolean;
}) {
  const { t } = useTranslation();

  if (isLoading) return <LoadingState />;
  if (!dashboard) return <Text style={styles.emptyText}>{t("common.noData")}</Text>;

  const companies = dashboard.companies ?? [];

  return (
    <>
      <Text style={styles.sectionTitle}>{t("admin.analytics.companyRanking")}</Text>
      {companies.length === 0 ? (
        <Text style={styles.emptyText}>{t("admin.analytics.noCompanies")}</Text>
      ) : (
        <View style={{ gap: spacing.x4s }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t("common.company")}</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>{t("admin.analytics.employees")}</Text>
          </View>
          {companies.map((c, i) => (
            <View key={c.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5, fontWeight: "700", color: colors.mossGreen }]}>{i + 1}</Text>
              <Text style={[styles.tableCell, { flex: 2, fontWeight: "600" }]}>{c.name}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{c.employeeCount}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

function AnalyticsActivityView({ dashboard, isLoading }: {
  dashboard?: AdminDashboard;
  isLoading: boolean;
}) {
  const { t } = useTranslation();

  if (isLoading) return <LoadingState />;
  if (!dashboard) return <Text style={styles.emptyText}>{t("common.noData")}</Text>;

  const activities = dashboard.recentActivity ?? [];

  return (
    <>
      <Text style={styles.sectionTitle}>{t("admin.analytics.recentActivity")} ({activities.length})</Text>
      {activities.length === 0 ? (
        <Text style={styles.emptyText}>{t("admin.analytics.noActivity")}</Text>
      ) : (
        <View style={{ gap: spacing.x4s }}>
          {activities.map((a) => (
            <View key={a.id} style={styles.tableRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.slate900 }}>{a.userName}</Text>
                <Text style={{ fontSize: 12, color: colors.slate500 }}>
                  {a.type} · {new Date(a.createdAt).toLocaleDateString("pl-PL")}
                </Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.mossGreen }}>+{a.points} EC</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

function BarChartSection({
  query,
  formatLabel,
  emptyMsg,
}: {
  query: { data?: UserStepsPayload; isPending: boolean; error: Error | null };
  formatLabel: (label: string) => string;
  emptyMsg: string;
}) {
  const { t } = useTranslation();

  if (query.isPending) return (
    <View style={styles.analyticsChartCard}>
      <LoadingState size="small" />
    </View>
  );

  if (query.error) return (
    <View style={styles.analyticsChartCard}>
      <View style={[styles.errorCard, { marginTop: 12 }]}>
        <Text style={styles.errorText}>{t("common.errorLoading")}</Text>
        <Text style={styles.errorDetail}>{query.error.message}</Text>
      </View>
    </View>
  );

  const data = query.data?.data ?? [];

  if (data.length === 0) return (
    <View style={styles.analyticsChartCard}>
      <Text style={styles.emptyText}>{emptyMsg}</Text>
    </View>
  );

  const max = Math.max(...data.map((d) => d.steps), 1);
  const total = data.reduce((sum, d) => sum + d.steps, 0);
  const avg = Math.round(total / data.length);

  return (
    <View style={styles.analyticsChartCard}>
      <View style={styles.analyticsChartHeader}>
        <View style={styles.analyticsChartStats}>
          <View style={styles.analyticsChartStat}>
            <Text style={styles.analyticsChartStatValue}>{total.toLocaleString("pl-PL")}</Text>
            <Text style={styles.analyticsChartStatLabel}>{t("admin.analytics.sum")}</Text>
          </View>
          <View style={styles.analyticsChartStat}>
            <Text style={styles.analyticsChartStatValue}>{avg.toLocaleString("pl-PL")}</Text>
            <Text style={styles.analyticsChartStatLabel}>{t("admin.analytics.average")}</Text>
          </View>
        </View>
      </View>

      <View style={styles.analyticsChartRow}>
        {data.map((d) => (
          <View key={d.label} style={styles.analyticsChartCol}>
            <Text style={styles.analyticsChartBarValue}>
              {d.steps > 0 ? d.steps.toLocaleString("pl-PL") : ""}
            </Text>
            <View
              style={[
                styles.analyticsChartBar,
                { height: Math.max((d.steps / max) * 140, 4) },
              ]}
            />
            <Text style={styles.analyticsChartLabel}>{formatLabel(d.label)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
