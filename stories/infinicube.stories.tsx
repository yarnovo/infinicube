import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Stage } from '../src/components/stage';
import { World } from '../src/components/world';
import { Infinicube } from '../src/components/infinicube';

const meta = {
  title: 'Components/Infinicube',
  component: Infinicube,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Infinicube 组件文档

## 是什么

Infinicube 是一个专注于立方体管理的 React 组件，提供了创建、选择、删除立方体的核心功能。它不包含 3D 场景配置，需要与 World 组件配合使用。

## 为什么

- **简化开发**：封装了 3D 对象的创建、选择、删除等复杂逻辑
- **命令式 API**：通过 ref 提供直观的方法调用接口
- **完整的事件系统**：支持生命周期回调，方便状态管理
- **可视化反馈**：内置选中效果，提升用户体验
- **灵活扩展**：基于标准 React 组件，易于集成和定制

## 谁在用

- 需要在项目中集成 3D 资源管理功能的开发者
- 构建数据可视化平台的团队
- 开发教育或创意应用的设计师
- 探索 3D Web 技术的创新者

## 何时用

- 需要在 3D 空间中管理多个对象时
- 构建交互式 3D 编辑器时
- 实现空间数据可视化时
- 创建 3D 游戏或仿真应用时

## 在哪用

- 3D 资源管理系统
- 空间数据可视化平台
- 在线 3D 编辑器
- 虚拟展示空间
- 教育互动应用

## 如何用

### 依赖关系

\`\`\`
Stage (容器层)
  └── World (场景层)
        └── Infinicube (管理层)
              └── Cube (元素层)
\`\`\`

**注意**：Infinicube 本身不包含 3D 场景配置，必须放置在 World 组件内部使用。

### API 接口

### 命令式 API (通过 ref)

\`\`\`typescript
interface InfinicubeRef {
  createCube: (position: [number, number, number], options?: { color?: string; size?: number }) => string;
  selectCube: (id: string) => void;
  deleteCube: (id: string) => void;
  getCubes: () => Cube[];
  clearCubes: () => void;
}
\`\`\`

### Props

\`\`\`typescript
interface InfinicubeProps {
  initialCubes?: Cube[];
  onCubeCreate?: (cube: Cube) => void;
  onCubeSelect?: (cube: Cube | null) => void;
  onCubeDelete?: (id: string) => void;
  onCubeUpdate?: (cube: Cube) => void;
  children?: React.ReactNode;
}
\`\`\`

## 使用示例

\`\`\`jsx
import { useRef } from 'react';
import { Stage, World, Infinicube } from '@infinicube/components';

function App() {
  const infinicubeRef = useRef(null);
  
  const handleCreateCube = () => {
    const position = [Math.random() * 4 - 2, 1, Math.random() * 4 - 2];
    infinicubeRef.current?.createCube(position);
  };
  
  return (
    <>
      <button onClick={handleCreateCube}>创建立方体</button>
      <Stage>
        <World>
          <Infinicube
            ref={infinicubeRef}
            onCubeSelect={(cube) => console.log('Selected:', cube)}
          />
        </World>
      </Stage>
    </>
  );
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialCubes: {
      description: '初始立方体数组',
      control: 'object',
      table: {
        type: { summary: 'Cube[]' },
      },
    },
    onCubeCreate: {
      description: '立方体创建时的回调',
      action: 'cube-created',
      table: {
        type: { summary: '(cube: Cube) => void' },
      },
    },
    onCubeSelect: {
      description: '立方体选中时的回调',
      action: 'cube-selected',
      table: {
        type: { summary: '(cube: Cube | null) => void' },
      },
    },
    onCubeDelete: {
      description: '立方体删除时的回调',
      action: 'cube-deleted',
      table: {
        type: { summary: '(id: string) => void' },
      },
    },
    onCubeUpdate: {
      description: '立方体更新时的回调',
      action: 'cube-updated',
      table: {
        type: { summary: '(cube: Cube) => void' },
      },
    },
    children: {
      description: '子组件内容',
      control: false,
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
  },
  decorators: [
    (Story) => (
      <Stage>
        <World>
          <Story />
        </World>
      </Stage>
    ),
  ],
} satisfies Meta<typeof Infinicube>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '默认组件',
  args: {
    onCubeCreate: fn(),
    onCubeSelect: fn(),
    onCubeDelete: fn(),
  },
};

export const WithInitialCubes: Story = {
  name: '预设立方体',
  args: {
    ...Default.args,
    initialCubes: [
      { id: 'cube-1', position: [-2, 1, 0], color: '#ff6b6b', size: 1 },
      { id: 'cube-2', position: [0, 1, 0], color: '#4ecdc4', size: 1.5 },
      { id: 'cube-3', position: [2, 1, 0], color: '#45b7d1', size: 0.8 },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '展示如何使用 initialCubes 属性预设一些立方体',
      },
    },
  },
};

export const GridPattern: Story = {
  name: '网格排列',
  args: {
    ...Default.args,
    initialCubes: Array.from({ length: 25 }, (_, i) => ({
      id: `grid-cube-${i}`,
      position: [(i % 5) * 1.5 - 3, 0.5, Math.floor(i / 5) * 1.5 - 3] as [number, number, number],
      color: `hsl(${(i * 360) / 25}, 70%, 50%)`,
      size: 0.8,
    })),
  },
  parameters: {
    docs: {
      description: {
        story: '展示立方体的网格排列，使用彩虹色渐变',
      },
    },
  },
};
