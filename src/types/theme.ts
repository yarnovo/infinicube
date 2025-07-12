export interface CubeTheme {
  // 基础几何属性
  geometry?: {
    size?: [number, number, number]; // 长宽高，支持非正方体
    segments?: [number, number, number]; // 分段数，影响几何体细分
    bevelEnabled?: boolean; // 是否启用倒角
    bevelSize?: number; // 倒角大小
  };

  // 材质属性
  material?: {
    type?: 'standard' | 'basic' | 'physical' | 'phong' | 'lambert'; // 材质类型
    color?: string; // 基础颜色
    metalness?: number; // 金属度 (0-1)
    roughness?: number; // 粗糙度 (0-1)
    opacity?: number; // 透明度 (0-1)
    transparent?: boolean; // 是否透明
    emissive?: string; // 发光颜色
    emissiveIntensity?: number; // 发光强度
    wireframe?: boolean; // 线框模式
    flatShading?: boolean; // 平面着色
  };

  // 纹理属性
  texture?: {
    map?: string; // 漫反射贴图 URL
    normalMap?: string; // 法线贴图 URL
    roughnessMap?: string; // 粗糙度贴图 URL
    metalnessMap?: string; // 金属度贴图 URL
    repeat?: [number, number]; // 纹理重复
  };

  // 动画属性
  animation?: {
    rotation?: {
      speed?: [number, number, number]; // 旋转速度
      enabled?: boolean;
    };
    scale?: {
      min?: number; // 缩放最小值
      max?: number; // 缩放最大值
      speed?: number; // 缩放速度
      enabled?: boolean;
    };
    float?: {
      amplitude?: number; // 浮动幅度
      speed?: number; // 浮动速度
      enabled?: boolean;
    };
  };

  // 边框/轮廓
  outline?: {
    enabled?: boolean;
    color?: string;
    thickness?: number;
  };

  // 粒子效果
  particles?: {
    enabled?: boolean;
    count?: number;
    color?: string;
    size?: number;
    speed?: number;
  };

  // 选中状态样式
  selection?: {
    emissiveColor?: string;
    emissiveIntensity?: number;
    scale?: number; // 选中时的缩放
    outlineColor?: string;
    outlineThickness?: number;
  };
}

// 预设主题
export const PRESET_THEMES: Record<string, CubeTheme> = {
  // 默认主题
  default: {
    material: {
      type: 'standard',
      metalness: 0.1,
      roughness: 0.5,
      emissive: '#000000',
      emissiveIntensity: 0,
    },
    selection: {
      emissiveIntensity: 0.3,
      emissiveColor: '#ffffff',
    },
  },

  // 金属主题
  metal: {
    material: {
      type: 'physical',
      metalness: 0.9,
      roughness: 0.1,
      color: '#c0c0c0',
    },
    selection: {
      emissiveColor: '#ffd700',
      emissiveIntensity: 0.5,
      scale: 1.1,
    },
  },

  // 玻璃主题
  glass: {
    material: {
      type: 'physical',
      metalness: 0,
      roughness: 0,
      opacity: 0.3,
      transparent: true,
      color: '#87ceeb',
    },
    selection: {
      emissiveColor: '#00ffff',
      emissiveIntensity: 0.6,
    },
  },

  // 霓虹主题
  neon: {
    material: {
      type: 'basic',
      color: '#ff00ff',
      emissive: '#ff00ff',
      emissiveIntensity: 0.5,
    },
    outline: {
      enabled: true,
      color: '#ff00ff',
      thickness: 2,
    },
    animation: {
      rotation: {
        speed: [0, 0.01, 0],
        enabled: true,
      },
    },
    selection: {
      emissiveIntensity: 1.0,
      scale: 1.2,
    },
  },

  // 木质主题
  wood: {
    material: {
      type: 'standard',
      color: '#8b4513',
      metalness: 0,
      roughness: 0.8,
    },
    selection: {
      emissiveColor: '#ffa500',
      emissiveIntensity: 0.4,
    },
  },

  // 水晶主题
  crystal: {
    geometry: {
      segments: [8, 8, 8],
    },
    material: {
      type: 'physical',
      color: '#e6e6fa',
      metalness: 0,
      roughness: 0,
      opacity: 0.8,
      transparent: true,
    },
    animation: {
      rotation: {
        speed: [0.005, 0.01, 0.005],
        enabled: true,
      },
      float: {
        amplitude: 0.2,
        speed: 2,
        enabled: true,
      },
    },
    selection: {
      emissiveColor: '#9400d3',
      emissiveIntensity: 0.7,
    },
  },

  // 火焰主题
  fire: {
    material: {
      type: 'standard',
      color: '#ff4500',
      emissive: '#ff6600',
      emissiveIntensity: 0.3,
    },
    animation: {
      scale: {
        min: 0.9,
        max: 1.1,
        speed: 3,
        enabled: true,
      },
      float: {
        amplitude: 0.1,
        speed: 4,
        enabled: true,
      },
    },
    selection: {
      emissiveColor: '#ffff00',
      emissiveIntensity: 0.8,
    },
  },

  // 冰霜主题
  ice: {
    material: {
      type: 'physical',
      color: '#b0e0e6',
      metalness: 0,
      roughness: 0.1,
      opacity: 0.7,
      transparent: true,
    },
    outline: {
      enabled: true,
      color: '#87cefa',
      thickness: 1,
    },
    selection: {
      emissiveColor: '#00bfff',
      emissiveIntensity: 0.5,
    },
  },
};

// 主题工具函数

export const getTheme = (themeName: string): CubeTheme => {
  return PRESET_THEMES[themeName] || PRESET_THEMES.default;
};
