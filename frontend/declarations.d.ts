/**
 * Since we are converting SVG files to React components using SVGR and esbuild,
 * it is safe to assume that all SVG files will be React components.
 */
declare module "*.svg" {
  import React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
