import type { Meta, StoryObj } from '@storybook/react-vite';
import { World } from '../src/components/world';
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

## 是什么

World 是一个基于 React Three Fiber 的 3D 场景容器组件，提供了完整的 3D 世界环境，包括相机、灯光、控制器和可选的辅助工具。

## 为什么

- **开箱即用**：预配置了常用的 3D 场景设置，无需手动配置相机、灯光等
- **高度可定制**：支持自定义尺寸、背景色、网格显示等
- **性能监控**：内置可选的性能统计显示
- **响应式设计**：支持百分比和固定尺寸，适应各种布局需求

## 谁在用

- 需要快速搭建 3D 场景的前端开发者
- 构建 3D 可视化应用的团队
- 学习 React Three Fiber 的初学者

## 何时用

- 需要创建 3D 可视化界面时
- 展示 3D 模型或数据时
- 构建交互式 3D 应用时
- 需要在 React 应用中嵌入 3D 内容时

## 在哪用

- 数据可视化仪表板
- 产品展示页面
- 教育互动应用
- 游戏和娱乐应用
- 建筑和工程可视化

## 如何用


### 完整示例

\`\`\`jsx
import { World } from '@infinicube/components'
import { Box } from '@react-three/drei'

function App() {
  return (
    <World 
      showGrid={true}
      showStats={true}
    >
      <Box position={[0, 1, 0]}>
        <meshStandardMaterial color="orange" />
      </Box>
    </World>
  )
}
\`\`\`

### 注意事项

1. **性能考虑**：避免创建过大的画布
2. **响应式设计**：组件会自动适应容器尺寸
3. **交互体验**：确保画布有足够的空间以提供良好的交互体验
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
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
    showGrid: true,
    showStats: false,
  },
};

export const WithObjects: Story = {
  name: '包含 3D 对象',
  args: {
    showGrid: true,
    showStats: true,
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

export const PerformanceMonitoring: Story = {
  name: '性能监控',
  args: {
    showGrid: true,
    showStats: true,
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

export const MinimalSetup: Story = {
  name: '最小配置',
  args: {
    showGrid: false,
    showStats: false,
  },
  render: (args) => (
    <World {...args}>
      <Box args={[2, 2, 2]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.4} />
      </Box>
    </World>
  ),
  parameters: {
    docs: {
      description: {
        story: '最简洁的配置，隐藏所有辅助元素，适合产品展示或艺术呈现。',
      },
    },
  },
};
