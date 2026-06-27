import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./types";

export function TrophyIcon({ size = 24, color = "#D4A373" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 3h12v10a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V3Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 21h4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M12 17v4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
