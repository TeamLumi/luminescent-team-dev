import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { ContentPasteGo } from "@mui/icons-material";
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import Tooltip from '@mui/material/Tooltip';
import { getMoveProperties, getPokemonName } from '../../../utils/dex';
import { getFullTrainerById } from '../../../utils/dex/trainers';
import { Trainers } from "./Trainers";
import { TrainerSearchInput } from "../SearchBar";
import { GAMEDATA3 } from "../../../../__gamedata";

const TrainersModal = ({
  showModal,
  onHide,
  pokemonList,
  selectedTrainer,
  allTrainers,
  initialTrainers,
}) => {
  const [trainerTabs, setTrainerTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isAllTeamsMode, setIsAllTeamsMode] = useState(false);
  const prevShowModal = useRef(false);
  const wasModalOpen = useRef(false);

  // Handle modal open/close and trainer changes in a single effect to avoid
  // stale-closure races between initialization and adding trainers
  useEffect(() => {
    if (!showModal || !selectedTrainer) {
      prevShowModal.current = showModal;
      return;
    }

    if (!prevShowModal.current) {
      // Modal just opened, initialize with initialTrainers array if provided, else single trainer
      setIsAllTeamsMode(false);
      if (initialTrainers && initialTrainers.length > 0) {
        setTrainerTabs(initialTrainers);
      } else {
        setTrainerTabs([selectedTrainer]);
      }
      setActiveTab(0);
    } else {
      // Modal was already open, add trainer if not already present
      const existingIdx = trainerTabs.findIndex(
        t => t.trainerId === selectedTrainer.trainerId
      );
      if (existingIdx >= 0) {
        setActiveTab(existingIdx);
      } else {
        setTrainerTabs(prev => [...prev, selectedTrainer]);
        setActiveTab(trainerTabs.length);
      }
    }

    prevShowModal.current = showModal;
  }, [showModal, selectedTrainer, initialTrainers]);

  // Sync trainer tabs to URL query parameter so the current setup is shareable
  useEffect(() => {
    const url = new URL(window.location);

    if (showModal && trainerTabs.length > 0) {
      const ids = trainerTabs.map(t => t.trainerId).join(',');
      url.searchParams.set('trainerId', ids);
      wasModalOpen.current = true;
    } else if (!showModal && wasModalOpen.current) {
      // Only clear URL param after the modal has actually been open
      url.searchParams.delete('trainerId');
      wasModalOpen.current = false;
    } else {
      // Modal not open yet (initial mount), leave URL alone
      return;
    }

    // searchParams encodes commas as %2C, revert for clean readable URLs
    url.search = url.search.replace(/%2C/g, ',');
    window.history.replaceState({}, '', url);
  }, [trainerTabs, showModal]);

  const handleClose = () => {
    onHide();
  };

  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick' && trainerTabs.length > 1) {
      setShowCloseConfirm(true);
      return;
    }
    // X button click and Escape key close directly
    handleClose();
  };

  const handleConfirmClose = () => {
    setShowCloseConfirm(false);
    handleClose();
  };

  const handleCancelClose = () => {
    setShowCloseConfirm(false);
  };

  const activeTrainer = activeTab < trainerTabs.length ? trainerTabs[activeTab] : null;

  const handleExport = useCallback(() => {
    if (!activeTrainer?.team) return;
    const showdownMon = activeTrainer.team.map(pokemon => transformToText(pokemon));
    const exportText = showdownMon.join("\n\n");
    navigator.clipboard.writeText(exportText).then(() => {
      setShowSnackbar(true);
    });
  }, [activeTrainer]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleOpenShowdown = () => {
    if (!activeTrainer?.trainerId) return;
    const url = `https://calc.relumishowdown.dpdns.org/?mode=ingame&setSource=ingame&trainerId=${activeTrainer.trainerId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab);
  };

  const handleCloseTab = (index) => (event) => {
    event.stopPropagation();
    setIsAllTeamsMode(false);
    setTrainerTabs(prev => {
      const newTabs = prev.filter((_, i) => i !== index);
      if (newTabs.length === 0) {
        // No tabs left, close the modal
        setTimeout(() => onHide(), 0);
      }
      return newTabs;
    });
    // Adjust active tab if needed
    setActiveTab(prev => {
      if (prev === index) {
        // If closing the active tab, go to the previous tab (or the + tab if none)
        return Math.max(0, index - 1);
      }
      if (prev > index) {
        return prev - 1;
      }
      return prev;
    });
  };

  const handleTrainerSearchSelect = (searchTrainer) => {
    if (!searchTrainer) return;
    const fullTrainer = getFullTrainerById(searchTrainer.trainerId, GAMEDATA3);
    if (!fullTrainer) return;

    const existingIdx = trainerTabs.findIndex(t => t.trainerId === fullTrainer.trainerId);
    if (existingIdx >= 0) {
      setActiveTab(existingIdx);
      return;
    }
    setTrainerTabs(prev => [...prev, fullTrainer]);
    setIsAllTeamsMode(false);
    setActiveTab(trainerTabs.length);
  };

  function transformToText(pokemon) {
    var genderSymbol = "";
    
    switch (pokemon.gender) {
      case "FEMALE":
        genderSymbol = "(F)";
        break;
      case "MALE":
        genderSymbol = "(M)";
        break;
      default:
        break;
    }

    const moves = pokemon.moves.map(id => "- " + getMoveProperties(id, GAMEDATA3).name).join("\n");

    return `${getPokemonName(pokemon.id, GAMEDATA3)} ${genderSymbol} @ ${pokemon.item}
Level: ${pokemon.level}
${pokemon.nature} Nature
Ability: ${pokemon.ability}
EVs: ${pokemon.evhp} HP / ${pokemon.evatk} Atk / ${pokemon.evdef} Def / ${pokemon.evspatk} SpA / ${pokemon.evspdef} SpD / ${pokemon.evspeed} Spe
IVs: ${pokemon.ivhp} HP / ${pokemon.ivatk} Atk / ${pokemon.ivdef} Def / ${pokemon.ivspatk} SpA / ${pokemon.ivspdef} SpD / ${pokemon.ivspeed} Spe
${moves}`;
  }

  // Detect if the single open trainer is part of a multi-team boss (Teams 1-4)
  const bossTeamIds = useMemo(() => {
    if (trainerTabs.length !== 1) return [];
    const currentTrainer = trainerTabs[0];
    if (!currentTrainer?.team_name) return [];

    const match = currentTrainer.team_name.match(/\s*\[Team (\d+)\]\s*$/);
    if (!match) return [];

    const baseName = currentTrainer.team_name.slice(0, match.index);
    if (!baseName) return [];

    // Find all teams 1-4 with the same base name
    const ids = [];
    for (let n = 1; n <= 4; n++) {
      const teamName = `${baseName} [Team ${n}]`;
      const found = allTrainers?.find(t => t.team_name === teamName);
      if (found) ids.push(found.trainerId);
    }
    return ids.length >= 2 ? ids : [];
  }, [trainerTabs, allTrainers]);

  const showBossButton = bossTeamIds.length >= 2;

  const getTabLabel = (trainer) => {
    if (isAllTeamsMode) {
      const match = trainer.team_name?.match(/\s*\[Team (\d+)\]\s*$/);
      if (match) {
        return `Team ${match[1]} (${trainer.trainerId})`;
      }
    }
    return trainer.team_name || `Trainer ${trainer.trainerId}`;
  };

  const handleLoadAllBossTeams = () => {
    const fullTrainers = bossTeamIds
      .map(id => getFullTrainerById(id, GAMEDATA3))
      .filter(Boolean);
    if (fullTrainers.length > 1) {
      setTrainerTabs(fullTrainers);
      setActiveTab(0);
      setIsAllTeamsMode(true);
    }
  };

  // Filter out already-open trainers from the search dropdown
  const filteredAllTrainers = useMemo(() => {
    if (!allTrainers) return [];
    const openIds = new Set(trainerTabs.map(t => t.trainerId));
    return allTrainers.filter(t => !openIds.has(t.trainerId));
  }, [allTrainers, trainerTabs]);

  const isSearchTab = activeTab >= trainerTabs.length;
  const hasMultipleTabs = trainerTabs.length > 1 || isSearchTab;

  return (
    <Dialog
      open={showModal}
      onClose={handleDialogClose}
      fullWidth
      maxWidth={false}
      PaperProps={{ sx: { maxWidth: 1108, overflow: 'hidden' } }}
    >
      {/* Header with tabs and action buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          pr: '160px',
          pt: 1,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 40,
            "& .MuiTab-root": {
              minHeight: 40,
              py: 0.5,
              textTransform: 'none',
              fontSize: '0.875rem',
            },
            "& .MuiTabs-scrollButtons.Mui-disabled": {
              opacity: 0.3,
            },
          }}
        >
          {trainerTabs.map((trainer, i) => (
            <Tab
              key={trainer.trainerId || i}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 140,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getTabLabel(trainer)}
                  </Typography>
                  <IconButton
                    size="small"
                    onMouseDown={handleCloseTab(i)}
                    sx={{
                      p: 0.25,
                      ml: 0.25,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: '0.875rem' }} />
                  </IconButton>
                </Box>
              }
            />
          ))}
          {!isAllTeamsMode && (
            <Tab
              icon={<AddIcon />}
              aria-label="Add trainer tab"
              sx={{ minWidth: 40 }}
            />
          )}
        </Tabs>
        {showBossButton && (
          <Tooltip title={`Load all ${bossTeamIds.length} boss teams`}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleLoadAllBossTeams}
              startIcon={<WorkspacesIcon />}
              sx={{ ml: 1, mt: 0.5, whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              All Teams
            </Button>
          </Tooltip>
        )}
      </Box>

      {/* Action buttons */}
      <Tooltip title="Export to Showdown">
        <IconButton
          aria-label="Export to Showdown"
          onClick={handleExport}
          sx={{
            position: 'absolute',
            right: 60,
            top: 8,
          }}>
          <ContentPasteGo />
        </IconButton>
      </Tooltip>
      <Tooltip title="Open In Damage Calc">
        <IconButton
          aria-label="Open In Damage Calc"
          onClick={handleOpenShowdown}
          sx={{
            position: 'absolute',
            right: 108,
            top: 8,
          }}>
          <CatchingPokemonIcon />
        </IconButton>
      </Tooltip>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 12,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Content */}
      <DialogContent
        dividers
        sx={{ maxWidth: "1108px", ...(hasMultipleTabs ? { minHeight: 942 } : {}) }}
      >
        {isSearchTab ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              py: 6,
              gap: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Search for a trainer to add
            </Typography>
            <Box sx={{ '& .monSearchBar': { marginRight: 0, marginTop: 0, width: 300 } }}>
              <TrainerSearchInput
                allTrainers={filteredAllTrainers}
                onTrainerSelect={handleTrainerSearchSelect}
                value={null}
                onChange={() => {}}
              />
            </Box>
          </Box>
        ) : (
          activeTrainer && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Trainer: {activeTrainer.team_name} ({activeTrainer.trainerId})
              </Typography>
              <Trainers
                pokemonList={pokemonList}
                selectedTrainer={activeTrainer}
              />
            </Box>
          )
        )}
      </DialogContent>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Copied to clipboard successfully!"
      />

      {/* Confirmation dialog for accidental backdrop clicks with multiple tabs */}
      <Dialog
        open={showCloseConfirm}
        onClose={handleCancelClose}
        maxWidth="xs"
      >
        <DialogTitle>Close all tabs?</DialogTitle>
        <DialogContent>
          <Typography>
            You have {trainerTabs.length} trainer tabs open. Are you sure
            you want to close them all?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose}>Cancel</Button>
          <Button onClick={handleConfirmClose} variant="contained" color="error">
            Close All
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
};

export default TrainersModal;
