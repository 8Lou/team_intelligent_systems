import React from "react";

interface ColorPickerProps {
  selectedBallColor: string;
  onUpdateColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedBallColor,
  onUpdateColor,
}) => {
  return (
    <div>
      <input
        type="color"
        value={selectedBallColor}
        onChange={(e) => onUpdateColor(e.target.value)}
      />
      <button onClick={() => onUpdateColor(selectedBallColor)}>
        Закрыть меню
      </button>
    </div>
  );
};

export default ColorPicker;
