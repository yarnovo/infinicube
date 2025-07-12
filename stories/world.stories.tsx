import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stage } from '../src/components/stage';
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

World 是 Infinicube 组件库的核心场景组件，基于 React Three Fiber 构建，提供了完整的 3D 场景环境。它封装了相机控制、灯光系统、网格辅助线和性能监控等基础功能，是所有 3D 内容的容器。

## 为什么

- **开箱即用**：预配置了透视相机、环境光、方向光等必要元素
- **交互控制**：集成 OrbitControls，支持鼠标/触摸旋转、缩放和平移
- **开发友好**：可选的网格辅助线和性能统计面板
- **灵活扩展**：支持添加任意 Three.js/R3F 组件作为子元素
- **性能优化**：合理的默认配置，平衡视觉效果和性能

## 谁在用

- 使用 Infinicube 构建 3D 应用的开发者
- 需要标准化 3D 场景配置的团队
- React Three Fiber 项目开发者
- 3D 可视化应用的设计师和工程师

## 何时用

- 创建任何需要 3D 交互的场景
- 展示 3D 模型或数据可视化
- 开发 3D 编辑器或设计工具
- 构建游戏或仿真应用
- 教学演示和交互式内容

## 在哪用

- 作为 Stage 组件的直接子组件
- 3D 产品展示页面
- 数据可视化仪表板
- 在线 3D 编辑器
- 教育和培训应用

## 如何用

### 依赖关系

\`\`\`
Stage (容器层)
  └── World (场景层)
        ├── 相机系统 (PerspectiveCamera)
        ├── 灯光系统 (AmbientLight + DirectionalLight)
        ├── 控制系统 (OrbitControls)
        ├── 辅助工具 (Grid Helper + Stats)
        └── 用户内容 (children)
\`\`\`

### API 接口

\`\`\`typescript
interface WorldProps {
  children?: React.ReactNode;
  showGrid?: boolean;
  showStats?: boolean;
}
\`\`\`

### Props 说明

- **children**: 3D 场景内容，可以是任何 Three.js/R3F 组件
- **showGrid**: 是否显示网格辅助线，默认 true
- **showStats**: 是否显示性能统计面板，默认 false

### 场景配置

#### 相机设置
- 类型：透视相机 (PerspectiveCamera)
- 位置：[5, 5, 5]
- 视野：75 度

#### 灯光设置
- 环境光：强度 0.5，提供基础照明
- 方向光：强度 1.0，位置 [10, 10, 5]，投射阴影

#### 控制器设置
- 启用阻尼效果，提供平滑的交互体验
- 支持鼠标右键平移
- 触摸设备支持双指缩放和旋转

## 使用示例

### 基础用法

\`\`\`jsx
import { Stage, World } from '@infinicube/components';
import { Box } from '@react-three/drei';

function App() {
  return (
    <Stage>
      <World>
        <Box position={[0, 1, 0]}>
          <meshStandardMaterial color="orange" />
        </Box>
      </World>
    </Stage>
  );
}
\`\`\`

### 隐藏辅助工具

\`\`\`jsx
<World showGrid={false} showStats={false}>
  {/* 纯净的 3D 场景 */}
</World>
\`\`\`

### 性能监控模式

\`\`\`jsx
<World showGrid={true} showStats={true}>
  {/* 开发和调试时使用 */}
</World>
\`\`\`

### 注意事项

1. **性能考虑**：showStats 会略微影响性能，生产环境建议关闭
2. **坐标系统**：使用右手坐标系，Y 轴向上
3. **单位系统**：默认单位可视为米，网格间距为 1 单位
4. **交互范围**：相机距离限制在合理范围内，避免过近或过远
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
  decorators: [
    (Story) => (
      <Stage>
        <Story />
      </Stage>
    ),
  ],
} satisfies Meta<typeof World>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '默认世界',
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
