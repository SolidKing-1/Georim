import React from "react";
import Svg, { Rect, Path } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
};

const DocIcon: React.FC<Props> = ({ size = 24, color = "#932FF8" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="4"
      y="3"
      width="16"
      height="18"
      rx="2"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11 8H8"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 12H16"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 16H8"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default DocIcon;
