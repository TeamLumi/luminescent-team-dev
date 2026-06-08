import { TrainerLocations, GAMEDATA2 } from "../../../__gamedata";

function getTrainersFromZoneId(zoneId, mode = GAMEDATA2) {
  if (zoneId === null) {
    return [];
  }
  let zoneKey = zoneId.toString();
  if (zoneKey === "327") { // Put the Lake Valor Before trainers
    zoneKey = "326" // To be at the Lake Valor After for ease of use.
  }
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
