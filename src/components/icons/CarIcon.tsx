import Svg, { Path, Circle } from "react-native-svg";
import type { IconProps } from "./types";

export function CarIcon({ size = 24, color = "#293211" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 17h14M5 17a2 2 0 01-2-2v-3l2.6-5.2A1 1 0 016.5 6h11a1 1 0 01.9.6L21 12v3a2 2 0 01-2 2M5 17a2 2 0 002 2h10a2 2 0 002-2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx={7.5}
        cy={14}
        r={1.5}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx={16.5}
        cy={14}
        r={1.5}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
