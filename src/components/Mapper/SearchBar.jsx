import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import Fuse from 'fuse.js';

const trainerFilterOptions = createFilterOptions({
  limit: 100,
});

import { getLocationCoordsFromName, getLocationNames } from './coordinates';
import './style.css';

const PokemonSearchInput = ({
  allPokemons,
  setDebouncedText,
  selectedPokemon,
  setSelectedPokemon,
}) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText, setDebouncedText]);

  const handlePokemonNameChange = (_, value, reason) => {
    if (reason !== "clear" && value) {
      setSelectedPokemon(value);
      setSearchText(value?.name ?? "");
    } else {
      setSelectedPokemon(null);
      setSearchText("");
    }
  };

  const handleInputChange = (_, value) => {
    setSearchText(value);
  };

  return (
    <div className="monSearchBar">
      <Autocomplete
        id="pokemon-search-input"
        clearOnBlur={false}
        blurOnSelect
        options={allPokemons}
        getOptionLabel={(option) => option.name}
        value={selectedPokemon}
        onChange={handlePokemonNameChange}
        inputValue={searchText}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Pokémon Location"
            fullWidth
          />
        )}
      />
    </div>
  );
};

const LocationNameDropdown = ({
  locationName,
  setLocationName,
  setLocationZoneId,
  canvasRef
}) => {
  const locations = getLocationNames();
  const handleLocationChange = (e, value, reason) => {
    if (reason !== "clear" && value) {
      setLocationName(value);
      const location = getLocationCoordsFromName(value);
      setLocationZoneId(location?.zoneId);
    } else {
      setLocationName(null);
      setLocationZoneId(null);
    }
  };

  const defaultOption = locations.length > 0 ? locations[0] : '';
  return (
    <div className="location">
      <Autocomplete
        id="location-input"
        clearOnBlur={false}
        blurOnSelect
        options={locations}
        getOptionLabel={(option) => option}
        value={locationName}
        onChange={handleLocationChange}
        inputValue={locationName ?? ""}
        onInputChange={(_, value) => {
          setLocationName(value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Current Location"
            fullWidth
          />
        )}
      />
    </div>
  );
};

const TrainerSearchInput = ({
  allTrainers,
  onTrainerSelect,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const handleTrainerChange = (_, value, reason) => {
    if (reason !== "clear" && value) {
      setSelectedTrainer(value);
      setSearchText(value.label);
      onTrainerSelect(value);
    } else {
      setSelectedTrainer(null);
      setSearchText("");
    }
  };

  const handleInputChange = (_, value) => {
    setSearchText(value);
  };

  return (
    <div className="monSearchBar">
      <Autocomplete
        id="trainer-search-input"
        clearOnBlur={false}
        blurOnSelect
        options={allTrainers}
        filterOptions={trainerFilterOptions}
        getOptionLabel={(option) => option.label}
        value={selectedTrainer}
        onChange={handleTrainerChange}
        inputValue={searchText}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Trainer"
            fullWidth
          />
        )}
      />
    </div>
  );
};

const SettingsButton = ({handleShowSettings}) => {
  return (
    <div className="settings">
      <IconButton aria-label="settings" onClick={handleShowSettings}>
        <SettingsIcon />
      </IconButton>
    </div>
  );
}

export const SearchBar = ({
  canvasDimensions,
  pokemonList,
  handleDebouncedTextChange,
  locationName,
  setLocationName,
  setLocationZoneId,
  canvasRef,
  selectedPokemon,
  setSelectedPokemon,
  handleShowSettings,
  allTrainers,
  onTrainerSelect,
}) => {
  return (
    <div
      className="infoCol"
      style={{
        width: `${canvasDimensions.width}px`,
        height: `${canvasDimensions.height}px`
      }}
    >
      <PokemonSearchInput
        allPokemons={pokemonList}
        setDebouncedText={handleDebouncedTextChange}
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
      />
      <TrainerSearchInput
        allTrainers={allTrainers}
        onTrainerSelect={onTrainerSelect}
      />
      <LocationNameDropdown
        locationName={locationName}
        setLocationName={setLocationName}
        setLocationZoneId={setLocationZoneId}
      />
      <SettingsButton handleShowSettings={handleShowSettings} />
    </div>
  )
};