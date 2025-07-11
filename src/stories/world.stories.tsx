import type { Meta, StoryObj } from '@storybook/react-vite';
import { World } from '../components/world';
import { Box, Sphere, Torus } from '@react-three/drei';

const meta = {
  title: 'Components/World',
  component: World,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# World 组件文档

## What - 是什么？

World 是一个基于 React Three Fiber 的 3D 场景容器组件，提供了完整的 3D 世界环境，包括相机、灯光、控制器和可选的辅助工具。

## Why - 为什么使用？

- **开箱即用**：预配置了常用的 3D 场景设置，无需手动配置相机、灯光等
- **高度可定制**：支持自定义尺寸、背景色、网格显示等
- **性能监控**：内置可选的性能统计显示
- **响应式设计**：支持百分比和固定尺寸，适应各种布局需求

## Who - 谁使用？

- 需要快速搭建 3D 场景的前端开发者
- 构建 3D 可视化应用的团队
- 学习 React Three Fiber 的初学者

## When - 何时使用？

- 需要创建 3D 可视化界面时
- 展示 3D 模型或数据时
- 构建交互式 3D 应用时
- 需要在 React 应用中嵌入 3D 内容时

## Where - 在哪使用？

- 数据可视化仪表板
- 产品展示页面
- 教育互动应用
- 游戏和娱乐应用
- 建筑和工程可视化

## How - 如何使用？

### 尺寸定义说明

World 组件的尺寸可以通过 \`width\` 和 \`height\` 属性来控制：

#### 1. 百分比尺寸（推荐）
\`\`\`jsx
<World width="100%" height="100%" />
// 占满父容器的全部空间
\`\`\`

#### 2. 固定像素尺寸
\`\`\`jsx
<World width="800px" height="600px" />
// 固定 800x600 像素的画布
\`\`\`

#### 3. 视口单位
\`\`\`jsx
<World width="100vw" height="100vh" />
// 占满整个视口
\`\`\`

#### 4. 混合使用
\`\`\`jsx
<World width="100%" height="600px" />
// 宽度自适应，高度固定
\`\`\`

### 完整示例

\`\`\`jsx
import { World } from '@infinicube/components'
import { Box } from '@react-three/drei'

function App() {
  return (
    <World 
      width="100%" 
      height="600px"
      showGrid={true}
      showStats={true}
      backgroundColor="#f0f0f0"
    >
      <Box position={[0, 1, 0]}>
        <meshStandardMaterial color="orange" />
      </Box>
    </World>
  )
}
\`\`\`

### 注意事项

1. **父容器要求**：使用百分比尺寸时，确保父容器有明确的尺寸定义
2. **性能考虑**：避免创建过大的画布，建议最大不超过 1920x1080
3. **响应式设计**：优先使用百分比或视口单位，以适应不同屏幕尺寸
4. **最小尺寸**：建议最小尺寸不小于 300x300 像素，以确保良好的交互体验
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'text',
      description: '世界容器宽度，支持像素值(如 800px)、百分比(如 100%)、视口单位(如 100vw)',
      defaultValue: '100%',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: '100%' },
      },
    },
    height: {
      control: 'text',
      description: '世界容器高度，支持像素值(如 600px)、百分比(如 100%)、视口单位(如 100vh)',
      defaultValue: '600px',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: '600px' },
      },
    },
    showGrid: {
      control: 'boolean',
      description: '是否显示网格辅助线，有助于空间定位和尺寸参考',
      defaultValue: true,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showStats: {
      control: 'boolean',
      description: '是否显示性能统计面板，包括 FPS、内存使用等信息',
      defaultValue: false,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    backgroundColor: {
      control: 'color',
      description: '容器背景颜色，支持所有 CSS 颜色值',
      defaultValue: '#f0f0f0',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#f0f0f0' },
      },
    },
    children: {
      description: 'React Three Fiber 子元素，如 3D 对象、灯光等',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
  },
} satisfies Meta<typeof World>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: '100%',
    height: '600px',
    showGrid: true,
    showStats: false,
    backgroundColor: '#f0f0f0',
  },
};

export const WithObjects: Story = {
  name: '包含 3D 对象',
  args: {
    width: '100%',
    height: '600px',
    showGrid: true,
    showStats: true,
    backgroundColor: '#e8f4f8',
  },
  render: (args) => (
    <World {...args}>
      <Box args={[1, 1, 1]} position={[-2, 0.5, 0]}>
        <meshStandardMaterial color="orange" />
      </Box>
      <Sphere args={[0.5, 32, 32]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="hotpink" />
      </Sphere>
      <Torus args={[0.5, 0.2, 16, 32]} position={[2, 0.5, 0]}>
        <meshStandardMaterial color="lightblue" />
      </Torus>
    </World>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示如何在 World 组件中添加各种 3D 对象。这里展示了立方体、球体和圆环体。',
      },
    },
  },
};

export const ResponsiveFullscreen: Story = {
  name: '响应式全屏',
  args: {
    width: '100vw',
    height: '100vh',
    showGrid: true,
    showStats: false,
    backgroundColor: '#000000',
  },
  render: (args) => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <World {...args}>
        <Box args={[2, 2, 2]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.2} />
        </Box>
      </World>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '使用视口单位(vw/vh)创建全屏 3D 场景，适合沉浸式体验。',
      },
    },
  },
};

export const PerformanceMonitoring: Story = {
  name: '性能监控',
  args: {
    width: '100%',
    height: '600px',
    showGrid: true,
    showStats: true,
    backgroundColor: '#ffffff',
  },
  render: (args) => (
    <World {...args}>
      {Array.from({ length: 50 }, (_, i) => (
        <Box
          key={i}
          args={[0.5, 0.5, 0.5]}
          position={[Math.sin(i * 0.3) * 5, Math.cos(i * 0.2) * 2 + 1, Math.cos(i * 0.3) * 5]}
        >
          <meshStandardMaterial color={`hsl(${i * 7}, 70%, 50%)`} />
        </Box>
      ))}
    </World>
  ),
  parameters: {
    docs: {
      description: {
        story: '启用性能统计面板，监控 FPS、渲染时间和内存使用。适合性能调优和压力测试。',
      },
    },
  },
};

export const FixedSize: Story = {
  name: '固定尺寸',
  args: {
    width: '800px',
    height: '400px',
    showGrid: true,
    showStats: false,
    backgroundColor: '#f5f5dc',
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#333',
      }}
    >
      <World {...args}>
        <Sphere args={[1, 64, 64]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#ff6b6b" metalness={0.5} roughness={0.2} />
        </Sphere>
      </World>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '使用固定像素尺寸，适合需要精确控制画布大小的场景，如嵌入到特定布局中。',
      },
    },
  },
};

export const MinimalSetup: Story = {
  name: '最小配置',
  args: {
    width: '100%',
    height: '600px',
    showGrid: false,
    showStats: false,
    backgroundColor: '#1a1a1a',
  },
  parameters: {
    docs: {
      description: {
        story: '最简洁的配置，隐藏所有辅助元素，适合产品展示或艺术呈现。',
      },
    },
  },
};
