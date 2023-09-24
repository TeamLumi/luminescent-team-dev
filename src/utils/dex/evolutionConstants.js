import { getItemString } from './item';
import { getMoveString } from './moves';
import { getPokemonName } from './name';
import { getTypeName } from './types';

function doNothing(evoMethod, evolutionDetails) {
  return [evolutionDetails, evoMethod];
};

export const REPLACE_STRING = "REPLACE";

export const EVOLUTION_METHOD_DETAILS = {
  0: {
    method: '',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  1: {
    method: 'Friendship',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  2: {
    method: 'Friendship + Day',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  3: {
    method: 'Friendship + Night',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  4: {
    method: `Level ${REPLACE_STRING}`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  5: {
    method: 'Trade',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  6: {
    method: `Trade with ${REPLACE_STRING}`,
    requiresLevel: false,
    parameterType: 'Item',
    function: getItemString,
  },
  7: {
    method: 'Karrablast/Shelmet Trade',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  8: {
    method: `Use ${REPLACE_STRING}`,
    requiresLevel: false,
    parameterType: 'Item',
    function: getItemString,
  },
  9: {
    method: `Level ${REPLACE_STRING} & Atk > Def`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  10: {
    method: `Level ${REPLACE_STRING} & Atk = Def`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  11: {
    method: `Level ${REPLACE_STRING} & Def > Atk`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  12: {
    method: `Level ${REPLACE_STRING} + RNG`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  13: {
    method: `Level ${REPLACE_STRING} + RNG`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  14: {
    method: `Level ${REPLACE_STRING} & Free Space + Poké Ball`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  15: {
    method: 'SPECIAL_NUKENIN',
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  16: {
    method: 'High Beauty',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  17: {
    method: `Use ${REPLACE_STRING} & Male`,
    requiresLevel: false,
    parameterType: 'Item',
    function: getItemString,
  },
  18: {
    method: `Use ${REPLACE_STRING} & Female`,
    requiresLevel: false,
    parameterType: 'Item',
    function: getItemString,
  },
  19: {
    method: `Hold ${REPLACE_STRING} & Day`,
    requiresLevel: true,
    parameterType: 'Item',
    function: getItemString,
  },
  20: {
    method: `Hold ${REPLACE_STRING} & Night`,
    requiresLevel: true,
    parameterType: 'Item',
    function: getItemString,
  },
  21: {
    method: `Knows ${REPLACE_STRING}`,
    requiresLevel: false,
    parameterType: 'Move',
    function: getMoveString,
  },
  22: {
    method: `${REPLACE_STRING} in party`,
    requiresLevel: false,
    parameterType: 'Pokemon',
    function: getPokemonName,
  },
  23: {
    method: `Level ${REPLACE_STRING} & Male`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  24: {
    method: `Level ${REPLACE_STRING} & Female`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  25: {
    method: 'Level Up in Magnetic Field',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  26: {
    method: 'Level Up By Moss Rock',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  27: {
    method: 'Level Up By Ice Rock',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  28: {
    method: 'Level Up & Device Upside-Down',
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  29: {
    method: `Friendship + ${REPLACE_STRING} Move`,
    requiresLevel: false,
    parameterType: 'Typing',
    function: getTypeName,
  },
  30: {
    method: `Level ${REPLACE_STRING} + Dark-Type in Party`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  31: {
    method: `Level ${REPLACE_STRING} in Rain`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  32: {
    method: `Level ${REPLACE_STRING} During Day`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  33: {
    method: `Level ${REPLACE_STRING} During Night`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  34: {
    method: 'On LvUp: Lv ≥ LvReq & is female → set form to 1',
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  35: {
    method: 'FRIENDLY',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  36: {
    method: 'On LvUp: Lv ≥ LvReq & is game version',
    requiresLevel: true,
    parameterType: 'GameVersion',
    function: doNothing,
  },
  37: {
    method: 'On LvUp: Lv ≥ LvReq & is game version & is day',
    requiresLevel: true,
    parameterType: 'GameVersion',
    function: doNothing,
  },
  38: {
    method: 'On LvUp: Lv ≥ LvReq & is game version & is night',
    requiresLevel: true,
    parameterType: 'GameVersion',
    function: doNothing,
  },
  39: {
    method: 'Level Up on Summit',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  40: {
    method: `Level ${REPLACE_STRING} 7:00-7:59PM`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  41: {
    method: `Level ${REPLACE_STRING} & Non-Native region`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  42: {
    method: `Use ${REPLACE_STRING} & Non-Native region`,
    requiresLevel: false,
    parameterType: 'Item',
    function: getItemString,
  },
  43: {
    method: "3 Crits in One Battle",
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  44: {
    method: 'Galarian Yamask Evolution',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  45: {
    method: 'PokéSafe Blender',
    requiresLevel: false,
    parameterType: 'None',
    function: doNothing,
  },
  46: {
    method: `Level ${REPLACE_STRING} & Amped Nature`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
  47: {
    method: `Level ${REPLACE_STRING} & Low-Key Nature`,
    requiresLevel: true,
    parameterType: 'None',
    function: doNothing,
  },
};