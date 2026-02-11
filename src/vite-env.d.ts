/// <reference types="vite/client" />

// GLB/GLTF 3D model files
declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.gltf' {
  const src: string;
  export default src;
}

// meshline module declarations
declare module 'meshline' {
  import { BufferGeometry, Material, Color, Texture } from 'three';

  export class MeshLineGeometry extends BufferGeometry {
    setPoints(points: THREE.Vector3[] | Float32Array): void;
  }

  export class MeshLineMaterial extends Material {
    constructor(parameters?: {
      color?: Color | string | number;
      opacity?: number;
      resolution?: [number, number];
      sizeAttenuation?: boolean;
      lineWidth?: number;
      map?: Texture;
      useMap?: boolean;
      alphaMap?: Texture;
      useAlphaMap?: boolean;
      repeat?: [number, number];
      dashArray?: number;
      dashOffset?: number;
      dashRatio?: number;
      visibility?: number;
      alphaTest?: number;
      depthTest?: boolean;
      depthWrite?: boolean;
      transparent?: boolean;
    });
  }
}

// JSX intrinsic elements for meshline
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      meshLineGeometry: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      meshLineMaterial: any;
    }
  }
}
