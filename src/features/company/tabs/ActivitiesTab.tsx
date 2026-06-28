import { useTranslation } from "react-i18next";
import { ActivitiesTab as UnifiedActivitiesTab } from "../../../components/shared/ActivitiesTab";
import type { EcoActivity } from "../../../lib/types/api";

interface ActivityInput {
  name: string;
  description?: string;
  icon: string;
  category: string;
  basePoints: number;
  activityType: string;
  expiresAt?: string;
}

export function ActivitiesTab({ query, onCreate, creating, onDelete, deleting }: {
  query: { data?: EcoActivity[]; isPending: boolean; error: Error | null };
  onCreate: (input: ActivityInput) => void;
  creating: boolean;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const { t } = useTranslation();

  return (
    <UnifiedActivitiesTab
      activities={query.data ?? []}
      isPending={query.isPending}
      error={query.error}
      onCreate={onCreate}
      creating={creating}
      onDelete={onDelete}
      deleting={deleting}
      titleKey="company.activities.title"
      emptyKey="company.activities.noActivities"
    />
  );
}
