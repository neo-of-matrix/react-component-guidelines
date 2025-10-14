import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import multiparty from "multiparty";

// 常量定义
const TEMP_DIR = "./dist/temp";
const UPLOAD_DIR = "./dist/uploads";

// 初始化目录
function initDirectories() {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
}

// 处理跨域请求
function handleCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return true;
  }
  return false;
}

// 处理分片上传
async function handleChunkUpload(req, res) {
  const form = new multiparty.Form({
    uploadDir: TEMP_DIR,
    autoFiles: true,
  });

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing chunk:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: err.message }));
        return resolve(false);
      }

      const fileId = fields.fileId[0];
      const chunkIndex = parseInt(fields.chunkIndex[0]);
      const totalChunks = parseInt(fields.totalChunks[0]);
      const chunkFile = files.file[0];

      const chunkDir = path.join(TEMP_DIR, fileId);
      if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir);

      const chunkPath = path.join(chunkDir, `${chunkIndex}`);
      fs.renameSync(chunkFile.path, chunkPath);

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: true,
          fileId,
          chunkIndex,
          totalChunks,
          receivedChunks: fs.readdirSync(chunkDir).length,
        })
      );
      resolve(true);
    });
  });
}

// 处理分片合并
async function handleChunkMerge(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  return new Promise((resolve) => {
    req.on("end", async () => {
      try {
        const { fileId, originalFilename, totalChunks } = JSON.parse(body);
        const chunkDir = path.join(TEMP_DIR, fileId);

        const receivedChunks = fs.readdirSync(chunkDir).length;
        if (receivedChunks !== totalChunks) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              success: false,
              error: `Missing chunks. Received ${receivedChunks} of ${totalChunks}`,
            })
          );
          return resolve(false);
        }

        const mergedFilePath = path.join(UPLOAD_DIR, originalFilename);
        const writeStream = fs.createWriteStream(mergedFilePath);

        for (let i = 0; i < totalChunks; i++) {
          const chunkPath = path.join(chunkDir, i.toString());
          const chunkData = fs.readFileSync(chunkPath);
          writeStream.write(chunkData);
        }

        writeStream.end();

        writeStream.on("finish", () => {
          fs.rm(chunkDir, { recursive: true }, (err) => {
            if (err) console.error(err.message);
            else console.log("Chunk directory deleted successfully");
          });
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              success: true,
              fileId,
              originalFilename,
              filePath: mergedFilePath,
              size: fs.statSync(mergedFilePath).size,
            })
          );
          resolve(true);
        });

        writeStream.on("error", (err) => {
          throw err;
        });
      } catch (err) {
        console.error("Error merging chunks:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: err.message }));
        resolve(false);
      }
    });
  });
}

// 主服务器逻辑
function createServer() {
  initDirectories();
  
  const server = http.createServer(async (req, res) => {
    if (handleCors(req, res)) return;

    if (req.method === "POST" && req.url === "/upload-chunk") {
      await handleChunkUpload(req, res);
      return;
    }

    if (req.method === "POST" && req.url === "/merge-chunks") {
      await handleChunkMerge(req, res);
      return;
    }

    res.statusCode = 404;
    res.end("Not found");
  });

  return server;
}

// 启动服务器
function startServer() {
  const server = createServer();
  server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

startServer();
