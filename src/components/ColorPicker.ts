import React from "react";

type Props = {
  setColor: (color: string) => void,
};

const ColorPicker: React.FC<Props> = ({ setColor }) => {
  const handleColorChange = (color: string) => {
    setColor(color);
  };

  return (
    <div>
      <button onClick={() => handleColorChange("#FF0000")}>Red</button>
      <button onClick={() => handleColorChange("#00FF00")}>Green</button>
      <button onClick={() => handleColorChange("#0000FF")}>Blue</button>
    </div>
  );
};

export default ColorPicker;
