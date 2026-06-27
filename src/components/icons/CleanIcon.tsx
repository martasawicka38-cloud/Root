import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./types";

export function CleanIcon({ size = 24, color = "#1B4332" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 21l3-3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 8l3-3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 14L6 18c-1 1-1 2.5 0 3.5.5.5 1.5.5 2 0l4-4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.5 6.5L17.5 3.5c.8-.8 2-.8 2.8 0 .8.8.8 2 0 2.8L17 9.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 9.5l-5 5c-.8.8-2 1.2-3.2 1.2H6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
