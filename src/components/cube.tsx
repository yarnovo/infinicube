import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import type { Mesh } from 'three';
import type { Cube as CubeData } from './infinicube';
import { getTheme } from '../types/theme';

export interface CubeProps {
  cube: CubeData;
  isSelected?: boolean;
  onClick?: (cube: CubeData) => void;
}

export const Cube = ({ cube, isSelected = false, onClick }: CubeProps) => {
  const meshRef = useRef<Mesh>(null);
  const originalPosition = useRef(cube.position);

  // 解析主题配置
  const resolvedTheme = useMemo(() => {
    if (!cube.theme) {
      return getTheme('default'); // 使用默认主题
    }

    // 如果是字符串，从预设主题查找，找不到使用默认主题
    if (typeof cube.theme === 'string') {
      return getTheme(cube.theme);
    }

    // 如果是对象，直接使用
    return cube.theme;
  }, [cube.theme]);

  // 几何体配置
  const geometryConfig = useMemo(() => {
    const baseSize = cube.size || 1;
    const themeSize = resolvedTheme.geometry?.size;

    return {
      args: themeSize
        ? [themeSize[0] * baseSize, themeSize[1] * baseSize, themeSize[2] * baseSize]
        : [baseSize, baseSize, baseSize],
      segments: resolvedTheme.geometry?.segments || [1, 1, 1],
    };
  }, [cube.size, resolvedTheme.geometry]);

  // 材质配置
  const materialConfig = useMemo(() => {
    const baseMaterial = {
      color: cube.color || '#3b82f6', // 确保始终有颜色
      ...resolvedTheme.material,
    };

    // 处理选中状态
    if (isSelected && resolvedTheme.selection) {
      const selection = resolvedTheme.selection;
      return {
        ...baseMaterial,
        emissive: selection.emissiveColor || cube.color || '#3b82f6',
        emissiveIntensity: selection.emissiveIntensity || 0.3,
      };
    }

    return baseMaterial;
  }, [cube.color, resolvedTheme.material, resolvedTheme.selection, isSelected]);

  // 动画循环
  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const time = clock.getElapsedTime();

    // 旋转动画
    if (resolvedTheme.animation?.rotation?.enabled) {
      const rotSpeed = resolvedTheme.animation.rotation.speed || [0, 0, 0];
      mesh.rotation.x += rotSpeed[0];
      mesh.rotation.y += rotSpeed[1];
      mesh.rotation.z += rotSpeed[2];
    }

    // 缩放动画
    if (resolvedTheme.animation?.scale?.enabled) {
      const scaleConfig = resolvedTheme.animation.scale;
      const min = scaleConfig.min || 0.8;
      const max = scaleConfig.max || 1.2;
      const speed = scaleConfig.speed || 1;
      const scale = min + (max - min) * (Math.sin(time * speed) * 0.5 + 0.5);
      mesh.scale.setScalar(scale);
    }

    // 浮动动画
    if (resolvedTheme.animation?.float?.enabled) {
      const floatConfig = resolvedTheme.animation.float;
      const amplitude = floatConfig.amplitude || 0.1;
      const speed = floatConfig.speed || 1;
      const offset = Math.sin(time * speed) * amplitude;
      mesh.position.y = originalPosition.current[1] + offset;
    }

    // 选中状态的缩放效果
    if (isSelected && resolvedTheme.selection?.scale) {
      const currentScale = mesh.scale.x;
      const targetScale = resolvedTheme.selection.scale;
      mesh.scale.setScalar(currentScale + (targetScale - currentScale) * 0.1);
    }
  });

  // 属性过滤和验证函数
  const filterMaterialProps = (props: Record<string, unknown>) => {
    const validProps: Record<string, unknown> = {};

    Object.entries(props).forEach(([key, value]) => {
      // 只包含非 undefined 和非 null 的值
      if (value !== undefined && value !== null) {
        // 特殊处理颜色属性
        if (key === 'color' || key === 'emissive') {
          if (typeof value === 'string' && value.length > 0 && value.startsWith('#')) {
            validProps[key] = value;
          }
        } else if (
          key === 'metalness' ||
          key === 'roughness' ||
          key === 'opacity' ||
          key === 'emissiveIntensity'
        ) {
          // 数值属性验证
          if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
            validProps[key] = Math.max(0, Math.min(1, value)); // 限制在 0-1 范围
          }
        } else if (key === 'transparent') {
          // 布尔属性
          if (typeof value === 'boolean') {
            validProps[key] = value;
          }
        } else if (key === 'type') {
          // 材质类型验证
          const validTypes = ['standard', 'basic', 'physical', 'phong', 'lambert'];
          if (typeof value === 'string' && validTypes.includes(value)) {
            validProps[key] = value;
          }
        } else {
          // 其他属性直接通过
          validProps[key] = value;
        }
      }
    });

    return validProps;
  };

  // 渲染材质组件
  const renderMaterial = () => {
    const materialType = resolvedTheme.material?.type || 'standard';

    try {
      // 过滤和验证属性
      const filteredProps = filterMaterialProps(materialConfig);

      // 确保基本属性存在并有效
      const safeProps = {
        color: '#3b82f6', // 安全的默认颜色
        ...filteredProps,
      } as Record<string, unknown>;

      // 处理透明度
      if (typeof safeProps.opacity === 'number' && safeProps.opacity < 1) {
        safeProps.transparent = true;
      }

      switch (materialType) {
        case 'basic':
          return <meshBasicMaterial {...safeProps} />;
        case 'physical':
          return <meshPhysicalMaterial {...safeProps} />;
        case 'phong':
          return <meshPhongMaterial {...safeProps} />;
        case 'lambert':
          return <meshLambertMaterial {...safeProps} />;
        default:
          return <meshStandardMaterial {...safeProps} />;
      }
    } catch (error) {
      console.error('Material rendering error:', error);
      // 回退到最简单的材质
      return <meshStandardMaterial color="#3b82f6" />;
    }
  };

  return (
    <group>
      <Box
        ref={meshRef}
        args={geometryConfig.args as [number, number, number]}
        position={cube.position}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(cube);
        }}
      >
        {renderMaterial()}
      </Box>

      {/* 轮廓效果 */}
      {resolvedTheme.outline?.enabled && (
        <Box
          args={geometryConfig.args.map((size) => size * 1.02) as [number, number, number]}
          position={cube.position}
        >
          <meshBasicMaterial
            color={resolvedTheme.outline.color || '#ffffff'}
            wireframe
            transparent
            opacity={0.5}
          />
        </Box>
      )}
    </group>
  );
};

export default Cube;
