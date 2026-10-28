import { getFixedShopsItems, getHeartScaleShopItems, getItemIdFromItemName, getItemString } from './item';
import { itemNames, ShopTable, ItemTable, ItemMap, FixedShop, field_items, hidden_items } from '../../../__gamedata';
import { getZoneNameFromZoneCode, getZoneNameFromZoneIdCSV } from './location';
import { getItemImageUrl } from '../../../plugins/pokedex-data-plugin/dex/item';
import { ConstructionOutlined } from '@mui/icons-material';

const fs = require('fs');
const path = require('path');

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
});

function getRegularShopItemImageData(mode = "2.0") {
  const itemImageData = {};
  const modeShopTable = ShopTable[mode];

  modeShopTable.FS.map((itemEntry) => {
    let zoneName = "BaseShop"
    if (itemEntry.ZoneID !== -1) {
      zoneName = getZoneNameFromZoneIdCSV(itemEntry.ZoneID);
    }
    const itemUrl = getItemImageUrl(getItemString(itemEntry.ItemNo));
    if (!itemImageData.hasOwnProperty(zoneName)) {
      itemImageData[zoneName] = [itemUrl];
    } else if (itemImageData.hasOwnProperty(zoneName)) {
      itemImageData[zoneName].push(itemUrl);
    }
  });

  return itemImageData;
}

Object.entries(getRegularShopItemImageData("2.0")).forEach(([zoneName, itemImageArray]) => {
  test.skip.each([...itemImageArray])(`2.0 Regular Shop Image %s does not exist in ${zoneName}`, (filename, done) => {
    if (filename.includes("_TM") || filename.includes("_TR")) {
      return done()
    }
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
  })
})

function getFixedShopItemImageData(mode = "2.0") {
  const itemImageData = {};
  const modeFixedShop = FixedShop[mode];

  Object.keys(modeFixedShop).forEach(zoneCode => {
    const zoneName = getZoneNameFromZoneCode(zoneCode);
    const shopId = modeFixedShop[zoneCode];
    const itemArray = getFixedShopsItems(shopId);
    const itemUrls = itemArray.map((item) => (getItemImageUrl(getItemString(item))))
    itemImageData[zoneName] = itemUrls
  })

  return itemImageData;
}

Object.entries(getFixedShopItemImageData("2.0")).forEach(([zoneName, itemImageArray]) => {
  test.skip.each([...itemImageArray])(`2.0 Item Image %s does not exist in ${zoneName}`, (filename, done) => {
    if (filename.includes("_TM") || filename.includes("_TR")) {
      return done()
    }
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
  })
})

function getHeartScaleItemImageData(mode = "2.0") {
  const heartScaleItems = getHeartScaleShopItems(110, mode);

  const item_images = heartScaleItems.map((itemObject) => {
    const itemId = itemObject.ItemNo;
    const itemName = getItemString(itemId);
    const itemUrl = getItemImageUrl(itemName);
    return itemUrl
  });

  return item_images;
}

test.skip.each([...getHeartScaleItemImageData("2.0")])(`2.0 Item Image %s does not exist in Heart Scale Shop`, (filename, done) => {
  if (filename.includes("_TM") || filename.includes("_TR")) {
    return done()
  }
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
})
