import { describe, it, expect, vi } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { useRef, useEffect } from 'react';
import { Infinicube, type InfinicubeRef, type Cube } from '../src/components/infinicube';
import type { Mesh } from 'three';

describe('Infinicube Component Tests', () => {
  it('should render empty initially', async () => {
    const renderer = await ReactThreeTestRenderer.create(<Infinicube />);

    // 初始时不应该有立方体
    const meshes = renderer.scene.findAllByType('Mesh');
    const cubeMeshes = meshes.filter((mesh) => {
      return (mesh.instance as Mesh).geometry?.type === 'BoxGeometry';
    });
    expect(cubeMeshes).toHaveLength(0);
  });

  it('should render initial cubes', async () => {
    const initialCubes: Cube[] = [
      { id: 'cube-1', position: [0, 0, 0], color: '#ff0000', size: 1 },
      { id: 'cube-2', position: [2, 0, 0], color: '#00ff00', size: 1.5 },
    ];

    const renderer = await ReactThreeTestRenderer.create(
      <Infinicube initialCubes={initialCubes} />
    );

    // Box 组件直接创建 Mesh，我们通过 geometry 类型来识别
    const meshes = renderer.scene.findAllByType('Mesh');
    // 找到使用 BoxGeometry 的 Mesh
    const cubeMeshes = meshes.filter((mesh) => {
      return (mesh.instance as Mesh).geometry?.type === 'BoxGeometry';
    });
    expect(cubeMeshes).toHaveLength(2);
  });

  it('should handle cube click events', async () => {
    const onCubeSelect = vi.fn();
    const initialCubes: Cube[] = [{ id: 'cube-1', position: [0, 0, 0], color: '#ff0000', size: 1 }];

    const renderer = await ReactThreeTestRenderer.create(
      <Infinicube initialCubes={initialCubes} onCubeSelect={onCubeSelect} />
    );

    // 找到立方体的 mesh
    const meshes = renderer.scene.findAllByType('Mesh');
    const cubeMesh = meshes.find((mesh) => {
      return (mesh.instance as Mesh).geometry?.type === 'BoxGeometry';
    });

    expect(cubeMesh).toBeDefined();
    if (cubeMesh) {
      await renderer.fireEvent(cubeMesh, 'click', {
        stopPropagation: vi.fn(),
      });
      expect(onCubeSelect).toHaveBeenCalledWith(initialCubes[0]);
    }
  });

  it('should work with ref API', async () => {
    // 创建一个测试组件来使用 ref
    const TestComponent = () => {
      const ref = useRef<InfinicubeRef>(null);

      useEffect(() => {
        if (ref.current) {
          // 创建立方体
          ref.current.createCube([0, 0, 0], { color: '#ff0000' });
          ref.current.createCube([2, 0, 0], { color: '#00ff00' });
        }
      }, []);

      return <Infinicube ref={ref} />;
    };

    const renderer = await ReactThreeTestRenderer.create(<TestComponent />);

    // 等待 useEffect 执行
    await ReactThreeTestRenderer.act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // 检查是否创建了两个立方体
    const meshes = renderer.scene.findAllByType('Mesh');
    const cubeMeshes = meshes.filter((mesh) => {
      return (mesh.instance as Mesh).geometry?.type === 'BoxGeometry';
    });
    expect(cubeMeshes).toHaveLength(2);
  });

  it('should handle cube lifecycle callbacks', async () => {
    const onCubeCreate = vi.fn();
    const onCubeDelete = vi.fn();

    const TestComponent = () => {
      const ref = useRef<InfinicubeRef>(null);

      useEffect(() => {
        if (ref.current) {
          // 创建立方体
          const cubeId = ref.current.createCube([0, 0, 0]);

          // 删除立方体
          setTimeout(() => {
            if (ref.current) {
              ref.current.deleteCube(cubeId);
            }
          }, 50);
        }
      }, []);

      return <Infinicube ref={ref} onCubeCreate={onCubeCreate} onCubeDelete={onCubeDelete} />;
    };

    await ReactThreeTestRenderer.create(<TestComponent />);

    // 等待操作完成
    await ReactThreeTestRenderer.act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // 验证回调被调用
    expect(onCubeCreate).toHaveBeenCalledTimes(1);
    expect(onCubeDelete).toHaveBeenCalledTimes(1);
  });
});
