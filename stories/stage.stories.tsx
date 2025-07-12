import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stage } from '../src/components/stage';
import { World } from '../src/components/world';
import { Box } from '@react-three/drei';

const meta = {
  title: 'Components/Stage',
  component: Stage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Stage 组件文档

## 是什么

Stage 是 Infinicube 组件库的基础容器组件，基于 @react-three/fiber 的 Canvas 组件封装，提供了标准化的 3D 渲染环境。它负责初始化 WebGL 上下文、相机设置和基础渲染配置。

## 为什么

- **简化配置**：预设了常用的 Canvas 配置，减少重复代码
- **响应式设计**：默认提供全屏响应式布局
- **性能优化**：内置了抗锯齿、阴影等渲染优化选项
- **灵活定制**：支持自定义尺寸、背景色等属性
- **开发友好**：统一的容器接口，便于团队协作

## 谁在用

- 使用 Infinicube 组件库的所有开发者
- 需要快速搭建 3D 场景的前端工程师
- React Three Fiber 项目的初学者
- 追求代码规范化的开发团队

## 何时用

- 创建任何 3D 场景时的第一步
- 需要标准化的 Canvas 容器时
- 开发 3D 组件的演示和测试时
- 构建完整的 3D 应用程序时

## 在哪用

- 作为 3D 场景的根容器
- Storybook 组件演示
- 单元测试和集成测试
- 独立的 3D 应用页面
- 嵌入式 3D 组件展示

## 如何用

### 依赖关系

\`\`\`
Stage (容器层)
  └── @react-three/fiber Canvas
        └── World (场景层)
              └── Cube / 其他 3D 组件
\`\`\`

### API 接口

\`\`\`typescript
interface StageProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}
\`\`\`

### Props 说明

- **children**: 子组件，通常是 World 组件
- **width**: 容器宽度，默认 "100vw"
- **height**: 容器高度，默认 "100vh"
- **backgroundColor**: 背景颜色，默认 "#000000"
- **className**: 自定义 CSS 类名
- **style**: 自定义内联样式

## 使用示例

### 基础用法

\`\`\`jsx
import { Stage, World } from '@infinicube/components';

function App() {
  return (
    <Stage>
      <World>
        {/* 3D 内容 */}
      </World>
    </Stage>
  );
}
\`\`\`

### 自定义尺寸

\`\`\`jsx
<Stage width="800px" height="600px" backgroundColor="#f0f0f0">
  <World>
    {/* 3D 内容 */}
  </World>
</Stage>
\`\`\`

### 响应式布局

\`\`\`jsx
<Stage 
  width="100%" 
  height="400px" 
  style={{ maxWidth: '1200px', margin: '0 auto' }}
>
  <World>
    {/* 3D 内容 */}
  </World>
</Stage>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: '子组件内容，通常包含 World 组件',
      control: { type: null },
    },
    width: {
      description: '容器宽度',
      control: 'text',
      defaultValue: '100vw',
    },
    height: {
      description: '容器高度',
      control: 'text',
      defaultValue: '100vh',
    },
    backgroundColor: {
      description: '背景颜色',
      control: 'color',
      defaultValue: '#000000',
    },
    className: {
      description: '自定义 CSS 类名',
      control: 'text',
    },
    style: {
      description: '自定义内联样式',
      control: 'object',
    },
  },
} satisfies Meta<typeof Stage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '默认配置',
  render: (args) => (
    <Stage {...args}>
      <World>
        <Box position={[0, 0, 0]}>
          <meshStandardMaterial color="#3b82f6" />
        </Box>
      </World>
    </Stage>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示 Stage 的默认配置，全屏黑色背景',
      },
    },
  },
};

export const CustomSize: Story = {
  name: '自定义尺寸',
  args: {
    width: '600px',
    height: '400px',
    backgroundColor: '#1a1a1a',
  },
  render: (args) => (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <Stage {...args}>
        <World>
          <Box position={[0, 0, 0]}>
            <meshStandardMaterial color="#10b981" />
          </Box>
        </World>
      </Stage>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示如何设置固定尺寸的 Stage',
      },
    },
  },
};

export const LightBackground: Story = {
  name: '浅色背景',
  args: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    height: '500px',
  },
  render: (args) => (
    <Stage {...args}>
      <World>
        <Box position={[0, 0, 0]}>
          <meshStandardMaterial color="#ef4444" />
        </Box>
      </World>
    </Stage>
  ),
  parameters: {
    docs: {
      description: {
        story: '使用浅色背景的 Stage，适合特定的视觉设计需求',
      },
    },
  },
};

export const ResponsiveContainer: Story = {
  name: '响应式容器',
  args: {
    width: '100%',
    height: '60vh',
    backgroundColor: '#0a0a0a',
  },
  render: (args) => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Stage {...args}>
        <World showGrid={true}>
          <Box position={[-2, 0, 0]}>
            <meshStandardMaterial color="#f59e0b" />
          </Box>
          <Box position={[0, 0, 0]}>
            <meshStandardMaterial color="#8b5cf6" />
          </Box>
          <Box position={[2, 0, 0]}>
            <meshStandardMaterial color="#06b6d4" />
          </Box>
        </World>
      </Stage>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示 Stage 的响应式布局能力，容器会根据父元素自适应',
      },
    },
  },
};

export const WithCustomStyle: Story = {
  name: '自定义样式',
  args: {
    width: '100%',
    height: '400px',
    backgroundColor: '#000000',
    style: {
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      overflow: 'hidden',
    },
  },
  render: (args) => (
    <div style={{ padding: '40px', backgroundColor: '#fafafa' }}>
      <Stage {...args}>
        <World>
          <Box position={[0, 0, 0]} rotation={[0.5, 0.5, 0]}>
            <meshStandardMaterial color="#3b82f6" />
          </Box>
        </World>
      </Stage>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '通过 style 属性添加自定义样式，如边框和圆角',
      },
    },
  },
};
