import React, { useState } from 'react';
import { Box, Typography, Modal } from '@mui/material';
import { getPokemon } from "../../../plugins/pokedex-data-plugin/dex/pokemon";
import useBaseUrl from '@docusaurus/useBaseUrl';
import { getItemImageUrl } from '../../../plugins/pokedex-data-plugin/dex/item';
import { useGlobalState } from '../common/GlobalState';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const PokemonItems = ({ item1, item2, item3 }) => {
  const [globalState, updateMode] = useGlobalState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const noItems = item1 === "None" && item2 === item1 && item3 === item1
  const allItems = item1 !== "None" && item2 === item1 && item3 === item1

  return (
    <div>
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={1}>
        <>
          <Box gridColumn="span 5">
            <Typography
              sx={{
                textDecoration: (!allItems && !noItems) ? 'underline' : "",
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: (!allItems && !noItems) ? 'pointer' : null,
              }}
              onClick={handleOpen}
            >
              Wild Held Items:
            </Typography>
          </Box>
        </>
        {(item1 !== "None" && !allItems) && (<ItemContainer item={item1} percentage={50} />)}
        {(item3 !== "None" && !allItems) && (<ItemContainer item={item3} percentage={45} />)}
        {(item2 !== "None" && !allItems) && (<ItemContainer item={item2} percentage={5} />)}
        {noItems && (
          <>
            <Box gridColumn="span 5">
              <Typography >This Pokémon does not hold an item in the wild</Typography>
            </Box>
          </>
        )}
        {allItems && (
          <ItemContainer item={item1} percentage={100} />
        )}
        {(!allItems && !noItems) && (
          <Modal open={open} onClose={handleClose}>
            <Box style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--ifm-color-content-inverse)',
              color: 'var(--ifm-color-content)',
              padding: '16px',
              borderRadius: '8px',
              border: 'var(--ifm-table-border-width) solid var(--ifm-table-border-color)',
            }}
            >
              <Box display="grid" gridTemplateColumns="repeat(3)" gap={1}>
                <Box gridColumn="span 3">
                  <Typography >
                    If the Lead Pokémon has Frisk,<br />
                    Super Luck or Compound Eyes:</Typography>
                </Box>
                {(item1 !== "None" && !allItems) && (<ItemContainer item={item1} percentage={60} span='span 1' />)}
                {(item3 !== "None" && !allItems) && (<ItemContainer item={item3} percentage={20} span='span 1' />)}
                {(item2 !== "None" && !allItems) && (<ItemContainer item={item2} percentage={20} span='span 1' />)}
              </Box>
            </Box>
          </Modal>
        )}
      </Box>
    </div>
  );
};

const ItemContainer = ({item, percentage, span='span 2'}) => {
  return (
    <>
      <Box gridColumn={span} display="flex" alignItems={"center"} sx={{marginLeft: "16px"}}>
        <Typography >{percentage}%: {item}</Typography>
      </Box>
      <Box gridColumn={span}>
        <ImageWithFallback
          key={item}
          src={item}
          fallbackSrc={`/img/pkm/pm0000_00_00_00_L.webp`}
          width="40"
          alt={item}
          title={item}
        />
      </Box>
      <Box gridColumn="span 1" />
    </>
  )
}