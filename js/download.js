const https = require("https");
const fs = require("fs");
const path = require("path");

const MODEL_URLS = {
  onnx: "https://huggingface.co/janakh/monocr/resolve/main/monocr.onnx",
  tflite: "https://huggingface.co/janakh/monocr/resolve/main/monocr.tflite",
  charset: "https://huggingface.co/janakh/monocr/resolve/main/charset.txt",
};

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`Failed to download ${url}: ${response.statusCode}`),
          );
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

async function main() {
  const destDir = process.argv[2] || "model";
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  for (const [name, url] of Object.entries(MODEL_URLS)) {
    const fileName = name === "charset" ? "charset.txt" : `monocr.${name}`;
    const dest = path.join(destDir, fileName);
    console.log(`Downloading ${url} to ${dest}...`);
    await downloadFile(url, dest);
  }
  console.log("Done.");
}

if (require.main === module) {
  main().catch(console.error);
}
