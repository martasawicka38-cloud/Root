import Svg, { Circle, Path } from "react-native-svg";
import type { IconProps } from "./types";

export function CoinIcon({ size = 24, color = "#C5E368" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={12}
        r={9}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.5 8.5h-3a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 7v10"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
