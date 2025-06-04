import { addAudioToHistory } from "../ai/audios.js";
import {
  contiueEventWithHistory,
  getFullTranscript,
  getHumanReadableReport,
  resetTheFullEventData,
  setFullTranscript,
} from "../ai/full-history.js";
import { padLeft } from "../services/library/general/utils.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {
  GSK_AI_HISTORY_TO_CLIENT,
  GSK_HUMAN_READABLE_REPORT,
  GSK_REQUEST_AI_TO_START_TALKING,
  GSK_REQUEST_AI_TO_STOP_TALKING,
  GSK_SEND_API_TO_SERVER,
  GSK_SEND_STRUCTURED_TRANSCRIPT,
  GSK_SETTINGS_TO_INIT_AI,
  GSK_VOICE_INPUT_TO_SERVER,
} from "../services/library/types/data-transfer-protocls.js";

import * as path from "path";
import { addToResponseQueue } from "../ai/main.js";
import {
  emitAiIsThinking,
  emitAiStopTalking,
  emitFullEventData,
} from "../socket-rooms/main-room.js";
import { setMyGeminiAPIKey } from "../ai/initialization.js";
import { notifyError, notifyInfo } from "../services/notifications/index.js";

const adminActivitiesSocketRoutines = async (io: any, socket: any) => {
  socket.on(
    "admin-activities-init-ai",
    async (payload: GSK_SETTINGS_TO_INIT_AI) => {
      try {
        resetTheFullEventData(payload.fullEventData);
        emitFullEventData(payload.fullEventData);
        notifyInfo(socket, "New Conference started.", "AI Initialization");
      } catch (error) {
        console.error("Error in admin-activities-init-ai:", error);
        notifyError(
          socket,
          "Failed to initialize AI settings. Please check the server logs for more details.",
          "Initialization Error"
        );
      }
    }
  );

  socket.on(
    "admin-activities-continue-ai-with-history",
    async (payload: GSK_SETTINGS_TO_INIT_AI) => {
      try {
        contiueEventWithHistory(payload.fullEventData);
        emitFullEventData(payload.fullEventData);
        notifyInfo(
          socket,
          "AI settings updated with existing history.",
          "AI History Update"
        );
      } catch (error) {
        console.error(
          "Error in admin-activities-continue-ai-with-history:",
          error
        );
        notifyError(
          socket,
          "Failed to update AI settings with history. Please check the server logs for more details.",
          "History Update Error"
        );
      }
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
      emitAiIsThinking(speakerIdx);
    }
  );
  socket.on(
    "admin-activities-stop-ai-voice",
    async (inData: GSK_REQUEST_AI_TO_STOP_TALKING) => {
      const { speakerIdx } = inData.payload;
      emitAiStopTalking(speakerIdx);
    }
  );
  socket.on("admin-activities-request-structured-transcript", () => {
    const payload: GSK_AI_HISTORY_TO_CLIENT = {
      type: "GSK_AI_HISTORY_TO_CLIENT",
      history: getFullTranscript(),
    };
    socket.emit("admin-activities-structured-transcript", payload);
  });
  socket.on("admin-activities-request-human-readable-report", () => {
    const payload: GSK_HUMAN_READABLE_REPORT = {
      type: "GSK_HUMAN_READABLE_REPORT",
      report: getHumanReadableReport(),
    };
    socket.emit("admin-activities-human-readable-report", payload);
  });
  socket.on(
    "admin-activities-set-api-code",
    (apiCode: GSK_SEND_API_TO_SERVER) => {
      setMyGeminiAPIKey(apiCode.api);
    }
  );
  socket.on(
    "admin-activities-replace-full-history",
    (structuredTranscript: GSK_SEND_STRUCTURED_TRANSCRIPT) => {
      try {
        setFullTranscript(structuredTranscript.payload.history);
      } catch (error) {
        console.error("Error in admin-activities-replace-full-history:", error);
        notifyError(
          socket,
          "Failed to replace full history. Please check the server logs for more details.",
          "Replace History Error"
        );
      }
    }
  );
};
export { adminActivitiesSocketRoutines };
