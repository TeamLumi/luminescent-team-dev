import React, { useEffect, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { useColorMode } from '@docusaurus/theme-common';

import { coordinates } from './coordinates';
import Encounters from './Encounters';
import { SearchBar } from './SearchBar';
import { RodButtons, TimeOfDayButtons } from './Buttons';
import SettingsModal from './SettingsModal';
import './style.css';

import {
  getAreaEncounters,
  getTrainersFromZoneName,
  getFieldItemsFromZoneID,
  getHiddenItemsFromZoneID,
  getPokemonIdFromName
} from '../../utils/dex';
import { getZoneIdFromZoneName } from '../../utils/dex/location';
import {
  getFixedShops,
  getItemPrice,
  getItemString,
  getRegularShopItems,
  getScriptItems,
  getFixedShopsItems,
  getHeartScaleShopItems
} from '../../utils/dex/item';
import {
  getAllGroundEncounters,
  getTimeOfDayEncounters,
  getAllRodEncounters,
  getAllSurfingEncounters,
  getRadarEncounter,
  getSurfingIncenseEncounter,
  getSwarmEncounter,
  getAllIncenseEncounters,
  getRoutesFromPokemonId
} from '../../utils/dex/encounters';

function getSelectedLocation(x, y) {
  const location = coordinates.filter(coords => {
    return (coords.x <= x && x <= (coords.x + coords.w)) &&
      (coords.y <= y && y <= (coords.y + coords.h))
  });
  if (location.length === 0) return "";
  return location[0];
}

function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}

const canvasDimensions = {
  width: 1244,
  height: 720
}

export const Mapper = ({ pokemonList }) => {
  const [currentCoordinates, setCoordinates] = useState({ x: 0, y: 0 })
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredZone, setHoveredZone] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [encOptions, setEncOptions] = useState({
    swarm: false,
    radar: false,
    timeOfDay: "1",
    incense: false,
    rod: "1",
  });

  const [pokemonName, setPokemonName] = useState('');
  const completedPokemonName = useDebouncedValue(pokemonName, 1500);

  const [locationList, setLocationList] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [colors, setColors] = useState({
    hov: { r: 247, g: 148, b: 72, a: 0.7 },
    sel: { r: 72, g: 113, b: 247, a: 0.8 },
    enc: { r: 247, g: 235, b: 72, a: 0.7 },
  });

  const [encounterList, setEncounterList] = useState({GroundEnc: [], SurfEnc: [], RodEnc: []});
  const [trainerList, setTrainerList] = useState([]);
  const [fieldItemsList, setFieldItems] = useState([]);
  const [hiddenItemsList, setHiddenItems] = useState([]);
  const [shopItemsList, setShopItems] = useState([]);
  const [scriptItemsList, setScriptItems] = useState([]);
  const [fixedShopList, setFixedShops] = useState([]);
  const [heartScaleShopList, setHeartScaleShop] = useState([]);

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100); // Update every 100 milliseconds (adjust as needed for your animation speed)

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    setEncounterList(setAllEncounters(locationName))
  }, [encOptions])

  useEffect(() => {
    setLocationList(getRoutesFromPokemonId(getPokemonIdFromName(completedPokemonName)))
  }, [completedPokemonName])

  const handleOptionChange = (option, value) => {
    setEncOptions({
      ...encOptions,
      [option]: value,
    });
  };

  const handlePokemonNameChange = (pokemonName) => {
    setPokemonName(pokemonName);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const myCanvas = useRef();
  const { colorMode, setColorMode } = useColorMode();

  const setAllEncounters = (location_name) => {
    const areaEncounters = getAreaEncounters(location_name)
    if (!areaEncounters) {
      return {GroundEnc: [], SurfEnc: [], RodEnc: []}
    }
    const allGroundEnc = getAllGroundEncounters(areaEncounters);
    const swarmEnc = getSwarmEncounter(areaEncounters);
    const radarEnc = getRadarEncounter(areaEncounters);
    const timeOfDayEnc = getTimeOfDayEncounters(areaEncounters);
    const incenseEnc = getAllIncenseEncounters(areaEncounters);
    const allSurfEnc = getAllSurfingEncounters(areaEncounters);
    const surfIncenseEnc = getSurfingIncenseEncounter(areaEncounters);

    // This section is for the grass encounters only
    if (allGroundEnc.length > 0) {
      if (encOptions.swarm) {
        allGroundEnc[0] = swarmEnc[0]
      }
      if (encOptions.radar) {
        allGroundEnc[9] = allGroundEnc[1]
        allGroundEnc[9].encounterRate = "4%"
        allGroundEnc[1] = radarEnc[0]
      }
      if (encOptions.timeOfDay === "2") {
        allGroundEnc[2] = timeOfDayEnc[0]
        allGroundEnc[3] = timeOfDayEnc[1]
      } else if (encOptions.timeOfDay === "3") {
        allGroundEnc[2] = timeOfDayEnc[2]
        allGroundEnc[3] = timeOfDayEnc[3]
      }
      if (encOptions.incense && incenseEnc.length > 0) {
        allGroundEnc[10] = allGroundEnc[4]
        allGroundEnc[11] = allGroundEnc[5]
        allGroundEnc[10].encounterRate = "1%"
        allGroundEnc[11].encounterRate = "1%"
        allGroundEnc[4] = incenseEnc[0]
        allGroundEnc[5] = incenseEnc[1]
      }
    }

    // This section is for the surfing encounters only
    if(allSurfEnc.length > 0) {
      if (encOptions.incense) {
        allSurfEnc[1] = surfIncenseEnc[0]
      }
    }

    // This section is for the Rod Encounters only
    const rodEnc = getAllRodEncounters(areaEncounters, encOptions.rod)

    return{GroundEnc: allGroundEnc, SurfEnc: allSurfEnc, RodEnc: rodEnc}
  }

  const drawPulse = (ctx, x, y, w, h) => {
    const pulseSpeed = .0025; // Adjust the speed of the pulse effect
    const maxPulseSize = 10; // Adjust the maximum size of the pulse effect
  
    let pulseSize = (Math.sin(currentTime * pulseSpeed) + 1) * 0.25 * maxPulseSize;
  
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)'; // Adjust color and opacity of the pulse effect
    ctx.lineWidth = 3;
  
    ctx.strokeRect(x - pulseSize / 2, y - pulseSize / 2, w + pulseSize, h + pulseSize);
    ctx.restore();
  };
  
  const drawOverlay = (ctx) => {
    coordinates.forEach(coord => {
      // Draw zone outlines
      ctx.beginPath();
      ctx.moveTo(coord.x, coord.y);
      ctx.lineTo(coord.x + coord.w, coord.y);
      ctx.lineTo(coord.x + coord.w, coord.y + coord.h);
      ctx.lineTo(coord.x, coord.y + coord.h);
      ctx.closePath();
      if (locationList.includes(coord.name)) { // locationList is the list of locations you can find mons
        drawPulse(ctx, coord.x, coord.y, coord.w, coord.h);
        ctx.fillStyle = `rgba(${colors.enc.r}, ${colors.enc.g}, ${colors.enc.b}, ${colors.enc.a})`;
        ctx.fill();
      }
      if (hoveredZone === coord.name && hoveredZone !== locationName) {
        ctx.fillStyle = `rgba(${colors.hov.r}, ${colors.hov.g}, ${colors.hov.b}, ${colors.hov.a})`;
        ctx.fill();
      }
      if (locationName === coord.name) {
        ctx.fillStyle = `rgba(${colors.sel.r}, ${colors.sel.g}, ${colors.sel.b}, ${colors.sel.a})`;
        ctx.fill();
      }

      ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
      ctx.lineWidth = hoveredZone === coord.name ? 2.3 : 1;
      ctx.stroke();
    });
  };

  useEffect(() => {
    const context = myCanvas.current.getContext('2d');
    const image = new Image();
    image.src = require('@site/static/img/sinnoh-updated.png').default;
    image.onload = () => {
      context.drawImage(image, 0, 0);
      drawOverlay(context);
    };

    const handleClick = (event) => {
      const rect = myCanvas.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setCoordinates({ x,y });
      const location = getSelectedLocation( x,y )
      const location_name = location.name ? location.name : ""
      setLocationName(location_name);
      setEncounterList(setAllEncounters(location_name));
      setTrainerList(getTrainersFromZoneName(location_name));

      const zoneId = getZoneIdFromZoneName(location_name);
      setFieldItems(getFieldItemsFromZoneID(zoneId));
      setHiddenItems(getHiddenItemsFromZoneID(zoneId));
      setShopItems(getRegularShopItems(zoneId));
      setScriptItems(getScriptItems(zoneId));
      setFixedShops(getFixedShops(zoneId));
      setHeartScaleShop(getHeartScaleShopItems(zoneId));
    };

    myCanvas.current.addEventListener('click', handleClick);
    myCanvas.current.addEventListener('mousemove', handleMouseMove);
    myCanvas.current.addEventListener('mouseleave', handleMouseLeave);
    
    // Clean up the event listener when the component is unmounted
    return () => {
      myCanvas.current.removeEventListener('click', handleClick);
      myCanvas.current.removeEventListener('mousemove', handleMouseMove);
      myCanvas.current.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [encOptions, pokemonName, locationName, hoveredZone, locationList, currentTime])

  function handleMouseMove(event) {
    const rect = myCanvas.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCursorPosition({ x, y });
    const location = getSelectedLocation(x, y);
    if (location) {
      setHoveredZone(location.name);
    }
  }

  const handleMouseLeave = () => {
    // Clear the hovered zone when mouse leaves
    setHoveredZone(null);
  };

  return (
    <div className="content">
      <div className="canvasCol">
        <canvas
          ref={myCanvas}
          height={`${canvasDimensions.height}px`}
          width={`${canvasDimensions.width}px`}
        >
          Your browser does not support the canvas element.
        </canvas>
        <Encounters
          encOptions={encOptions}
          handleOptionChange={handleOptionChange}
          encounterList={encounterList}
          pokemon={completedPokemonName}
        />
      </div>
      <SearchBar
        canvasDimensions={canvasDimensions}
        pokemonList={pokemonList}
        debouncedText={pokemonName}
        handleDebouncedTextChange={handlePokemonNameChange}
        locationName={locationName}
        setLocationName={setLocationName}
      />
      <IconButton color="primary" aria-label="settings" onClick={handleShowSettings}>
        <SettingsIcon />
      </IconButton>
      <div>
        <div>
          {`Current Coords: ${cursorPosition.x}, ${cursorPosition.y}`}
        </div>
        Trainers: 
        {trainerList && trainerList.map((trainer, index) => (
          <div key={index}>
            {`${trainer.team_name}, ${trainer.trainerType}, ${trainer.route}`}
          </div>
        ))}
      </div>
      <div>
        Field Items: 
        {fieldItemsList && fieldItemsList.map((fieldItem, index) => (
          <div key={index}>
            {`${getItemString(fieldItem)}`}
          </div>
        ))}
      </div>
      <div>
        Hidden Items: 
        {hiddenItemsList && hiddenItemsList.map((hiddenItem, index) => (
          <div key={index}>
            {`${getItemString(hiddenItem)}`}
          </div>
        ))}
      </div>
      <div>
        Scripted Items: 
        {scriptItemsList && scriptItemsList.map((scriptItem, index) => (
          <div key={index}>
            {`${getItemString(scriptItem)}`}
          </div>
        ))}
      </div>
      <div>
        Shop Items:
        {shopItemsList && shopItemsList.map((shopItem, index) => (
          <div key={index}>
            {`${getItemString(shopItem.ItemNo)} `}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Pok%C3%A9mon_Dollar_sign.svg/73px-Pok%C3%A9mon_Dollar_sign.svg.png"
              height="12px"
              style={{filter: colorMode === "dark" ? "invert(80%)" : "invert(0%)"}}
            />
            {` ${getItemPrice(shopItem.ItemNo)}`}
            {shopItem.BadgeNum > 0 && (
              ` (${shopItem.BadgeNum}+ Badges)`
            )}
          </div>
        ))}
      </div>
      <div>
        {fixedShopList && fixedShopList.map((section, index) => (
          <div key={index}>
            {`${section.sectionTitle} Items:`}
            {section.items && section.items.map((shop, itemIndex) => (
              <div key={itemIndex}>
                {getFixedShopsItems(shop).map((itemNo, itemNoIndex) => (
                  <div key={itemNoIndex}>
                    {`${getItemString(itemNo)} `}
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Pok%C3%A9mon_Dollar_sign.svg/73px-Pok%C3%A9mon_Dollar_sign.svg.png"
                      height="12px"
                      style={{filter: colorMode === "dark" ? "invert(80%)" : "invert(0%)"}}
                    />
                    {` ${getItemPrice(itemNo)}`}

                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        Heart Scale Shop Items: 
        {heartScaleShopList && heartScaleShopList.map((heartScaleItem, index) => (
          <div key={index}>
            {`${getItemString(heartScaleItem.ItemNo)} Price: ${heartScaleItem.Price} Heart Scale(s)`}
          </div>
        ))}
      </div>
      <SettingsModal
        colors={colors}
        setColors={setColors}
        showModal={showSettings}
        onHide={handleCloseSettings}
      />
    </div>
  );
}
