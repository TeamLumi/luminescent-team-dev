const { getItemIdFromItemName, getItemString, getItemImageUrl, getTMImageUrl, getTMInfoFromItemNo } = require('./item');
const { getPokemonInfo } = require('./info');
const fs = require('fs');
const path = require('path');
const { getPokemon } = require('./pokemon');
const { FORM_MAP, isValidPokemon } = require('./functions');
const {
  GAMEDATA2,
  GAMEDATA3,
  GAMEDATAV,
  FieldItems,
  HiddenItems,
  ItemMap,
  ItemInfo
} = require('../../../__gamedata');
const { isTMItem } = require('../../../src/utils/dex/moves');
const { getTypeName } = require('./types');

function getItemIds(data) {
  if (Array.isArray(data)) {
    return data.flatMap(getItemIds);
  }
  if (data === null || typeof data !== 'object') {
    return typeof data === 'number' ? [data] : [];
  }
  if (Object.hasOwn(data, 'itemId')) {
    return getItemIds(data.itemId);
  }
  return Object.values(data).flatMap(getItemIds);
}

describe('Dex utils Item getter tests', () => {
  describe('getItemIdFromItemName', () => {
    test('should throw an error if no item name is given', () => {
      expect(() => getItemIdFromItemName()).toThrow('Bad item name: undefined');
    });

    test('should return the correct ID for a valid item name', () => {
      const itemName = 'Leftovers';
      const expected = 234;
      const actual = getItemIdFromItemName(itemName);
      expect(actual).toBe(expected);
    });

    test('should throw an error for an invalid item name', () => {
      const itemName = 'Fake Item';
      expect(() => getItemIdFromItemName(itemName)).toThrow(Error(`Bad item name: ${itemName}`));
    });
  });

  describe('getItemString', () => {
    test('should return the correct item name string for a given item ID', () => {
      const itemId = 234;
      const expected = 'Leftovers';
      const actual = getItemString(itemId);
      expect(actual).toBe(expected);
    });
  });

  describe('getItemImages', () => {
    test('should return the correct item image url for a given item string', () => {
      const itemName = 'Leftovers';
      const expected = '/img/items/Item_Leftovers.webp';
      const actual = getItemImageUrl(itemName);
      expect(actual).toBe(expected);
    });

    test('should return the correct item image url for an item name that is split with a space', () => {
      const itemName = 'Macho Brace';
      const expected = '/img/items/Item_Macho_Brace.webp';
      const actual = getItemImageUrl(itemName);
      expect(actual).toBe(expected);
    });

    test('should return the correct item image url for an item name that is split with an apostrophe', () => {
      const itemName = "King’s Rock";
      const expected = '/img/items/Item_Kings_Rock.webp';
      const actual = getItemImageUrl(itemName);
      expect(actual).toBe(expected);
    });

    test('should have an image for all wild held items', () => {
      const getFullPath = (itemUrl) => {
        return `./static${itemUrl}`;
      }
      const nonItemList = [];

      for (let pokemonId = 1; pokemonId < 1465; pokemonId++) {
        const pokemonInfo = getPokemonInfo(0, pokemonId);
        const held_item1 = getItemString(pokemonInfo.held_item1);
        const held_item2 = getItemString(pokemonInfo.held_item2);
        const held_item3 = getItemString(pokemonInfo.held_item3);

        const itemImageUrl1 = getItemImageUrl(held_item1);
        const itemImageUrl2 = getItemImageUrl(held_item2);
        const itemImageUrl3 = getItemImageUrl(held_item3);

        const itemImagePath1 = getFullPath(itemImageUrl1);
        const itemImagePath2 = getFullPath(itemImageUrl2);
        const itemImagePath3 = getFullPath(itemImageUrl3);

        const itemImageList = [itemImagePath1, itemImagePath2, itemImagePath3]

        itemImageList.forEach((itemImagePath) => {
          if (!itemImagePath.includes("None")) {
            fs.access(itemImagePath, fs.constants.F_OK, (err) => {
              if (err && !nonItemList.includes(itemImagePath)) {
                nonItemList.push(itemImagePath);
              }
            // Uncomment the line below to log any missing items.
            // console.log(nonItemList)
            });
          }
        });
      }
    });

    test('should have an image for all field, hidden, and mapped items', () => {
      const itemDatasets = [
        ['FieldItems', FieldItems],
        ['HiddenItems', HiddenItems],
        ['ItemMap', ItemMap]
      ];
      const gameModes = [GAMEDATAV, GAMEDATA2, GAMEDATA3];
      const missingImages = [];

      itemDatasets.forEach(([datasetName, datasetByMode]) => {
        gameModes.forEach((mode) => {
          const itemIds = getItemIds(datasetByMode[mode]);
          itemIds.forEach((itemId) => {
            const itemName = getItemString(itemId, mode);
            if (itemName === 'None') return;

            let moveType = null;
            const isTM = isTMItem(itemId, mode);
            if (isTM) {
              const moveInfo = getTMInfoFromItemNo(itemId, mode);
              moveType = getTypeName(moveInfo.type, mode);
            }
            const imageUrl = isTM ? getTMImageUrl(moveType) : getItemImageUrl(itemName);
            const imagePath = path.resolve(
              __dirname,
              '../../../static',
              imageUrl.slice(1)
            );
            if (!fs.existsSync(imagePath)) {
              missingImages.push(
                `${datasetName} (${mode}): item ${itemId} (${itemName}) -> ${imageUrl}`
              );
            }
          });
        });
      });

      expect(missingImages).toEqual([]);
    });
  });
});

function getAllItemImageData(onlyValidPokemons = false, mode = GAMEDATA2) {
  const pokemonImageData = [];
  const ModeFormMap = FORM_MAP[mode];
  const pokemons = Object.values(ModeFormMap)

  for (const pokemon of pokemons) {
    for (let i = 0; i < pokemon.length; i++) {
      const pokemonId = pokemon[i];
      const validPokemon = isValidPokemon(pokemonId, mode);
      if (onlyValidPokemons && !validPokemon) {
        continue;
      }
      const pokemonInfo = getPokemon(pokemonId, mode);
      const itemImageUrl1 = pokemonInfo.item1 !== "None" ? getItemImageUrl(pokemonInfo.item1) : null;
      const itemImageUrl2 = pokemonInfo.item2 !== "None" ? getItemImageUrl(pokemonInfo.item2) : null;
      const itemImageUrl3 = pokemonInfo.item3 !== "None" ? getItemImageUrl(pokemonInfo.item3) : null;

      if (itemImageUrl1 !== null) {
        pokemonImageData.push([itemImageUrl1, pokemonInfo.name, "1"]);
      }
      if (itemImageUrl2 !== null) {
        pokemonImageData.push([itemImageUrl2, pokemonInfo.name, "2"]);
      }
      if (itemImageUrl3 !== null) {
        pokemonImageData.push([itemImageUrl3, pokemonInfo.name, "3"]);
      }
    }
  }

  return pokemonImageData;
}

test.skip.each([...getAllItemImageData(true, "2.0")])('2.0 Item image %s for %s slot %s does not exist', (filename, formName, slot, done) => {
  const imgFilePath = path.join(__dirname, '../../../static', filename);
  fs.access(imgFilePath, fs.constants.F_OK, (err) => {
    let fileExists = true;
    if (err) {
      fileExists = false;
    }

    try {
      expect(fileExists).toBe(true);
      done();
    } catch (err) {
      done(err);
    }
  });
});

test.skip.each([...getAllItemImageData(true, "3.0")])('3.0 Item image %s for %s slot %s does not exist', (filename, formName, slot, done) => {
  const imgFilePath = path.join(__dirname, '../../../static', filename);
  fs.access(imgFilePath, fs.constants.F_OK, (err) => {
    let fileExists = true;
    if (err) {
      fileExists = false;
    }

    try {
      expect(fileExists).toBe(true);
      done();
    } catch (err) {
      done(err);
    }
  });
});
