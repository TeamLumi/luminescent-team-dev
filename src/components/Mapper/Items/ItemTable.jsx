import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

import "../style.css";
import {
  getItemImageUrl,
  getItemInfo,
  getItemPocket,
  getItemString,
  getTMImageUrl,
  getTMInfoFromItemNo
} from '../../../../plugins/pokedex-data-plugin/dex/item';
import { ImageWithFallback } from '../../common/ImageWithFallback';
import { getTypeName } from '../../../../plugins/pokedex-data-plugin/dex/types';
import { GROUP_NAMES } from '../../../../plugins/pokedex-data-plugin/dex/itemConstants';
import { GAMEDATA3 } from '../../../../__gamedata';

const ItemTable = ({ itemList, selectedItem, showQuantity = false, showLocation = false }) => {
  const { colorMode, setColorMode } = useColorMode();
  const highlightColor =
    colorMode === 'dark' ? 'highlight-dark-row' : 'highlight-light-row';
  if (itemList.length === 0) {
    return (
      <Typography sx={{display: "flex", justifyContent: "center"}}>Nothing to see here.</Typography>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="74px">Icon{showQuantity && (" & Qty")}</TableCell>
            <TableCell>Name</TableCell>
            <TableCell width={"50%"}>
              {showLocation
                ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    Location
                    <Link
                      to="https://www.nexusmods.com/pokemonbdsp/mods/1"
                      aria-label="View location information on Nexus Mods"
                      title="View location information on Nexus Mods"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{display: "flex"}}
                    >
                      <HelpIcon fontSize="small" />
                    </Link>
                  </span>
                )
                : "Description"
              }
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemList.flatMap((item, index) => {
            const itemOptions = Array.isArray(item?.itemId) ? item.itemId : [item];

            return itemOptions.map((itemOption, itemOptionIndex) => {
              const flattenedItem =
                item && typeof item === "object" ? { ...item } : { itemId: item };
              if (itemOption && typeof itemOption === "object") {
                Object.assign(flattenedItem, itemOption);
              }
              flattenedItem.itemId =
                itemOption && typeof itemOption === "object"
                  ? itemOption.itemId
                  : itemOption;
              const itemId = flattenedItem.itemId;

              let itemName = "";
              let itemSource = "";
              const itemDescription = getItemInfo(itemId, GAMEDATA3);
              const tmInfo = getTMInfoFromItemNo(itemId, GAMEDATA3)
              if (tmInfo) {
                itemName = `TM${tmInfo.tmNo} ${tmInfo.name}`;
                itemSource = getTMImageUrl(getTypeName(tmInfo.type, GAMEDATA3));
              } else {
                itemName = getItemString(itemId, GAMEDATA3);
                itemSource = getItemImageUrl(itemName);
              }
              return (
                <TableRow
                  key={`${index}-${itemOptionIndex}`}
                  className={itemName === selectedItem ? highlightColor : ""}
                >
                  <TableCell style={{textAlign: "center"}}>
                    <ImageWithFallback
                      alt={itemName}
                      src={itemSource}
                      fallbackSrc={`/img/404error.webp`}
                      width="40px"
                      height="40px"
                    />
                    {showQuantity && (
                      `x${flattenedItem.quantity}`
                    )}
                  </TableCell>
                  <TableCell>{itemName}</TableCell>
                  <TableCell>{showLocation ? `(X: ${flattenedItem.Position.x}, Y: ${flattenedItem.Position.y})` : itemDescription}</TableCell>
                </TableRow>
              );
            });
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default ItemTable;
