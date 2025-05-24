import { addAudioToHistory } from "../ai/audios.js";
import { resetTheFullEventData } from "../ai/full-history.js";
import { padLeft } from "../services/library/general/utils.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {
  GSK_REQUEST_AI_TO_START_TALKING,
  GSK_SETTINGS_TO_INIT_AI,
  GSK_VOICE_INPUT_TO_SERVER,
} from "../services/library/types/data-transfer-protocls.js";

import * as path from "path";
import { addToResponseQueue } from "../ai/main.js";
import { emitFullEventData } from "../socket-rooms/main-room.js";

const adminActivitiesSocketRoutines = async (io: any, socket: any) => {
  socket.on(
    "admin-activities-init-ai",
    async (payload: GSK_SETTINGS_TO_INIT_AI) => {
      resetTheFullEventData(payload.fullEventData);
      emitFullEventData(payload.fullEventData);
    }
  );
  socket.on(
    "admin-activities-voice-input-to-server",
    async (payload: GSK_VOICE_INPUT_TO_SERVER) => {
      try {
        const { voiceBlob, speakerIdx } = payload.payload;
        // Save the blob to a file with a name based on the date and time and the speaker's name
        const date = new Date();
        const dateString = date.toISOString().replace(/:/g, "-");
        // take first 6 characters of the speaker's name and make sure it does not contain any special characters

        // Create the file name
        const fileName = `voice_${dateString}_${padLeft(speakerIdx, 3)}.wav`;
        // if no tmp folder, create it

        // the tmp folder should be outside the src folder
        // check if tmp folder exists, if not create it
        const tmpFolderPath = path.join(__dirname, "..", "..", "tmp");
        if (!fs.existsSync(tmpFolderPath)) {
          fs.mkdirSync(tmpFolderPath);
        }

        const filePath = path.join(tmpFolderPath, fileName);

        // Convert voiceBlob (assumed to be a base64 string or Buffer) to ArrayBuffer
        let arrayBuffer: ArrayBuffer;
        if (typeof voiceBlob === "string") {
          // If it's a base64 string
          const buffer = Buffer.from(voiceBlob, "base64");
          arrayBuffer = buffer.buffer.slice(
            buffer.byteOffset,
            buffer.byteOffset + buffer.byteLength
          );
        } else if (Buffer.isBuffer(voiceBlob)) {
          // If it's already a Buffer
          arrayBuffer = voiceBlob.buffer.slice(
            voiceBlob.byteOffset,
            voiceBlob.byteOffset + voiceBlob.byteLength
          );
        } else {
          throw new Error("Unsupported voiceBlob format");
        }
        await fs.promises.writeFile(filePath, Buffer.from(arrayBuffer));
        await addAudioToHistory({
          localUrl: filePath,
          speakerIdx,
        });
        console.log("WAV file saved:", filePath);
        socket.emit("admin-activities-voice-input-to-server-ack", "done");
      } catch (error) {
        console.log("Error in admin-activities-voice-input-to-server", error);
      }
    }
  );
  socket.on(
    "admin-activities-start-ai-voice",
    async (inData: GSK_REQUEST_AI_TO_START_TALKING) => {
      const { speakerIdx } = inData.payload;
      addToResponseQueue(speakerIdx);
    }
  );
};
export { adminActivitiesSocketRoutines };
