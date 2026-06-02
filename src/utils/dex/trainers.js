import { TrainerLocations, GAMEDATA2 } from "../../../__gamedata";

function getTrainersFromZoneId(zoneId, mode = GAMEDATA2) {
  if (zoneId === null) {
    return [];
  }
  const zoneKey = zoneId.toString();
  if (zoneKey in TrainerLocations[mode]) {
    return TrainerLocations[mode][zoneKey];
  }
  console.warn(`${zoneKey} is not in the Trainer List.`);
  return [];
};

function getZoneIdFromTrainerId(trainerId, mode = GAMEDATA2) {
  if (!trainerId) return null;
  
  for (const zoneKey in TrainerLocations[mode]) {
    const trainers = TrainerLocations[mode][zoneKey];
    const trainer = trainers.find(t => t.trainer_id === parseInt(trainerId));
    if (trainer) {
      return parseInt(zoneKey);
    }
  }
  
  console.warn(`Trainer ID ${trainerId} not found in any zone.`);
  return null;
};

export {
  getTrainersFromZoneId,
  getZoneIdFromTrainerId
}
