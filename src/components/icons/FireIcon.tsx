import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./types";

export function FireIcon({ size = 24, color = "#D62828" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22c4 0 7-3 7-7 0-4-3-8-7-12-4 4-7 8-7 12 0 4 3 7 7 7Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 17c2 0 3-1 3-3 0-2-1.5-4-3-5.5C10.5 10 9 12 9 14c0 2 1 3 3 3Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
