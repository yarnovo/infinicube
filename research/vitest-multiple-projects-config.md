# Vitest 多项目配置调研报告

## 概述

本报告研究如何在 `vite.config.ts` 中配置 Vitest 以支持多个测试项目，特别是同时运行 Storybook 测试和单元测试。

## 问题背景

当前项目中：

1. 创建了独立的 `vitest.config.ts` 文件，导致配置优先级冲突
2. 需要在同一个项目中运行两种不同类型的测试：
   - Storybook 测试（通过 @storybook/addon-vitest）
   - 单元测试（使用 @react-three/test-renderer）

## Vitest 多项目配置方案

### 方案一：在 vite.config.ts 中使用 projects 配置

```typescript
import { defineConfig } from 'vite';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

export default defineConfig({
  // ... 其他 Vite 配置
  test: {
    projects: [
      {
        // Storybook 测试项目
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
      {
        // 单元测试项目
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/**/*.test.{ts,tsx}'],
          exclude: ['node_modules', 'dist', '.storybook'],
        },
      },
    ],
  },
});
```

### 方案二：使用 workspace 文件（推荐用于已有测试的项目）

根据 Storybook 文档，对于已有 Vitest 测试的项目，推荐使用 workspace 文件来定义独立的项目。

创建 `vitest.workspace.ts`：

```typescript
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // Storybook 测试配置
  {
    extends: './vite.config.ts',
    test: {
      name: 'storybook',
      include: ['stories/**/*.stories.tsx'],
      // Storybook 特定配置
    },
  },
  // 单元测试配置
  {
    extends: './vite.config.ts',
    test: {
      name: 'unit',
      environment: 'node',
      include: ['tests/**/*.test.{ts,tsx}'],
    },
  },
]);
```

### 方案三：保持现有配置结构（最简单）

由于当前配置已经在 `vite.config.ts` 中为 Storybook 配置了测试，可以：

1. 删除独立的 `vitest.config.ts`
2. 在 `vite.config.ts` 的现有 projects 数组中添加单元测试项目

```typescript
test: {
  projects: [
    {
      // 现有的 Storybook 配置
      extends: true,
      plugins: [
        storybookTest({
          configDir: path.join(dirname, '.storybook'),
        }),
      ],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [
            {
              browser: 'chromium',
            },
          ],
        },
        setupFiles: ['.storybook/vitest.setup.ts'],
      },
    },
    // 新增单元测试项目
    {
      extends: true,
      test: {
        name: 'unit',
        environment: 'node',
        include: ['tests/**/*.test.{ts,tsx}'],
        exclude: ['node_modules', 'dist', '.storybook', 'stories'],
      },
    },
  ],
},
```

## 配置要点

1. **项目名称必须唯一**：每个项目必须有唯一的 name，否则 Vitest 会报错

2. **extends 选项**：
   - `extends: true` - 继承根配置（推荐）
   - `extends: false` - 不继承任何配置（默认）

3. **环境差异**：
   - Storybook 测试：需要 browser 环境（使用 Playwright）
   - 单元测试：可以使用 node 环境（更快）

4. **运行命令**：
   - `npm test` - 运行所有测试
   - `npm test --project=unit` - 只运行单元测试
   - `npm test --project=storybook` - 只运行 Storybook 测试

## 建议方案

基于当前项目情况，建议采用**方案三**：

1. 删除 `vitest.config.ts` 文件
2. 在现有的 `vite.config.ts` 中的 projects 数组添加单元测试配置
3. 这样可以：
   - 避免配置文件冲突
   - 保持配置集中管理
   - 利用现有的 Storybook 测试设置

## 注意事项

1. **版本兼容性**：注意 @storybook/addon-vitest 与 Vitest 3.0 可能存在兼容性问题
2. **路径配置**：确保 include 和 exclude 路径正确
3. **测试隔离**：不同项目的测试应该有明确的文件命名或路径区分

## 参考资源

- [Vitest Workspace Guide](https://vitest.dev/guide/workspace)
- [Storybook Vitest Addon Docs](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)
- [Vitest Configuration Reference](https://vitest.dev/config/)
