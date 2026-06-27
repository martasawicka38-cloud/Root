import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./types";

export function ClothesIcon({ size = 24, color = "#1B4332" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l-6 4v2l-2 2v10h16V10l-2-2V6l-6-4z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2c-1.5 1.5-3 2-4 2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2c1.5 1.5 3 2 4 2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
