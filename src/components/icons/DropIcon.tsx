import Svg, { Path } from "react-native-svg";
import type { IconProps } from "./types";

export function DropIcon({ size = 24, color = "#4A5E0F" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22c4 0 7-3 7-7 0-4-3.5-9-7-13-3.5 4-7 9-7 13 0 4 3 7 7 7Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
