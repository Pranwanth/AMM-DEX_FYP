import React from "react";

interface SliderProps {
  value: number;
  handleSliderChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  value,
  handleSliderChange,
}: SliderProps) => {
  return (
    <div className="flex flex-col my-3">
      <div className="flex justify-between my-2">
        <div className="text-secondary text-5xl">{value}%</div>
        <div className="flex justify-between text-xs px-2 items-center w-3/5">
          <button
            className="slider-button"
            onClick={() => handleSliderChange(25)}
          >
            25%
          </button>
          <button
            className="slider-button"
            onClick={() => handleSliderChange(50)}
          >
            50%
          </button>
          <button
            className="slider-button"
            onClick={() => handleSliderChange(75)}
          >
            75%
          </button>
          <button
            className="slider-button"
            onClick={() => handleSliderChange(100)}
          >
            Max
          </button>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
        className="slider w-full h-2 bg-sky-800 rounded-lg appearance-none cursor-pointer dark:bg-sky-700"
      />
    </div>
  );
};

export default Slider;
