# @react-three/test-renderer 使用指南

## 概述

@react-three/test-renderer 是专门为 React Three Fiber (R3F) 组件设计的测试渲染器。它允许在没有实际 WebGL 上下文和浏览器环境的情况下测试 3D 组件。

## 核心概念

### 1. 测试的是什么

@react-three/test-renderer **不是**测试：

- 实际的 WebGL 渲染输出
- 视觉效果或像素级的渲染结果
- GPU 相关的操作

它**实际测试**的是：

- React Three Fiber 组件的结构和层次
- Three.js 对象的创建和属性设置
- 事件处理和交互逻辑
- 组件的生命周期和更新
- Scene Graph（场景图）的结构

### 2. Scene Graph vs React Tree

- **React Tree**: 包含所有 React 组件，包括函数组件和类组件
- **Scene Graph**: 只包含实际的 Three.js 对象（如 Mesh, Light, Camera 等）

## API 详解

### ReactThreeTestRenderer

主要方法：

#### 1. create()

```typescript
const renderer = await ReactThreeTestRenderer.create(
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="red" />
  </mesh>
);
```

创建测试渲染器实例，可选配置画布尺寸。

#### 2. scene

```typescript
const scene = renderer.scene; // 返回根测试实例
```

获取场景的根测试实例，用于查询和断言。

#### 3. toTree()

```typescript
const tree = renderer.toTree();
// 返回完整的 React 组件树，包括所有组件
```

#### 4. toGraph()

```typescript
const graph = renderer.toGraph();
// 返回 Three.js 场景图，不包括使用 attach 的元素
```

#### 5. fireEvent()

```typescript
await renderer.fireEvent(meshInstance, 'click', mockEvent);
// 触发事件，事件名使用 camelCase（如 pointerUp）
```

#### 6. advanceFrames()

```typescript
await renderer.advanceFrames(frames, delta);
// 推进渲染帧，用于测试动画和 useFrame hooks
```

#### 7. update()

```typescript
await renderer.update(<NewComponent />);
// 更新组件树
```

#### 8. unmount()

```typescript
renderer.unmount();
// 卸载组件树
```

### ReactThreeTestInstance

测试实例的属性和方法：

#### 属性

- `instance`: Three.js 实例对象
- `type`: Three.js 类型（如 "Mesh", "AmbientLight"）
- `props`: 传递给元素的所有属性
- `parent`: 父测试实例
- `children`: 直接子测试实例
- `allChildren`: 所有子测试实例

#### 查找方法

```typescript
// 通过类型查找
const mesh = scene.findByType('Mesh');
const allMeshes = scene.findAllByType('Mesh');

// 通过属性查找
const redBox = scene.findByProps({ color: 'red' });
const allRedObjects = scene.findAllByProps({ color: /red/i });

// 自定义查找
const customFind = scene.find((instance) => instance.props.name === 'player');
```

## 实际使用示例

### 1. 测试组件渲染

```typescript
import { describe, it, expect } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';

describe('3D Component Tests', () => {
  it('should render a colored box', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    );

    const mesh = renderer.scene.findByType('Mesh');
    expect(mesh).toBeDefined();
    expect(mesh.instance.position.toArray()).toEqual([0, 1, 0]);

    const material = mesh.findByType('MeshStandardMaterial');
    expect(material.instance.color.getHexString()).toBe('ff0000');
  });
});
```

### 2. 测试事件处理

```typescript
it('should handle click events', async () => {
  const handleClick = vi.fn();

  const renderer = await ReactThreeTestRenderer.create(
    <mesh onClick={handleClick}>
      <boxGeometry />
      <meshBasicMaterial />
    </mesh>
  );

  const mesh = renderer.scene.findByType('Mesh');
  await renderer.fireEvent(mesh, 'click', {
    stopPropagation: vi.fn()
  });

  expect(handleClick).toHaveBeenCalled();
});
```

### 3. 测试动画和 useFrame

```typescript
it('should animate rotation', async () => {
  const AnimatedBox = () => {
    const meshRef = useRef();

    useFrame((state, delta) => {
      if (meshRef.current) {
        meshRef.current.rotation.x += delta;
      }
    });

    return (
      <mesh ref={meshRef}>
        <boxGeometry />
        <meshBasicMaterial />
      </mesh>
    );
  };

  const renderer = await ReactThreeTestRenderer.create(<AnimatedBox />);
  const mesh = renderer.scene.findByType('Mesh');

  const initialRotation = mesh.instance.rotation.x;

  await ReactThreeTestRenderer.act(async () => {
    await renderer.advanceFrames(5, 0.016); // 5帧，每帧16ms
  });

  expect(mesh.instance.rotation.x).toBeGreaterThan(initialRotation);
});
```

### 4. 测试复杂组件结构

```typescript
it('should render complex scene', async () => {
  const renderer = await ReactThreeTestRenderer.create(
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <mesh name="box1">
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
      <mesh name="box2">
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </group>
  );

  // 使用 toGraph 获取场景结构
  const graph = renderer.toGraph();
  console.log('Scene structure:', graph);

  // 查找特定对象
  const lights = renderer.scene.findAll(
    instance => instance.type === 'AmbientLight' ||
                instance.type === 'DirectionalLight'
  );
  expect(lights).toHaveLength(2);

  // 通过名称查找
  const box1 = renderer.scene.findByProps({ name: 'box1' });
  expect(box1).toBeDefined();
});
```

## 最佳实践

### 1. 理解测试范围

- 用于测试组件逻辑和结构，不是视觉测试
- 专注于属性、事件和状态管理
- 使用 `instance` 属性访问 Three.js 对象

### 2. 处理异步操作

```typescript
// 使用 act 包装异步操作
await ReactThreeTestRenderer.act(async () => {
  await renderer.advanceFrames(1, 0.016);
});
```

### 3. 查找元素的策略

- 优先使用 `findByType` 查找 Three.js 对象
- 使用 `findByProps` 查找具有特定属性的对象
- 对于复杂查找，使用自定义的 `find` 函数

### 4. 测试 drei 组件

```typescript
// drei 组件可能不会出现在场景图中
// 需要测试它们的效果而不是组件本身
const renderer = await ReactThreeTestRenderer.create(
  <OrbitControls />
);

// OrbitControls 通过 attach 添加到相机
// 不会出现在 scene.children 中
```

## 限制和注意事项

1. **不能测试 Canvas 组件**
   - @react-three/test-renderer 不能渲染 Canvas
   - 需要将 Canvas 从被测试的组件中分离

2. **某些 drei 组件的限制**
   - 使用 `attach` 的组件可能不在场景图中
   - 需要测试其副作用而不是组件本身

3. **异步行为**
   - 某些操作是异步的，需要适当的等待
   - 使用 `act` 包装可能导致状态变化的操作

4. **类型问题**
   - `instance` 的类型是 Three.js 对象，不是 React 组件
   - 需要了解 Three.js API 来正确断言

## 与其他测试方法的比较

| 测试方法                   | 适用场景           | 优点               | 缺点             |
| -------------------------- | ------------------ | ------------------ | ---------------- |
| @react-three/test-renderer | 单元测试、组件逻辑 | 快速、无需浏览器   | 不能测试实际渲染 |
| Playwright/Cypress         | E2E测试、视觉测试  | 真实环境、视觉验证 | 慢、需要浏览器   |
| Jest + Mock                | 纯逻辑测试         | 简单、快速         | 需要大量 mock    |

## 结论

@react-three/test-renderer 是测试 React Three Fiber 组件的强大工具，但需要理解它的设计目标和限制。它最适合用于：

1. 验证 3D 组件的结构和属性
2. 测试事件处理和交互逻辑
3. 验证动画和状态更新
4. 确保组件正确创建 Three.js 对象

对于视觉测试和像素级验证，应该使用 E2E 测试工具或视觉回归测试工具。
