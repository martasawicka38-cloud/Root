import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./types";

export function CheeseIcon({ size = 24, color = "#293211" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 18L12 4l10 14H2z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 18a2 2 0 100-4 2 2 0 000 4z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 14a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
