# Three.js 测试最佳实践调研报告

## 概述

本文档总结了 2024 年 Three.js 应用程序的测试最佳实践，包括单元测试、集成测试和视觉回归测试。

## 主要挑战

1. **WebGL 上下文依赖**：Three.js 严重依赖 WebGL，在 Node.js 测试环境中不可用
2. **Three.js v0.163.0+ 弃用 WebGL1**：许多传统测试方案（如 headless-gl）不再可行
3. **性能考虑**：Jest 在测试 Three.js 时可能会"导致各种问题并且运行速度极慢"

## 推荐的测试框架

### 1. Vitest（推荐）

- 由 Vite 团队开发，性能优越
- 使用 Worker 线程并行化测试
- API 兼容 Jest，迁移成本低
- 轻量级，精心选择依赖

### 2. Mocha

- 灵活的测试框架
- 支持异步测试
- 可与 Chai 和 Sinon 配合使用

### 3. Jasmine

- 支持行为驱动开发（BDD）
- 适合前端测试
- 良好的文档支持

## Vitest 配置示例

### 1. 安装依赖

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

### 2. 配置文件 (vitest.config.ts)

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
});
```

### 3. 测试设置文件 (tests/setup.ts)

```typescript
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});
```

## Three.js 特定的测试策略

### 1. Mock WebGL 上下文

由于测试环境没有真实的 WebGL 上下文，需要 mock Three.js 的核心类：

```typescript
import { vi } from 'vitest';

vi.mock('three', () => ({
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement('canvas'),
  })),
  PerspectiveCamera: vi.fn(() => ({
    position: { set: vi.fn() },
    lookAt: vi.fn(),
  })),
  Scene: vi.fn(() => ({
    add: vi.fn(),
    remove: vi.fn(),
  })),
  // 其他需要的 Three.js 类
}));
```

### 2. Jest + jest-webgl-canvas-mock（备选方案）

如果必须使用 Jest：

```bash
npm install --save-dev jest-webgl-canvas-mock
```

在 Jest 配置中：

```javascript
module.exports = {
  setupFiles: ['jest-webgl-canvas-mock'],
  // 其他配置
};
```

### 3. webgl-mock-threejs

专门为 Three.js 设计的 WebGL mock：

```bash
npm install --save-dev webgl-mock-threejs
```

使用示例：

```javascript
require('webgl-mock-threejs');

const canvas = new HTMLCanvasElement(640, 480);
const renderer = new THREE.WebGLRenderer({ canvas });
```

## 测试类型和最佳实践

### 1. 单元测试

- **遵循 AAA 模式**：Arrange（准备）、Act（执行）、Assert（断言）
- **测试行为而非实现**：关注输出和结果，而不是内部实现细节
- **确保测试的确定性**：避免随机性和时间依赖

### 2. 集成测试

- 测试多个组件之间的交互
- 验证 Three.js 场景的整体行为
- 测试用户交互（如鼠标、键盘事件）

### 3. 视觉回归测试

- 捕获渲染结果的快照
- 使用工具如 Percy 或 Chromatic
- 适合验证视觉一致性

### 4. 性能测试

- 监控渲染时间
- 内存使用情况
- 使用 WebGL Inspector 等工具调试

## 实际测试示例

### 基础组件测试

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import ThreeScene from '../ThreeScene'

describe('ThreeScene Component', () => {
  it('初始化场景并添加对象', () => {
    const mockScene = { add: vi.fn() }
    const mockRenderer = { render: vi.fn() }

    const { container } = render(<ThreeScene />)

    expect(mockScene.add).toHaveBeenCalled()
    expect(mockRenderer.render).toHaveBeenCalled()
  })

  it('响应窗口大小变化', () => {
    const { container } = render(<ThreeScene />)

    // 触发 resize 事件
    global.innerWidth = 1024
    global.innerHeight = 768
    fireEvent(window, new Event('resize'))

    // 验证渲染器调整大小
    // ...
  })
})
```

### 工具函数测试

```typescript
import { describe, it, expect } from 'vitest';
import { calculatePosition, normalizeVector } from '../utils/math';

describe('数学工具函数', () => {
  it('正确计算 3D 位置', () => {
    const result = calculatePosition({ x: 1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 });
    expect(result).toEqual({ x: 5, y: 7, z: 9 });
  });

  it('向量归一化', () => {
    const normalized = normalizeVector({ x: 3, y: 4, z: 0 });
    expect(normalized.x).toBeCloseTo(0.6);
    expect(normalized.y).toBeCloseTo(0.8);
    expect(normalized.z).toBe(0);
  });
});
```

## 持续集成（CI）配置

### GitHub Actions 示例

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
      - run: npm run test:run
      - run: npm run test:coverage
```

## 注意事项

1. **避免测试实现细节**：专注于公共 API 和用户可见的行为
2. **保持测试独立性**：每个测试应该独立运行，不依赖其他测试的状态
3. **合理使用 Mock**：只 mock 必要的部分，保持测试的真实性
4. **定期运行测试**：将测试集成到开发工作流中
5. **平衡测试类型**：单元测试、集成测试和端到端测试应该有合理的比例

## 总结

- 推荐使用 Vitest 作为测试框架，性能好且配置简单
- 通过 Mock WebGL 上下文来进行单元测试
- 结合视觉回归测试确保渲染结果的一致性
- 遵循测试最佳实践，编写清晰、可维护的测试代码
