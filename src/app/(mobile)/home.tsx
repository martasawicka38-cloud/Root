import { useQuery } from "@tanstack/react-query";
import { Screen } from "../../features/common/Screen";
import { fetchMe } from "../../lib/api/endpoints";
import { UserHome } from "../../features/home/UserHome";
import { CompanyHome } from "../../features/home/CompanyHome";

export default function HomeScreen() {
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: fetchMe });

  if (me?.role === "company") {
    return (
      <Screen>
        <CompanyHome companySlug={me.partner} />
      </Screen>
    );
  }

  return (
    <Screen>
      <UserHome userName={me?.name ?? ""} />
    </Screen>
  );
}
