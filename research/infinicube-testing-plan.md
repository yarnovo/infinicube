# Infinicube 组件测试方案

## 测试架构概览

基于 @react-three/fiber 生态系统，我们将使用以下测试策略：

- **测试框架**: Vitest
- **3D 组件测试**: @react-three/test-renderer
- **React 组件测试**: @testing-library/react
- **断言库**: @testing-library/jest-dom

## 测试分层策略

### 1. 单元测试

测试独立的工具函数和钩子：

- 坐标计算函数
- 资源数据处理
- 状态管理逻辑
- 自定义 hooks

### 2. 组件测试

使用 @react-three/test-renderer 测试 3D 组件：

- 场景结构验证
- 3D 对象属性验证
- 交互事件处理
- 动画和状态变化

### 3. 集成测试

测试完整的 Infinicube 组件：

- 组件初始化
- 资源的创建、更新、删除
- 用户交互流程
- 性能边界测试

## 测试用例设计

### 基础功能测试

```typescript
// 1. 组件渲染测试
describe('Infinicube 组件渲染', () => {
  it('应该正确渲染 Canvas 和场景', async () => {
    // 测试 Canvas 是否创建
    // 测试场景是否包含必要的元素（相机、灯光等）
  });

  it('应该根据 initialResources 渲染资源', async () => {
    // 测试初始资源是否正确显示
    // 验证资源的位置、形状、颜色等属性
  });
});
```

### 交互功能测试

```typescript
// 2. 资源交互测试
describe('资源交互', () => {
  it('点击资源应触发 onResourceSelect', async () => {
    // 模拟点击事件
    // 验证回调函数被调用
    // 验证选中状态变化
  });

  it('拖拽资源应更新位置', async () => {
    // 模拟拖拽操作
    // 验证资源位置更新
    // 验证 onResourceUpdate 回调
  });
});
```

### 资源管理测试

```typescript
// 3. CRUD 操作测试
describe('资源 CRUD 操作', () => {
  it('创建新资源', async () => {
    // 测试资源创建流程
    // 验证新资源出现在场景中
  });

  it('更新资源属性', async () => {
    // 测试资源属性更新
    // 验证视觉变化
  });

  it('删除资源', async () => {
    // 测试资源删除
    // 验证资源从场景中移除
  });
});
```

### 性能和边界测试

```typescript
// 4. 性能测试
describe('性能和边界情况', () => {
  it('处理大量资源（1000+）', async () => {
    // 测试大量资源渲染
    // 验证性能优化（LOD、视锥体剔除）
  });

  it('处理空资源列表', async () => {
    // 测试空状态处理
  });

  it('处理无效输入', async () => {
    // 测试错误处理
  });
});
```

## 测试文件结构

```
src/
├── components/
│   ├── Infinicube/
│   │   ├── Infinicube.tsx
│   │   ├── Infinicube.test.tsx
│   │   ├── components/
│   │   │   ├── Resource.tsx
│   │   │   ├── Resource.test.tsx
│   │   │   ├── Grid.tsx
│   │   │   └── Grid.test.tsx
│   │   └── hooks/
│   │       ├── useResourceManager.ts
│   │       └── useResourceManager.test.ts
│   └── ...
├── utils/
│   ├── coordinates.ts
│   ├── coordinates.test.ts
│   └── ...
└── tests/
    ├── setup.ts
    └── integration/
        └── infinicube.integration.test.tsx
```

## Mock 策略

### WebGL Context Mock

```typescript
// tests/mocks/webgl.ts
import { vi } from 'vitest';

export const mockWebGLRenderer = () => {
  return vi.fn(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement('canvas'),
    shadowMap: { enabled: false },
    setPixelRatio: vi.fn(),
  }));
};
```

### React Three Fiber Mock

```typescript
// tests/mocks/r3f.ts
import { vi } from 'vitest'

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({
    camera: {},
    scene: {},
    gl: {},
  }),
}))
```

## 测试执行计划

1. **第一阶段**：基础设施搭建
   - 配置 Vitest
   - 设置测试环境
   - 创建基础 mocks

2. **第二阶段**：单元测试
   - 工具函数测试
   - 自定义 hooks 测试

3. **第三阶段**：组件测试
   - 单个 3D 组件测试
   - 交互逻辑测试

4. **第四阶段**：集成测试
   - 完整流程测试
   - 性能测试

## 持续集成配置

在 GitHub Actions 中运行测试：

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test
      - run: npm run test:coverage
```

## 成功标准

- 核心功能测试覆盖率 > 80%
- 所有关键用户流程都有测试覆盖
- 测试运行时间 < 30秒
- 无需真实 WebGL 环境即可运行测试
