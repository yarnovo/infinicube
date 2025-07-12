# Infinicube 项目说明

## 项目概览

- **项目名称**: Infinicube
- **项目类型**: React 组件库
- **核心功能**: 3D 资源管理组件
- **主要组件**: `<Infinicube />` React 组件

## 技术栈

- **3D 渲染**: @react-three/fiber (React Three.js 封装)
- **前端框架**: React
- **类型系统**: TypeScript
- **构建工具**: Vite
- **UI 组件**: 基于 shadcn/ui 设计系统
- **样式方案**: Tailwind CSS
- **测试框架**: Vitest + @react-three/test-renderer
- **物理引擎**: @react-three/cannon (可选)
- **工具库**: @react-three/drei

## 核心功能

- **资源管理**: 3D 空间中 XYZ 坐标系资源管理
- **可视化展示**: 多种形状和样式的资源展示
- **交互操作**: 鼠标/触摸交互，支持选中、拖拽等操作
- **性能优化**: 基于视锥体剔除和 LOD 技术的性能优化

## 组件架构

### 核心组件

1. **Stage** - Canvas 容器组件，提供 3D 渲染环境
2. **World** - 3D 场景组件，包含灯光、控制器、网格等
3. **Infinicube** - 主组件，管理立方体的创建、选择、删除

### 组件 API

```jsx
// Stage 组件 - 提供 Canvas 容器
<Stage width="100%" height="600px" backgroundColor="#f0f0f0">
  {children}
</Stage>;

// Infinicube 组件 - 立方体管理
const ref = useRef < InfinicubeRef > null;

<Infinicube
  ref={ref}
  initialCubes={cubes}
  onCubeCreate={(cube) => {}}
  onCubeSelect={(cube) => {}}
  onCubeDelete={(id) => {}}
  showGrid={true}
  showStats={false}
/>;

// Ref API
ref.current.createCube(position, { color, size });
ref.current.selectCube(id);
ref.current.deleteCube(id);
ref.current.getCubes();
ref.current.clearCubes();
```

## 开发规范

- 文件命名使用 kebab-case
- 组件使用函数式组件
- 状态管理使用 React Hooks
- Storybook 用于组件文档和测试
- **React 自动导入**：TypeScript 已配置自动导入 React，不需要手动 import

## 项目定位

提供 AI 驱动的智能 3D 资源管理解决方案，让开发者能够轻松集成 3D 可视化功能。

## 测试策略

### 测试框架配置

- **单元测试**: Vitest 多项目配置（unit 和 storybook）
- **3D 组件测试**: @react-three/test-renderer
- **功能测试**: 组件 ref API 和状态管理测试
- **Storybook 测试**: Play 函数自动化测试

### @react-three/test-renderer 使用要点

1. **测试范围**：测试组件结构和属性，不是视觉效果
2. **场景查询**：使用 `findByType`、`findByProps` 查找 Three.js 对象
3. **事件测试**：使用 `fireEvent` 触发交互事件
4. **动画测试**：使用 `advanceFrames` 测试 useFrame hooks
5. **限制**：不能渲染 Canvas 组件，需要分离组件结构

### Mock 策略

- **WebGL 上下文**：在 setup.ts 中手动实现 WebGL context mock
- **ResizeObserver**：提供全局 mock 避免 Canvas 组件测试错误
- **drei 组件**：mock Environment 和 Stats 组件避免加载外部资源
- **React DOM**：使用 @testing-library/react 进行 DOM 测试

### 测试实现要点

1. **识别 drei Box 组件**

   ```typescript
   // Box 组件创建的 geometry 在 mesh.instance.geometry
   const cubeMeshes = meshes.filter((mesh) => {
     return mesh.instance.geometry?.type === 'BoxGeometry';
   });
   ```

2. **避免循环引用**
   - @react-three/test-renderer 的 toTree() 返回值有循环引用
   - 不要使用 JSON.stringify，直接使用对象属性

3. **组件测试分离**
   - Stage：仅测试 DOM 结构
   - World/Infinicube：使用 @react-three/test-renderer 测试 3D 结构

## 项目结构

```
src/
├── components/
│   ├── stage.tsx       # Canvas 容器
│   ├── world.tsx       # 3D 场景
│   └── infinicube.tsx  # 主组件
├── index.ts            # 导出入口
tests/
├── setup.ts            # 测试环境配置
├── *-functional.test.tsx  # 功能测试
└── *-props.test.tsx    # 属性测试
stories/
└── *.stories.tsx       # Storybook 故事
```

## 构建配置

- **TypeScript**: tsconfig.build.json 专门用于构建
- **Vite**: 使用 vite-plugin-dts 生成类型定义
- **导出**: ES 模块格式，支持 tree-shaking

## 常见问题与解决方案

### 随机颜色生成

生成随机十六进制颜色时，必须使用 `padStart(6, '0')` 确保始终为 6 位：

```typescript
`#${Math.floor(Math.random() * 16777215)
  .toString(16)
  .padStart(6, '0')}`;
```

否则可能生成无效的颜色值如 `#c79e1`。

## 测试策略原则

### Storybook 的正确使用

- **Storybook 仅用于 UI 展示**，不进行交互测试
- **不使用 play 函数**：因为无法测试实际的 3D 渲染输出，只能测试 API 调用
- **未来可配合视觉测试**：目前没有视觉测试，暂不需要

### 测试文件组织

- **一个组件对应一个测试文件**：不要创建多个测试文件测试同一个组件
- **使用 @react-three/test-renderer**：在 tests/ 文件夹中测试组件结构和交互逻辑
- **不需要额外的类型定义文件**：避免创建不必要的 global.d.ts

<!-- 最后更新: 2025-01-11 -->
<!-- 说明: Infinicube 项目技术规范、架构设计和测试策略 -->
<!-- 测试已通过：所有单元测试和 Storybook 测试均正常工作 -->
