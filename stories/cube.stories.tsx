import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stage } from '../src/components/stage';
import { World } from '../src/components/world';
import { Cube } from '../src/components/cube';
import type { Cube as CubeData } from '../src/components/infinicube';

const meta: Meta<typeof Cube> = {
  title: 'Components/Cube',
  component: Cube,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultCube: CubeData = {
  id: 'story-cube',
  position: [0, 0, 0],
  color: '#3b82f6',
  size: 1,
};

export const Default: Story = {
  name: '默认立方体',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: defaultCube,
    isSelected: false,
  },
};

export const Selected: Story = {
  name: '选中状态',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: defaultCube,
    isSelected: true,
  },
};

export const Large: Story = {
  name: '大型立方体',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      size: 2,
      color: '#ef4444',
    },
    isSelected: false,
  },
};

export const Small: Story = {
  name: '小型立方体',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      size: 0.5,
      color: '#10b981',
    },
    isSelected: false,
  },
};

export const CustomColor: Story = {
  name: '自定义颜色',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      color: '#f59e0b',
    },
    isSelected: false,
  },
};

export const PositionedCube: Story = {
  name: '定位立方体',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      position: [2, 1, -1],
      color: '#8b5cf6',
    },
    isSelected: false,
  },
};

// 主题示例
export const MetalTheme: Story = {
  name: '金属主题',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      theme: 'metal',
    },
    isSelected: false,
  },
};

export const GlassTheme: Story = {
  name: '玻璃主题',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      theme: 'glass',
    },
    isSelected: false,
  },
};

export const NeonTheme: Story = {
  name: '霓虹主题',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      theme: 'neon',
    },
    isSelected: false,
  },
};

export const CrystalTheme: Story = {
  name: '水晶主题',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      theme: 'crystal',
    },
    isSelected: false,
  },
};
