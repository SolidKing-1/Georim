declare module "*.png" {
  const value: any;
  export default value;
}

declare module "*.jpg" {
  const value: any;
  export default value;
}

// global.d.ts or declaration.d.ts
declare module "react-native-vector-icons/*" {
  const content: any;
  export default content;
}
declare module "react-native-community/*" {
  const content: any;
  export default content;
}

declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

// declare module "expo-image" {
//   const ExpoImage: any;
//   export default ExpoImage;
// }