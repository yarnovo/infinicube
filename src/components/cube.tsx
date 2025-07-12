import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import type { Mesh } from 'three';
import type { Cube as CubeData } from './infinicube';

export interface CubeProps {
  cube: CubeData;
  isSelected?: boolean;
  onClick?: (cube: CubeData) => void;
}

export const Cube = ({ cube, isSelected = false, onClick }: CubeProps) => {
  const meshRef = useRef<Mesh>(null);

  // 选中状态的动画效果
  useFrame(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const targetScale = isSelected ? 1.1 : 1.0;
    const currentScale = mesh.scale.x;
    mesh.scale.setScalar(currentScale + (targetScale - currentScale) * 0.1);
  });

  const size = cube.size || 1;

  return (
    <Box
      ref={meshRef}
      args={[size, size, size]}
      position={cube.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(cube);
      }}
    >
      <meshStandardMaterial
        color={cube.color || '#3b82f6'}
        emissive={isSelected ? cube.color || '#3b82f6' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </Box>
  );
};

export default Cube;
