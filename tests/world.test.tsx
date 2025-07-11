import { describe, it, expect } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { World } from '../src/components/world';

describe('World Component Structure Tests', () => {
  it('should render basic lights directly', async () => {
    // 先测试直接渲染灯光
    const renderer = await ReactThreeTestRenderer.create(
      <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
      </>
    );

    const lights = renderer.scene.findAll(
      (instance) => instance.type === 'AmbientLight' || instance.type === 'DirectionalLight'
    );
    expect(lights).toHaveLength(2);
  });

  it('should render basic 3D scene structure', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <World showGrid={true} showStats={false} />
    );

    // 检查灯光
    const lights = renderer.scene.findAll(
      (child) => child.type === 'AmbientLight' || child.type === 'DirectionalLight'
    );
    expect(lights).toHaveLength(2);

    // 检查 Grid (Grid 会创建一个 Mesh)
    const meshes = renderer.scene.findAllByType('Mesh');
    expect(meshes.length).toBeGreaterThan(0);
  });

  it('should include ambient and directional lights', async () => {
    const renderer = await ReactThreeTestRenderer.create(<World />);

    const ambientLight = renderer.scene.findByType('AmbientLight');
    expect(ambientLight).toBeDefined();
    expect(ambientLight.type).toBe('AmbientLight');
    expect(ambientLight.props.intensity).toBe(0.5);

    const directionalLight = renderer.scene.findByType('DirectionalLight');
    expect(directionalLight).toBeDefined();
    expect(directionalLight.type).toBe('DirectionalLight');
    expect(directionalLight.props.intensity).toBe(1);
    expect(directionalLight.props.position).toEqual([10, 10, 5]);
  });

  it('should conditionally render grid', async () => {
    // 有网格
    const rendererWithGrid = await ReactThreeTestRenderer.create(<World showGrid={true} />);
    let meshes = rendererWithGrid.scene.findAllByType('Mesh');
    expect(meshes.length).toBeGreaterThan(0); // Grid creates a mesh

    // 无网格
    const rendererWithoutGrid = await ReactThreeTestRenderer.create(<World showGrid={false} />);
    meshes = rendererWithoutGrid.scene.findAllByType('Mesh');
    expect(meshes).toHaveLength(0); // No mesh when grid is disabled
  });

  it('should render children correctly', async () => {
    const TestChild = () => (
      <mesh position={[1, 2, 3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>
    );

    const renderer = await ReactThreeTestRenderer.create(
      <World>
        <TestChild />
      </World>
    );

    // 查找子组件的 mesh
    const meshes = renderer.scene.findAllByType('Mesh');
    // 排除 Grid 的 mesh，找到我们添加的 mesh
    const childMesh = meshes.find((mesh) => mesh.instance.position.x === 1);
    expect(childMesh).toBeDefined();
    if (childMesh) {
      expect(childMesh.type).toBe('Mesh');
      expect(childMesh.instance.position.toArray()).toEqual([1, 2, 3]);
    }
  });

  it('should handle showStats prop', async () => {
    const renderer = await ReactThreeTestRenderer.create(<World showStats={true} />);

    // Stats 是 HTML 元素，不会出现在 Three.js scene graph 中
    // 但我们可以验证其他元素仍然正常渲染
    const lights = renderer.scene.findAll(
      (instance) => instance.type === 'AmbientLight' || instance.type === 'DirectionalLight'
    );
    expect(lights).toHaveLength(2);
  });
});
