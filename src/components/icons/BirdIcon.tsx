import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./types";

export function BirdIcon({ size = 24, color = "#1B4332" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 7c0-2.2-1.8-4-4-4S8 4.8 8 7c0 .7.2 1.4.5 2H6a2 2 0 00-2 2v1a7 7 0 003.5 6.1"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 7c2.2 0 4 1.8 4 4v1a7 7 0 01-3.5 6.1"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 19v3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 22l-2-2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 22l2-2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
