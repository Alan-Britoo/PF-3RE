import React, { useState } from "react";

export default function Temperatura({ changeF, changeC }) {
  const [color, setColor] = useState('#585676');
  const [color2, setColor2] = useState('#A09FB1');

  const paintSky = () => {
    setColor(color2);
    setColor2(color);
  };

  return (
    <div className="absolute top-4 right-[75px] hidden md:block "
    style={{ cursor: `url('/cursor (1).png'), auto` }}>
      <button
        type="button"
        className="rounded-full  h-[40px] w-[40px] font-bold text-silver bg-[#585676] undefined mx-3 transition duration-300 ease-in-out transform hover:scale-110"
        onClick={() => {
          changeC();
          paintSky();
        }}
        style={{ backgroundColor: color2, cursor: `url('/cursor (1).png'), auto` }}
      >
        °C
      </button>
      <button
        type="button"
        className="rounded-full  h-[40px] w-[40px] font-bold text-silver  bg-[#585676] undefined transition duration-300 ease-in-out transform hover:scale-110 "
        onClick={() => {
          changeF();
          paintSky();
        }}
        style={{ backgroundColor: color, cursor: `url('/cursor (1).png'), auto` }}
      >
        °F
      </button>
    </div>
  );
}
