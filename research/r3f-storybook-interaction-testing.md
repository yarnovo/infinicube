# React Three Fiber Storybook 交互测试研究报告

## 概述

本研究报告探讨如何在 Storybook 中对 React Three Fiber (R3F) 组件进行交互测试，特别是使用 play 函数进行自动化测试。

## 技术栈

- React Three Fiber (@react-three/fiber)
- @react-three/test-renderer
- Storybook 8.x
- @storybook/test (新的统一测试包)
- Vitest (作为测试运行器)

## 关键发现

### 1. Storybook Play 函数基础

Play 函数是 Storybook 中用于自动化交互测试的功能：

```javascript
export const InteractiveStory: Story = {
  play: async ({ args, canvas, userEvent }) => {
    // 在故事渲染后执行的测试代码
    await userEvent.click(canvas.getByRole('button'));
    await expect(args.onClick).toHaveBeenCalled();
  }
};
```

### 2. R3F 组件的测试挑战

R3F 组件与传统 DOM 组件不同：

- 渲染在 WebGL canvas 上，而非 DOM
- 交互基于 Three.js 的射线投射 (raycasting)
- 需要模拟 3D 空间中的鼠标事件

### 3. @react-three/test-renderer 解决方案

```javascript
import { renderHook } from '@testing-library/react';
import { render } from '@react-three/test-renderer';

// 渲染 R3F 组件进行测试
const renderer = await render(
  <mesh onClick={handleClick}>
    <boxGeometry />
    <meshBasicMaterial />
  </mesh>
);

// 模拟点击
await renderer.fireEvent(renderer.scene.children[0], 'click');
```

### 4. Storybook 中的 R3F 测试策略

#### 方案 A: 使用 useImperativeHandle 暴露方法

```javascript
// Infinicube 组件
export const Infinicube = forwardRef((props, ref) => {
  const [cubes, setCubes] = useState([]);

  useImperativeHandle(ref, () => ({
    createCube: (position) => {
      setCubes(prev => [...prev, { id: Date.now(), position }]);
    },
    getCubes: () => cubes,
    clearCubes: () => setCubes([])
  }));

  return (
    <World {...props}>
      {cubes.map(cube => (
        <Box key={cube.id} position={cube.position}>
          <meshStandardMaterial />
        </Box>
      ))}
    </World>
  );
});

// Storybook Story
export const InteractiveCubeCreation: Story = {
  render: (args) => {
    const ref = useRef();
    return <Infinicube ref={ref} {...args} />;
  },
  play: async ({ canvasElement }) => {
    // 获取组件引用并测试
    const infinicubeRef = /* 获取ref的方法 */;

    // 创建立方体
    infinicubeRef.current.createCube([0, 0, 0]);
    infinicubeRef.current.createCube([2, 0, 0]);

    // 验证
    const cubes = infinicubeRef.current.getCubes();
    expect(cubes).toHaveLength(2);
  }
};
```

#### 方案 B: 使用全局事件系统

```javascript
// 使用事件触发创建
export const EventDrivenStory: Story = {
  play: async ({ canvasElement }) => {
    // 触发自定义事件
    const event = new CustomEvent('infinicube:create', {
      detail: { position: [0, 0, 0] }
    });
    window.dispatchEvent(event);

    // 等待渲染
    await new Promise(resolve => setTimeout(resolve, 100));

    // 验证结果
    // ...
  }
};
```

### 5. 2024 最佳实践

1. **使用 @storybook/test 统一包**
   - 整合了 jest 和 testing-library 功能
   - 基于 Vitest，性能更好

2. **显式 Action Args**

   ```javascript
   const meta = {
     component: Infinicube,
     args: {
       onCubeCreate: fn(), // 使用 fn() 创建 spy
       onCubeSelect: fn(),
     },
   };
   ```

3. **Mount 函数用于异步设置**
   ```javascript
   play: async ({ mount, args }) => {
     // 在渲染前进行设置
     const canvas = await mount();
     // 继续测试...
   };
   ```

## 推荐的测试架构

### 1. 组件设计

- 使用 ref 暴露命令式 API
- 提供事件回调用于测试验证
- 保持状态可观察

### 2. 测试策略

- DOM 层面：测试容器渲染和基本属性
- API 层面：通过 ref 测试功能
- 事件层面：验证回调触发

### 3. 示例实现

```javascript
// Infinicube 组件
interface InfinicubeRef {
  createCube: (position: [number, number, number]) => void;
  selectCube: (id: string) => void;
  getCubes: () => Cube[];
}

export const Infinicube = forwardRef<InfinicubeRef, InfinicubeProps>((props, ref) => {
  // 实现...
});

// Storybook Story
export const PlaygroundStory: Story = {
  render: function Render(args) {
    const ref = useRef<InfinicubeRef>(null);

    // 将 ref 存储到全局以供 play 函数访问
    useEffect(() => {
      (window as any).__infinicubeRef = ref.current;
    }, [ref.current]);

    return <Infinicube ref={ref} {...args} />;
  },
  play: async ({ args, step }) => {
    await step('创建立方体', async () => {
      const ref = (window as any).__infinicubeRef;
      ref.createCube([0, 0, 0]);
      ref.createCube([2, 0, 0]);

      expect(ref.getCubes()).toHaveLength(2);
    });

    await step('验证事件触发', async () => {
      expect(args.onCubeCreate).toHaveBeenCalledTimes(2);
    });
  }
};
```

## 结论

虽然 R3F 组件的测试比传统 DOM 组件复杂，但通过合理的架构设计和测试策略，我们可以在 Storybook 中实现有效的交互测试。关键是：

1. 提供命令式 API 接口
2. 使用事件回调进行验证
3. 利用 Storybook 的 play 函数和 step 功能组织测试
4. 考虑 WebGL 渲染的异步特性

## 参考资源

- [Storybook Interaction Testing](https://storybook.js.org/docs/writing-tests/interaction-testing)
- [React Three Fiber Events](https://r3f.docs.pmnd.rs/api/events)
- [@react-three/test-renderer](https://github.com/pmndrs/react-three-fiber/tree/master/packages/test-renderer)
- [Storybook Test Package](https://storybook.js.org/docs/writing-tests)
