import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { Box, Typography } from "@mui/material";

import { PokemonAccordion } from '../../Pokedex2/PokemonAccordion';
import ShopTable from '../Shops/ShopTable';
import "../style.css"
import { getFixedShopsItems } from '../../../utils/dex/item';

const ShopsPanel = ({shopItemsList, selectedItem = ""}) => {
  const { colorMode, setColorMode } = useColorMode();
  const modeChangeTextColor = colorMode === "dark" ? "#F5FBF5" : "#000000";
  return (
    <Box className="shop-panel">
      <Typography
        variant="h5"
        sx={{display: "flex", justifyContent: "center", margin: "8px 0px 8px"}}
      >
        Shops
      </Typography>
      <Box className="shop-accordions">
        <PokemonAccordion
          disabled={shopItemsList.mart.length === 0}
          title="Poke Mart Items"
          id="MartItems"
          bgColor={"success.main"}
          textColor={shopItemsList.mart.length !== 0 ? "#F5FBF5" : modeChangeTextColor}
        >
          <ShopTable
            shopItemList={shopItemsList.mart}
            selectedItem={selectedItem}
            isPokeMart
          />
        </PokemonAccordion>
        {shopItemsList.fixed && shopItemsList.fixed.map((shopList) => (
          <PokemonAccordion
            disabled={shopList.length === 0}
            title={shopList.sectionTitle}
            id="FixedShopItems"
            bgColor={"primary.dark"}
            textColor={shopList.length !== 0 ? "#F5FBF5" : modeChangeTextColor}
            key={`Fixed Shop: ${shopList.sectionTitle}`}
          >
            <ShopTable
              shopItemList={shopList?.items.flatMap(shopId => (getFixedShopsItems(shopId).map(itemId => ({ItemNo: itemId}))))}
              selectedItem={selectedItem}
            />
          </PokemonAccordion>
        ))}
        <PokemonAccordion
          disabled={shopItemsList.heartScale.length === 0}
          title="Heart Scale Shop Items"
          id="HeartScaleShopItems"
          bgColor={"warning.main"}
          textColor={shopItemsList.heartScale.length !== 0 ? "#F5FBF5" : modeChangeTextColor}
        >
          <ShopTable
            shopItemList={shopItemsList.heartScale}
            selectedItem={selectedItem}
            isHeartScale
          />
        </PokemonAccordion>
      </Box>
    </Box>
  );
};

export default ShopsPanel;