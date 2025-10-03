import React from "react";
import { SvgXml } from "react-native-svg";

export const RemoteSvg = ({ xml, size }: { xml: string, size?: number }) => <SvgXml xml={xml} height={size} width={size} />;
