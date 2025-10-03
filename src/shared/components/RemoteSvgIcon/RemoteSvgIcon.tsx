import React from "react";
import { SvgXml } from "react-native-svg";

export const RemoteSvg = ({ xml, size }: { xml: string, size?: number }) => {
  const props: any = { xml };
  
  if (size !== undefined) {
    props.height = size;
    props.width = size;
  }
  
  return <SvgXml {...props} />;
};
