import React from 'react';
import { OrbitControls, Grid, Environment, Stats } from '@react-three/drei';

export interface WorldProps {
  showGrid?: boolean;
  showStats?: boolean;
  children?: React.ReactNode;
}

export const World: React.FC<WorldProps> = ({ showGrid = true, showStats = false, children }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {showGrid && (
        <Grid
          args={[10, 10]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6e6e6e"
          sectionSize={5}
          sectionThickness={1.5}
          sectionColor="#9d9d9d"
          fadeDistance={25}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
      )}

      <Environment preset="city" />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.1}
      />

      {children}

      {showStats && <Stats />}
    </>
  );
};

export default World;
