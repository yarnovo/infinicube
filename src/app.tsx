import { Stage } from './components/stage';
import { World } from './components/world';
import { Box, Sphere } from '@react-three/drei';

function App() {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Stage width="100%" height="100%">
        <World showGrid={true} showStats={true}>
          <Box args={[1, 1, 1]} position={[-2, 0.5, 0]}>
            <meshStandardMaterial color="orange" />
          </Box>
          <Sphere args={[0.5, 32, 32]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="hotpink" />
          </Sphere>
          <Box args={[0.8, 0.8, 0.8]} position={[2, 0.4, 0]}>
            <meshStandardMaterial color="lightblue" />
          </Box>
        </World>
      </Stage>
    </div>
  );
}

export default App;
