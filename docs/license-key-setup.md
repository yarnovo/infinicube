# License Key 配置指南

## 概述

yakbox 使用 @virtuoso.dev/message-list 作为虚拟滚动引擎。**本地开发不需要 License Key**，仅在 Storybook 部署和生产环境中需要配置。

## 获取 License Key

1. 访问 [Virtuoso 官网](https://virtuoso.dev)
2. 注册账号并选择合适的许可证计划
3. 获取您的 License Key

## 配置方法

### 1. 本地开发环境

**本地开发不需要 License Key**。组件在本地开发时可以正常运行，无需任何配置。

### 2. GitHub Actions (Storybook 部署)

在 GitHub 仓库中配置 Secret：

1. 访问仓库设置：`Settings` → `Secrets and variables` → `Actions`
2. 点击 `New repository secret`
3. 创建新的 Secret：
   - **Name**: `VITE_VIRTUOSO_LICENSE_KEY`
   - **Value**: 您的 License Key

配置完成后，GitHub Actions 会在构建 Storybook 时自动使用该 License Key。

### 3. 在组件中使用

#### 方式一：Storybook 中自动使用

在 Storybook 中，License Key 会自动从环境变量读取（仅用于 Storybook 部署）：

```tsx
// src/stories/ChatWindow.stories.tsx
import { getVirtuosoLicenseKey } from '../../.storybook/license';

const meta = {
  args: {
    licenseKey: getVirtuosoLicenseKey(), // Storybook 部署时自动读取
  },
};
```

#### 方式二：手动传入 License Key

在实际应用中使用组件时，可以通过 props 传入 License Key：

```tsx
import { ChatWindow } from 'yakbox';

function App() {
  return (
    <ChatWindow
      title="客服支持"
      licenseKey="your-production-license-key"
      currentUserId="user-123"
    />
  );
}
```

## 安全注意事项

1. **不要将 License Key 提交到代码仓库**
   - `.env.local` 文件已被 gitignore
   - 使用环境变量或 CI/CD 密钥管理

2. **生产环境使用专用 License Key**
   - 不同环境使用不同的 License Key
   - 定期轮换 License Key

3. **限制 License Key 的使用范围**
   - 使用域名限制（如果 Virtuoso 支持）
   - 监控 License Key 的使用情况

## 故障排查

### 问题：Storybook 显示 License Key 错误

**检查步骤：**

1. 确认 GitHub Secret 是否正确配置
2. 检查 Secret 名称是否为 `VITE_VIRTUOSO_LICENSE_KEY`
3. 查看 GitHub Actions 日志确认环境变量是否传递

### 问题：本地开发显示 License Key 错误

**解决方法：**

本地开发不需要 License Key。如果出现错误，请检查：

1. 是否正在运行 Storybook（`npm run storybook`）
2. 如果只是开发组件（`npm run dev`），不需要 License Key

## 相关文件

- `.env.example` - 环境变量示例文件
- `.storybook/license.ts` - Storybook 专用 License Key 配置文件
- `.github/workflows/storybook-deploy.yml` - GitHub Actions 配置
