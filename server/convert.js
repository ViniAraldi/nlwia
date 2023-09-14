import fs from "fs"
import wav from "node-wav"
import ffmpeg from "fluent-ffmpeg"
import ffmpegStatic from "ffmpeg-static"
import { resolve } from "path"

const filePatch = "./tmp/audio.mp4"
const outputPatch = filePatch.replace(".mp4", ".wav")

export const convert = () => 
  new Promise((resolve, reject) => {
    console.log("Convertendo video...")

    ffmpeg.setFfmpegPath(ffmpegStatic)
    ffmpeg()
    .input(filePatch)
    .audioFrequency(16000)
    .audioChannels(1)
    .format("wav")
    .on("end", () => {
      const file = fs.readFileSync(outputPatch)
      const fileDecoded = wav.decode(file)

      const audioData = fileDecoded.channelData[0]
      const floatArray = new Float32Array(audioData)

      console.log("Video convertido com suceso")

      resolve(floatArray)
      fs.unlinkSync(outputPatch)

    })
    .on("error", (error) => {
      console.log("Erro ao converter video", error)
      reject(error)
    })
    .save(outputPatch)

  })
  

