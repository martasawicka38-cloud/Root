import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./types";

export function NatureIcon({ size = 24, color = "#293211" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22V10"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 8c0-3-2.5-5-5-6-2.5 1-5 3-5 6 0 2.5 2.5 5 5 6 2.5-1 5-3.5 5-6z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 14c-2-1-4-3-4-6 3 0 5 1.5 6 3.5 1-2 3-3.5 6-3.5 0 3-2 5-4 6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
