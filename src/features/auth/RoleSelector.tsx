import { Pressable, Text, View } from "react-native";
import { colors } from "../../styles/tokens";
import { registerStyles as styles } from "./register.styles";

type RoleOption = "user" | "employer" | "company";

interface RoleConfig {
  label: string;
  desc: string;
  color: string;
  bgColor: string;
}

interface RoleSelectorProps {
  role: RoleOption;
  roleConfig: Record<RoleOption, RoleConfig>;
  onSelect: (role: RoleOption) => void;
}

export function RoleSelector({ role, roleConfig, onSelect }: RoleSelectorProps) {
  return (
    <View style={styles.roleRow}>
      {(Object.entries(roleConfig) as [RoleOption, RoleConfig][]).map(([key, cfg]) => (
        <Pressable
          key={key}
          style={[styles.roleBtn, role === key && { backgroundColor: cfg.bgColor, borderColor: cfg.color }]}
          onPress={() => onSelect(key)}
        >
          <View style={[styles.roleDot, { backgroundColor: role === key ? cfg.color : colors.slate300 }]} />
          <Text style={[styles.roleLabel, { color: role === key ? cfg.color : colors.slate600 }]}>{cfg.label}</Text>
          <Text style={styles.roleDesc}>{cfg.desc}</Text>
        </Pressable>
      ))}
    </View>
  );
}
