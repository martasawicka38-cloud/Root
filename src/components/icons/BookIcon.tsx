import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./types";

export function BookIcon({ size = 24, color = "#293211" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 4c2-1.5 4-2 6-2 3 0 4 1 4 2v14c0-1-1-2-4-2-2 0-4 .5-6 2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 4c-2-1.5-4-2-6-2-3 0-4 1-4 2v14c0-1 1-2 4-2 2 0 4 .5 6 2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
