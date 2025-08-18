import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from './ColorPicker';

const mockOnColorChange = vi.fn();

describe('ColorPicker', () => {
  beforeEach(() => {
    // 各テストの前にモックをクリア
    mockOnColorChange.mockClear();
  });

  it('should render without crashing and display the label', () => {
    render(
      <ColorPicker
        label="Test Color"
        color="#ff0000ff"
        onColorChange={mockOnColorChange}
      />,
    );
    expect(screen.getByText('Test Color')).toBeInTheDocument();
  });

  it('should render RGBA input fields', () => {
    render(
      <ColorPicker
        label="Test Color"
        color="#112233ff"
        onColorChange={mockOnColorChange}
      />,
    );

    // エラーが発生した .map が正しく動作し、各ラベルを持つinputが描画されるか確認
    expect(screen.getByLabelText('r')).toBeInTheDocument();
    expect(screen.getByLabelText('g')).toBeInTheDocument();
    expect(screen.getByLabelText('b')).toBeInTheDocument();
    expect(screen.getByLabelText('a')).toBeInTheDocument();

    // 初期値が正しく反映されているか確認
    expect(screen.getByLabelText('r')).toHaveValue(17);
    expect(screen.getByLabelText('g')).toHaveValue(34);
    expect(screen.getByLabelText('b')).toHaveValue(51);
    expect(screen.getByLabelText('a')).toHaveValue(1.0);
  });

  it('should call onColorChange when an RGBA input is changed', async () => {
    const user = userEvent.setup();
    render(
      <ColorPicker
        label="Test Color"
        color="#ff0000ff" // r=255, g=0, b=0, a=1.0
        onColorChange={mockOnColorChange}
      />,
    );

    const gInput = screen.getByLabelText('g');
    await user.clear(gInput);
    await user.type(gInput, '8');

    // onChangeハンドラが正しいHEX値で呼び出されたか確認
    expect(mockOnColorChange).toHaveBeenLastCalledWith('#ff0800ff');
  });

  it('should call onColorChange when a preset color is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ColorPicker
        label="Test Color"
        color="#00000080" // alpha=0.5
        onColorChange={mockOnColorChange}
        presetColors={['#ff0000', '#00ff00']}
      />,
    );

    const presetButton = screen.getByLabelText('Set color to #ff0000');
    await user.click(presetButton);

    // プリセットの色が適用され、元のアルファ値が維持されているか確認
    expect(mockOnColorChange).toHaveBeenCalledWith('#ff000080');
  });
});
