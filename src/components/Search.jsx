import { useState, useEffect } from "react";
import { ExitIcon, RightIcon, SearchIcon, SignalIcon } from "./Icons";
import { getPlacesFromLocalStorage } from "../Storage/storage";

import hola from '../../public/1.png'

export function Search({ inputSearch, cords }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchPlace, setSearchPlace] = useState("");
  const [places, setPlaces] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const toggleMenu = () => {
    if (isMenuOpen) {
      document.body.classList.remove("no-scrollbar");
    } else {
      document.body.classList.add("no-scrollbar");
    }
    setIsMenuOpen((prev) => !prev);
  };

  const search = (event) => {
    event.preventDefault();
    inputSearch(searchPlace);
    setSearchPlace("")
    setPlaces(getPlacesFromLocalStorage())
  };

  const selectAndClose = (place) => {
    inputSearch(place);
    toggleMenu();
    
  };

  useEffect(() => {
    setPlaces(getPlacesFromLocalStorage());
  }, []);
  return (
    <header
      className="bg-blue-1 w-full 
    
    "
    >
      <div
        className="flex w-[100%] pt-[18px] px-4  justify-between
      sm:w-[100%]
      "
      >
        <button
          className="bg-gray-3 h-10 max-sm:w-[161px]
          sm:w-[190px] transition duration-300 ease-in-out transform hover:bg-red-500 "
          onClick={toggleMenu}
          style={{ cursor: `url('/cursor (1).png'), auto` }}
        >
          Search for places 
        </button>
        <button
          className="flex justify-center items-center top-6 right-4 bg-gray-3 rounded-full p-3 w-[40px] h-[40px] transition duration-300 ease-in-out transform hover:bg-red-500 "
          onClick={cords}
          style={{ cursor: `url('/cursor (1).png'), auto` }}
        >
          <SignalIcon />
        </button>
      </div>

      <nav
        className={`${
          isMenuOpen ? "fixed" : "hidden"
        } w-[100%] top-0 left-0 right-0 bottom-0 md:w-[400px] bg-blue-1 text-center items-center justify-center z-50 overflow-auto no-scrollbar p-3 sm:w-[100%]`}
      >
        <button className="flex ml-auto p-4  hover:text-red-500 hover:scale-125" onClick={toggleMenu}  style={{ cursor: `url('/cursor (1).png'), auto` }}>
          <ExitIcon/>
        </button>
        <form className="flex gap-3" onSubmit={search}>
          <div
            className={`flex items-center gap-3 border w-full ${
              isFocused ? "border-red-500" : "border-gray-1"
            } pl-3 p-1`}
          >
            <SearchIcon />
            <input
              className="bg-transparent w-full py-2 focus:outline-none"
              placeholder="Ciudad"
              type="text"
              value={searchPlace}
              onChange={(event) => setSearchPlace(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-3 px-5 py-3 transition duration-300 ease-in-out transform hover:bg-red-500 "
            style={{ cursor: `url('/cursor (1).png'), auto` }}
          >
            Search
          </button>
        </form>
        <div className="flex flex-col py-10 gap-3"
        style={{ cursor: `url('/cursor (1).png'), auto` }}
        >
          {places?.map((place) => (
            <button
              className="flex w-full px-3 py-6 border hover:border border-transparent hover:border-gray-1 group"
              key={place}
              onClick={() => selectAndClose(place)}
              style={{ cursor: `url('/cursor (1).png'), auto` }}
            >
              <p>{place}</p>
              <span className="ml-auto hidden group-hover:block">
                <RightIcon />
              </span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
