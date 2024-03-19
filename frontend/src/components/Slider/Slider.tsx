import React, { useState } from "react";

const Slider: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  return (
    <div className="flex flex-col my-3">
      <div className="flex justify-between my-2">
        <div className="text-secondary text-5xl">{value}%</div>
        <div className="flex justify-between text-xs px-2 items-center w-3/5">
          <button className="slider-button" onClick={() => setValue(25)}>
            25%
          </button>
          <button className="slider-button" onClick={() => setValue(50)}>
            50%
          </button>
          <button className="slider-button" onClick={() => setValue(75)}>
            75%
          </button>
          <button className="slider-button" onClick={() => setValue(100)}>
            Max
          </button>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value, 10))}
        className="slider w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer dark:bg-sky-700"
      />
    </div>
  );
};

export default Slider;
