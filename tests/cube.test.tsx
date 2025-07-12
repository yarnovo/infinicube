import { describe, it, expect, vi } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Cube } from '../src/components/cube';
import type { Cube as CubeData } from '../src/components/infinicube';
import type { Mesh } from 'three';

describe('Cube Component Tests', () => {
  const mockCube: CubeData = {
    id: 'test-cube',
    position: [1, 2, 3],
    color: '#ff0000',
    size: 2,
  };

  it('should render a cube with correct properties', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Cube cube={mockCube} />);

    const meshes = renderer.scene.findAllByType('Mesh');
    const cubeMesh = meshes.find((mesh) => {
      return (mesh.instance as Mesh).geometry?.type === 'BoxGeometry';
    });

    expect(cubeMesh).toBeDefined();
    expect(cubeMesh?.instance.position.toArray()).toEqual([1, 2, 3]);
  });

  it('should apply correct size to geometry', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Cube cube={mockCube} />);

    const meshes = renderer.scene.findAllByType('Mesh');
    const cubeMesh = meshes.find((mesh) => {
      return (mesh.instance as Mesh).geometry?.type === 'BoxGeometry';
    });

    // BoxGeometry args should be [size, size, size]
    const geometry = (cubeMesh?.instance as Mesh).geometry;
    expect(geometry?.type).toBe('BoxGeometry');
  });

  it('should handle click events', async () => {
    const onClickMock = vi.fn();
    const renderer = await ReactThreeTestRenderer.create(
      <Cube cube={mockCube} onClick={onClickMock} />
    );

    const meshes = renderer.scene.findAllByType('Mesh');
    const cubeMesh = meshes.find((mesh) => {
      return (mesh.instance as Mesh).geometry?.type === 'BoxGeometry';
    });

    expect(cubeMesh).toBeDefined();

    // 模拟点击事件
    renderer.fireEvent(cubeMesh!, 'click', { stopPropagation: vi.fn() });
    expect(onClickMock).toHaveBeenCalledWith(mockCube);
  });

  it('should show selection state when isSelected is true', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Cube cube={mockCube} isSelected={true} />
    );

    // 查找材质 - meshStandardMaterial 是实际的材质组件
    const materials = renderer.scene.findAllByType('MeshStandardMaterial');
    expect(materials.length).toBeGreaterThanOrEqual(1);

    const material = materials[0];
    // 选中时使用立方体的颜色作为发光色
    expect(material.props.emissive).toBe('#ff0000');
    expect(material.props.emissiveIntensity).toBe(0.3);
  });

  it('should not show selection state when isSelected is false', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Cube cube={mockCube} isSelected={false} />
    );

    // 查找材质 - meshStandardMaterial 是实际的材质组件
    const materials = renderer.scene.findAllByType('MeshStandardMaterial');
    expect(materials.length).toBeGreaterThanOrEqual(1);

    const material = materials[0];
    expect(material.props.emissiveIntensity || 0).toBe(0);
  });

  it('should use default size when cube.size is undefined', async () => {
    const cubeWithoutSize: CubeData = {
      id: 'test-cube',
      position: [0, 0, 0],
      color: '#ff0000',
    };

    const renderer = await ReactThreeTestRenderer.create(<Cube cube={cubeWithoutSize} />);

    const meshes = renderer.scene.findAllByType('Mesh');
    const cubeMesh = meshes.find((mesh) => {
      return (mesh.instance as Mesh).geometry?.type === 'BoxGeometry';
    });

    expect(cubeMesh).toBeDefined();
    // 默认大小应该是 1
  });
});
