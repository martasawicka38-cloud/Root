import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./types";

export function LeafIcon({ size = 24, color = "#2D6A4F" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 21c4-4 8-10 8-14a1 1 0 0 0-1-1c-4 0-10 4-14 8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 17c2-2 4.5-4 7-5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 20L11 13"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
