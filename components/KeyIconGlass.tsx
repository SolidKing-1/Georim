import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import GlassButton from "./GlassButton";
import KeyIconGlassEffect from "./GlassEffects/KeyIconGlassEffect.png";

type Props = {
  size?: number;
};

export default function KeyIconGlass({ size = 100 }: Props) {
  const radius = size / 2;
  return (
    <GlassButton
      style={[styles.wrapper, { width: size, height: size }]}
      borderRadius={radius}
      isCircular={true}
    >
      <View
        style={[styles.circleBg, { width: size, height: size, borderRadius: radius }]}
      />
      <Image
        source={KeyIconGlassEffect}
        style={[
          styles.circleEffect,
          { width: size, height: size, borderRadius: radius },
        ]}
      />
      <View
        style={[styles.iconInner, { width: size, height: size, borderRadius: radius }]}
      >
        <Svg width={60} height={60} viewBox="0 0 42 42" fill="none">
          <Path
            d="M30.9527 14.2856C30.9526 13.2193 30.5458 12.153 29.7323 11.3395C28.9187 10.5259 27.8523 10.1191 26.786 10.1191M26.786 26.7858C33.6896 26.7858 39.286 21.1893 39.286 14.2858C39.286 7.38221 33.6896 1.78577 26.786 1.78577C19.8824 1.78577 14.286 7.38221 14.286 14.2858C14.286 14.8559 14.3242 15.4172 14.3981 15.9671C14.5197 16.8716 14.5805 17.3238 14.5396 17.6099C14.497 17.908 14.4427 18.0686 14.2958 18.3314C14.1548 18.5837 13.9062 18.8322 13.4092 19.3292L2.76232 29.9761C2.40201 30.3364 2.22185 30.5166 2.09301 30.7268C1.97878 30.9132 1.89461 31.1165 1.84357 31.329C1.78601 31.5688 1.78601 31.8236 1.78601 32.3331V35.9524C1.78601 37.1192 1.78601 37.7026 2.01308 38.1482C2.21282 38.5402 2.53153 38.859 2.92353 39.0587C3.36918 39.2858 3.95257 39.2858 5.11934 39.2858H10.1193V35.1191H14.286V30.9524H18.4527L21.7425 27.6626C22.2396 27.1655 22.4881 26.917 22.7404 26.776C23.0032 26.6291 23.1638 26.5748 23.4619 26.5322C23.748 26.4913 24.2002 26.5521 25.1047 26.6737C25.6546 26.7476 26.2158 26.7858 26.786 26.7858Z"
            stroke="#F6F8F9"
            strokeWidth="3.57143"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </GlassButton>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  circleBg: {
    position: "absolute",
    backgroundColor: "#331057",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  circleEffect: {
    position: "absolute",
    resizeMode: "contain",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  iconInner: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
    backgroundColor: "transparent",
  },
});
