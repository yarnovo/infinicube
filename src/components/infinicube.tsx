import { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { World, type WorldProps } from './world';
import { Box } from '@react-three/drei';

export interface Cube {
  id: string;
  position: [number, number, number];
  color?: string;
  size?: number;
}

export interface InfinicubeRef {
  createCube: (
    position: [number, number, number],
    options?: { color?: string; size?: number }
  ) => string;
  selectCube: (id: string) => void;
  deleteCube: (id: string) => void;
  getCubes: () => Cube[];
  clearCubes: () => void;
}

export interface InfinicubeProps extends WorldProps {
  initialCubes?: Cube[];
  onCubeCreate?: (cube: Cube) => void;
  onCubeSelect?: (cube: Cube | null) => void;
  onCubeDelete?: (id: string) => void;
  onCubeUpdate?: (cube: Cube) => void;
}

export const Infinicube = forwardRef<InfinicubeRef, InfinicubeProps>(
  (
    { initialCubes = [], onCubeCreate, onCubeSelect, onCubeDelete, children, ...worldProps },
    ref
  ) => {
    const [cubes, setCubes] = useState<Cube[]>(initialCubes);
    const [selectedCubeId, setSelectedCubeId] = useState<string | null>(null);

    const createCube = useCallback(
      (position: [number, number, number], options?: { color?: string; size?: number }) => {
        const newCube: Cube = {
          id: `cube-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          position,
          color:
            options?.color ||
            `#${Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, '0')}`,
          size: options?.size || 1,
        };

        setCubes((prev) => [...prev, newCube]);
        onCubeCreate?.(newCube);
        return newCube.id;
      },
      [onCubeCreate]
    );

    const selectCube = useCallback(
      (id: string) => {
        setSelectedCubeId(id);
        const cube = cubes.find((c) => c.id === id);
        onCubeSelect?.(cube || null);
      },
      [cubes, onCubeSelect]
    );

    const deleteCube = useCallback(
      (id: string) => {
        setCubes((prev) => prev.filter((c) => c.id !== id));
        if (selectedCubeId === id) {
          setSelectedCubeId(null);
          onCubeSelect?.(null);
        }
        onCubeDelete?.(id);
      },
      [selectedCubeId, onCubeSelect, onCubeDelete]
    );

    const getCubes = useCallback(() => {
      return [...cubes];
    }, [cubes]);

    const clearCubes = useCallback(() => {
      setCubes([]);
      setSelectedCubeId(null);
      onCubeSelect?.(null);
    }, [onCubeSelect]);

    useImperativeHandle(
      ref,
      () => ({
        createCube,
        selectCube,
        deleteCube,
        getCubes,
        clearCubes,
      }),
      [createCube, selectCube, deleteCube, getCubes, clearCubes]
    );

    const handleCubeClick = useCallback(
      (cube: Cube) => {
        selectCube(cube.id);
      },
      [selectCube]
    );

    return (
      <World {...worldProps}>
        {cubes.map((cube) => (
          <Box
            key={cube.id}
            args={[cube.size || 1, cube.size || 1, cube.size || 1]}
            position={cube.position}
            onClick={(e) => {
              e.stopPropagation();
              handleCubeClick(cube);
            }}
          >
            <meshStandardMaterial
              color={cube.color}
              emissive={selectedCubeId === cube.id ? cube.color : undefined}
              emissiveIntensity={selectedCubeId === cube.id ? 0.3 : 0}
            />
          </Box>
        ))}
        {children}
      </World>
    );
  }
);

Infinicube.displayName = 'Infinicube';

export default Infinicube;
