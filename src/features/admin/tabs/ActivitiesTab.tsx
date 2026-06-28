import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivitiesTab as UnifiedActivitiesTab } from "../../../components/shared/ActivitiesTab";
import type { Company } from "../../../lib/types/api";
import { createRewardActivity, deleteRewardActivity, fetchCompanyActivities } from "../../../lib/api/endpoints";

interface ActivityInput {
  name: string;
  description?: string;
  icon: string;
  category: string;
  basePoints: number;
  activityType: string;
  expiresAt?: string;
}

export function ActivitiesTab({ companiesQuery }: { companiesQuery: { data?: Company[]; isPending: boolean; error: Error | null } }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedCompany, setSelectedCompany] = useState<string>("");

  const activitiesQuery = useQuery({
    queryKey: ["admin-activities", selectedCompany],
    queryFn: () => fetchCompanyActivities(selectedCompany),
    enabled: !!selectedCompany,
  });

  const createMutation = useMutation({
    mutationFn: createRewardActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-activities", selectedCompany] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRewardActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-activities", selectedCompany] }),
  });

  const handleCreate = (input: ActivityInput) => {
    if (!selectedCompany) return;
    createMutation.mutate({ ...input, companyId: selectedCompany });
  };

  return (
    <UnifiedActivitiesTab
      activities={activitiesQuery.data ?? []}
      isPending={activitiesQuery.isPending && !!selectedCompany}
      error={activitiesQuery.error}
      onCreate={handleCreate}
      creating={createMutation.isPending}
      onDelete={deleteMutation.mutate}
      deleting={deleteMutation.isPending}
      companies={companiesQuery.data}
      selectedCompanyId={selectedCompany}
      onSelectCompany={setSelectedCompany}
      titleKey="admin.activities.companyActivities"
      emptyKey="admin.activities.noActivities"
    />
  );
}
