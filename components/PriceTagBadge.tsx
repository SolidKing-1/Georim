import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Svg, { G, Path, Mask, Defs, ClipPath, Rect } from "react-native-svg";
import PriceTagGlass from "./GlassEffects/priceTagGlass.png";

type Props = {
  price: string;
};

const priceTagSize = Image.resolveAssetSource(PriceTagGlass);

function PriceTagIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <G clipPath="url(#clip0_1102_3953)">
        <Mask
          id="mask0_1102_3953"
          maskUnits="userSpaceOnUse"
          x={1}
          y={1}
          width={12}
          height={11}
        >
          <Path
            d="M2.90547 5.68607L8.29002 2.10146L9.72386 4.25528"
            stroke="white"
            strokeWidth={0.658938}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M1.72987 5.93274L11.1345 3.95924L11.4306 5.36994C10.7252 5.51795 10.1185 6.1362 10.2912 6.95911C10.4639 7.78202 11.3173 8.33936 12.0226 8.19134L12.3186 9.60205L2.91397 11.5755L2.61794 10.1648C3.32329 10.0168 3.92997 9.39858 3.73262 8.45812C3.53527 7.51765 2.73124 7.19543 2.02589 7.34344L1.72987 5.93274Z"
            fill="white"
            stroke="white"
            strokeWidth={0.658938}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M5.2494 7.49792L6.6601 7.2019M5.54542 8.90863L8.83706 8.2179"
            stroke="black"
            strokeWidth={0.658938}
            strokeLinecap="round"
          />
        </Mask>
        <G mask="url(#mask0_1102_3953)">
          <Path
            d="M0 2.36823L11.2856 2.6739e-05L13.6538 11.2856L2.3682 13.6538L0 2.36823Z"
            fill="white"
          />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_1102_3953">
          <Rect
            width="11.5314"
            height="11.5314"
            fill="white"
            transform="translate(0 2.36823) rotate(-11.8511)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default function PriceTagBadge({ price }: Props) {
  return (
    <View
      style={[
        styles.container,
        { width: priceTagSize.width, height: priceTagSize.height },
      ]}
    >
      <Image source={PriceTagGlass} style={styles.overlay} />
      <View style={styles.content}>
        <PriceTagIcon />
        <Text style={styles.text}>{price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "stretch",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  text: {
    color: "#ffffff",
    fontWeight: "400",
    fontSize: 11,
  },
});
