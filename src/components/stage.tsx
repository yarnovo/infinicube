import { Canvas, type CanvasProps } from '@react-three/fiber';

export interface StageProps extends CanvasProps {
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
}

export const Stage: React.FC<StageProps> = ({
  width = '100%',
  height = '600px',
  backgroundColor = '#f0f0f0',
  children,
  ...canvasProps
}) => {
  return (
    <div style={{ width, height, backgroundColor }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
        gl={{ antialias: true }}
        {...canvasProps}
      >
        {children}
      </Canvas>
    </div>
  );
};

export default Stage;
