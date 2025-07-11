# React Three Fiber Vitest 测试环境配置调研报告

## 问题描述

在运行 `npm run check` 时，测试失败并出现以下错误：

- "Invalid hook call" 错误
- "An update to %s inside a test was not wrapped in act(...)"
- WebGL 上下文相关错误
- Vite 意外重新加载测试的警告

## 问题分析

### 1. Invalid Hook Call 错误原因

根据调研，"Invalid hook call" 错误通常由以下原因引起：

1. React 和渲染器版本不匹配
2. 违反了 Hooks 使用规则
3. 项目中存在多个 React 实例
4. 测试环境中缺少必要的 mock

### 2. React Three Fiber 特殊性

React Three Fiber 组件需要：

- WebGL 上下文
- Canvas DOM 元素
- requestAnimationFrame API
- 特殊的渲染循环

这些在 Node.js 测试环境中默认不存在。

## 解决方案

### 方案一：使用 vitest-webgl-canvas-mock

这是最直接的解决方案，可以 mock Canvas 和 WebGL API。

#### 1. 安装依赖

```bash
npm install -D vitest-webgl-canvas-mock
```

#### 2. 创建测试设置文件

创建 `vitest.setup.ts`：

```typescript
import 'vitest-webgl-canvas-mock';

// 额外的全局 mock
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
```

#### 3. 更新 Vitest 配置

在 `vite.config.ts` 中：

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    deps: {
      optimizer: {
        web: {
          include: ['vitest-webgl-canvas-mock'],
        },
      },
    },
    // 排除可能导致问题的依赖
    server: {
      deps: {
        inline: ['@react-three/fiber', '@react-three/drei'],
      },
    },
  },
});
```

### 方案二：使用 @react-three/test-renderer

这是 React Three Fiber 官方推荐的测试方案，不需要真实的 WebGL 上下文。

#### 1. 安装依赖

```bash
npm install -D @react-three/test-renderer
```

#### 2. 创建测试辅助函数

```typescript
// test-utils/r3f.tsx
import { render } from '@react-three/test-renderer';

export function renderR3F(component: React.ReactElement) {
  return render(component);
}
```

#### 3. 编写测试

```typescript
import { renderR3F } from './test-utils/r3f';

test('renders cube', async () => {
  const renderer = await renderR3F(
    <mesh>
      <boxGeometry />
      <meshBasicMaterial />
    </mesh>
  );

  const mesh = renderer.scene.children[0];
  expect(mesh).toBeDefined();
});
```

### 方案三：Storybook Vitest 集成优化

针对 Storybook 的 Vitest 集成，需要特殊配置：

#### 1. 创建 Storybook 专用的 Vitest 设置

创建 `.storybook/vitest.setup.ts`：

```typescript
import { beforeAll } from 'vitest';
import { setProjectAnnotations } from 'storybook/react';
import 'vitest-webgl-canvas-mock';
import * as projectAnnotations from './preview';

// 设置 Storybook 项目注解
beforeAll(() => {
  setProjectAnnotations(projectAnnotations);
});

// WebGL 和 Canvas mock
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Three.js 相关的全局对象
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// 模拟 WebGL 上下文
HTMLCanvasElement.prototype.getContext = function (contextType) {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return {
      canvas: this,
      drawingBufferWidth: 800,
      drawingBufferHeight: 600,
      getExtension: () => null,
      getParameter: () => 0,
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      useProgram: () => {},
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      clear: () => {},
      clearColor: () => {},
      enable: () => {},
      viewport: () => {},
      // 添加更多需要的 WebGL 方法...
    };
  }
  return null;
};
```

#### 2. 更新 `.storybook/vitest.config.ts`

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/experimental-addon-vitest/plugin';
import viteConfig from '../vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [storybookTest()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./.storybook/vitest.setup.ts'],
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
        headless: true,
      },
    },
    optimizeDeps: {
      include: ['@storybook/experimental-addon-vitest/preview'],
    },
  })
);
```

### 方案四：跳过 3D 组件的单元测试

如果上述方案都有问题，可以考虑：

1. **跳过 Story 文件的测试**：

   ```typescript
   // vitest.config.ts
   test: {
     exclude: ['**/*.stories.tsx', '**/node_modules/**'];
   }
   ```

2. **使用条件测试**：

   ```typescript
   // 在测试文件中
   const isTestEnvironment = process.env.NODE_ENV === 'test';

   if (!isTestEnvironment || !window.WebGLRenderingContext) {
     test.skip('WebGL tests', () => {});
   }
   ```

## 推荐方案

基于当前项目情况，推荐采用**方案一 + 方案三**的组合：

1. 安装 `vitest-webgl-canvas-mock`
2. 配置完整的 WebGL mock
3. 为 Storybook 创建专门的测试配置
4. 确保所有必要的全局 API 都被正确 mock

这样可以：

- 保持测试的完整性
- 支持 Storybook 的 play 函数测试
- 避免跳过重要的组件测试

## 实施步骤

1. 安装必要的依赖
2. 创建测试设置文件
3. 更新 Vite/Vitest 配置
4. 运行测试验证配置
5. 根据错误信息调整 mock 实现

## 参考资源

- [vitest-webgl-canvas-mock GitHub](https://github.com/RSamaium/vitest-webgl-canvas-mock)
- [React Three Fiber Testing Guide](https://r3f.docs.pmnd.rs/tutorials/testing)
- [Storybook Vitest Addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)
- [@react-three/test-renderer](https://www.npmjs.com/package/@react-three/test-renderer)

## 实际测试结果

经过实际测试，发现以下情况：

### 1. Storybook Play 函数测试

- Play 函数中的交互测试应该通过组件的 ref API 进行，而不是直接操作 DOM
- 这种方式可以避免 WebGL 上下文问题，专注于测试组件的业务逻辑

### 2. @react-three/test-renderer 限制

- 不能渲染包含 Canvas 的组件（会报错："Canvas is not part of the THREE namespace"）
- 适合测试纯 Three.js 对象，不适合测试完整的 R3F 组件
- 需要将 Canvas 和内部内容分离测试

### 3. 测试策略选择

#### 对于 Storybook 中的测试：

- 继续使用 Play 函数进行交互测试
- 通过 ref API 测试组件功能
- 不需要 WebGL mock

#### 对于单元测试：

- 如果要测试包含 Canvas 的组件，需要更复杂的 mock 设置
- 建议将业务逻辑抽取到独立的函数/hooks 中进行测试
- 或者使用 E2E 测试工具（如 Playwright）进行真实浏览器测试

## 结论

React Three Fiber 组件的测试确实存在挑战，主要是因为：

1. WebGL 上下文在 Node.js 环境中不存在
2. Canvas 组件需要真实的浏览器环境
3. @react-three/test-renderer 有其局限性

测试策略应该根据具体需求选择：

- **交互逻辑测试**：使用 Storybook Play 函数 + ref API
- **3D 对象测试**：使用 @react-three/test-renderer（不包含 Canvas）
- **完整渲染测试**：使用 E2E 测试或浏览器环境的测试
