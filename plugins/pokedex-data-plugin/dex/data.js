//All the constant numbers
const PersonalTable = require('../../../__gamedata/PersonalTable.json');
const GrowTable = require('../../../__gamedata/GrowTable.json');
const EvolveTable = require('../../../__gamedata/EvolveTable.json');
const EggMovesTable = require('../../../__gamedata/TamagoWazaTable.json');
const LearnsetTable = require('../../../__gamedata/WazaOboeTable.json');
const MovesTable = require('../../../__gamedata/WazaTable.json');
const ItemTable = require('../../../__gamedata/ItemTable.json');
const EvolutionData = require('../../../__gamedata/evolution.json');

//All the Location files
const displayNames =  require('../../../__gamedata/english_dp_fld_areaname_display.json');
const areaNames =  require('../../../__gamedata/english_dp_fld_areaname.json');
const mapInfo =  require('../../../__gamedata/MapInfo.json');
const encounterLocations =  require('../../../__gamedata/encounter_locations.json');
const pokemonLocations =  require('../../../__gamedata/pokemon_locations.json');
const trainerLocations =  require('../../../__gamedata/Mapper_Trainer_Output.json');
const field_items =  require('../../../__gamedata/item_list.json');
const hidden_items =  require('../../../__gamedata/hide_item_list.json');
const staticLocations =  require('../../../__gamedata/static_pokemon_locations.json');
const staticAreaLocations =  require('../../../__gamedata/static_area_locations.json');

//All the Pokemon english files
const basePokemonNames = require('../../../__gamedata/english_ss_monsname.json');
const formPokemonNames = require('../../../__gamedata/english_ss_zkn_form.json');
const pokemonHeight = require('../../../__gamedata/english_ss_zkn_height.json');
const pokemonWeight = require('../../../__gamedata/english_ss_zkn_weight.json');
const pokemonDexType = require('../../../__gamedata/english_ss_zkn_type.json');
const pokemonPokedexInfo = require('../../../__gamedata/english_dp_pokedex_diamond.json');

//All the other english files
const natureNames = require('../../../__gamedata/english_ss_seikaku.json');
const abilityNames = require('../../../__gamedata/english_ss_tokusei.json');
const abilityInfo = require('../../../__gamedata/english_ss_tokuseiinfo.json');
const typeName = require('../../../__gamedata/english_ss_typename.json');
const moveNames = require('../../../__gamedata/english_ss_wazaname.json');
const moveInfo = require('../../../__gamedata/english_ss_wazainfo.json');
const itemNames = require('../../../__gamedata/english_ss_itemname.json');
const itemInfo = require('../../../__gamedata/english_ss_iteminfo.json');

//Custom files
const moveEnum = require('../../../__gamedata/moveEnum.json');
const smogonMoves = require('../../../__gamedata/smogonMoves.json');
const tutorMoves = require('../../../__gamedata/tutorMoves.json');

module.exports = {
  PersonalTable,
  GrowTable,
  EvolveTable,
  EggMovesTable,
  LearnsetTable,
  MovesTable,
  EvolutionData,
  basePokemonNames,
  formPokemonNames,
  pokemonHeight,
  pokemonWeight,
  pokemonDexType,
  pokemonPokedexInfo,
  natureNames,
  abilityNames,
  abilityInfo,
  typeName,
  moveNames,
  moveInfo,
  ItemTable,
  itemInfo,
  itemNames,
  moveEnum,
  smogonMoves,
  tutorMoves,
  displayNames,
  areaNames,
  mapInfo,
  encounterLocations,
  pokemonLocations,
  trainerLocations,
  field_items,
  hidden_items,
  staticLocations,
  staticAreaLocations,
};
