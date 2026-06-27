import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./types";

export function LightbulbIcon({ size = 24, color = "#C5E368" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18h6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 22h4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6.5 6.5 0 1 0 7.5 16.5c.5.5 1 1 1 1.5h7c0-.5.5-1 1-1.5.36-.36.64-.8.84-1.26"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
