const { itemNames, ItemTable, itemInfo } = require('./data');
const { getMoveProperties } = require('./moves');

function getItemIdFromItemName(itemName) {
  if (!itemName) throw Error(`Bad item name: ${itemName}`);
  if (itemName === "King's Rock")
    return itemNames.labelDataArray.findIndex((e) => e.wordDataArray[0]?.str === 'King’s Rock');
  const index = itemNames.labelDataArray.findIndex((e) => e.wordDataArray[0]?.str === itemName);
  if (index === -1) throw Error(`Bad item name: ${itemName}`);
  return index;
}

function getItemString(itemId = 0) {
  return itemNames.labelDataArray[itemId].wordDataArray[0].str;
}

function getItemImageUrl(itemName="") {
  const splitItemName = itemName.replace("’", "").split(" ").join("_");
  return `/img/items/Item_${splitItemName}.webp`;
}

function getTMImageUrl(moveType="") {
  return `/img/tms/${moveType}.webp`
}

function getItemPocket(itemNo) {
  if (!itemNo) throw Error(`Bad item name: ${itemNo}`);
  console.log(ItemTable.Item[itemNo]);
  return ItemTable.Item[itemNo].fld_pocket;
}

function getTMInfoFromItemNo(itemNo) {
  const wazaMachine = ItemTable.WazaMachine.find(machine => machine.itemNo === itemNo);
  return wazaMachine ? {...getMoveProperties(wazaMachine.wazaNo), tmNo: wazaMachine.machineNo} : null;
}

function getTMInfoFromTMNo(TMNo=0) {
  const { wazaNo } = ItemTable.WazaMachine[TMNo-1];
  return getMoveProperties(wazaNo);
}

function getItemInfo(itemId = 0) {
  const wordData = itemInfo.labelDataArray[itemId].wordDataArray;
  if (wordData === null || wordData === undefined || wordData.length === 0) return 'None';
  const description = wordData.reduce((itemDescription, currentString) => {
    return itemDescription + currentString.str + ' ';
  }, '');

  return description.trim();
}

module.exports = {
  getItemIdFromItemName,
  getItemString,
  getItemImageUrl,
  getTMImageUrl,
  getTMInfoFromTMNo,
  getTMInfoFromItemNo,
  getItemPocket,
  getItemInfo,
};
