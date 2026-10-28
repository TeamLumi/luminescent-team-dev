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
import { getItemPrice } from '../../../utils/dex/item';

const ShopTable = ({ shopItemList, selectedItem, isHeartScale = false, isPokeMart = false }) => {
  const { colorMode, setColorMode } = useColorMode();
  const highlightColor =
    colorMode === 'dark' ? 'highlight-dark-row' : 'highlight-light-row';
  if (shopItemList.length === 0) {
    return (
      <Typography sx={{display: "flex", justifyContent: "center"}}>Nothing to see here.</Typography>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="74px">Icon</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            {isPokeMart && (
              <TableCell>Badge</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {shopItemList.flatMap((item, index) => {
            console.log(item.ItemNo);
            let itemName = "";
            let itemSource = "";
            const tmInfo = getTMInfoFromItemNo(item.ItemNo, GAMEDATA3)
            if (tmInfo) {
              itemName = `TM${tmInfo.tmNo} ${tmInfo.name}`;
              itemSource = getTMImageUrl(getTypeName(tmInfo.type, GAMEDATA3));
            } else {
              itemName = getItemString(item.ItemNo, GAMEDATA3);
              itemSource = getItemImageUrl(itemName);
            }
            const itemPrice = getItemPrice(item.ItemNo)
            return (
              <TableRow
                key={`${index}`}
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
                </TableCell>
                <TableCell>{itemName}</TableCell>
                <TableCell>
                  {isHeartScale ? (
                    `${item.Price} Heart Scale(s)`
                  ) : (
                    <>
                      <span style={{fontFamily: "PDollar, bp_gender, sans-serif"}}>$</span>
                      {itemPrice}
                    </>
                  )}
                </TableCell>
                {isPokeMart && (
                  <TableCell>
                    {`${item.BadgeNum}+ Badges`}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default ShopTable;
