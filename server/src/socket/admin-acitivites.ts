import { initializeANewDiscussion } from "../ai/initialize";
import { GSK_SETTINGS_TO_INIT_AI } from "../services/library/types/data-transfer-protocls";

const adminActivitiesSocketRoutines = async (io: any, socket: any) => {
  socket.on(
    "admin-activities-init-ai",
    async (payload: GSK_SETTINGS_TO_INIT_AI) => {
      initializeANewDiscussion(payload);
    }
  );
};
export { adminActivitiesSocketRoutines };
