// 前端分片上传代码
const createChunk = ({
  file,
  chunkSize,
  totalChunks,
  fileId,
}: {
  file: File;
  chunkSize: number;
  totalChunks: number;
  fileId: string;
}) => {
  const chunkList = [];
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("fileId", fileId);
    formData.append("chunkIndex", chunkIndex.toString());
    formData.append("totalChunks", totalChunks.toString());
    formData.append("originalFilename", file.name);
    chunkList.push(formData);
  }
  return chunkList;
};
const uploadChunk = async (formData: FormData) => {
  try {
    const response = await fetch("http://localhost:3000/upload-chunk", {
      method: "POST",
      body: formData,
    });
    await response.json();
  } catch (err) {
    console.error("Error uploading chunk:", err);
    throw err;
  }
};
const mergeChunks = async (file: File, fileId: string, totalChunks: number) => {
  // 所有分片上传完成后，通知后端合并
  try {
    const response = await fetch("http://localhost:3000/merge-chunks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileId,
        originalFilename: file.name,
        totalChunks,
      }),
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error merging chunks:", err);
    throw err;
  }
};
async function concurrentUpload(chunkList: FormData[], maxConcurrent = 3) {
  const results = [];
  for (let i = 0; i < chunkList.length; i += maxConcurrent) {
    const batch = chunkList.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(
      batch.map((formData) => {
        return uploadChunk(formData);
      })
    );
    results.push(...batchResults);
  }
  return results;
}
async function uploadFile(file: File) {
  const chunkSize = 5 * 1024 * 1024;
  const totalChunks = Math.ceil(file.size / chunkSize);
  const fileId = `${file.name}-${file.size}-${Date.now()}`;
  const chunkList = createChunk({ file, chunkSize, totalChunks, fileId });
  await concurrentUpload(chunkList);
  await mergeChunks(file, fileId, totalChunks);
}

export { uploadFile };
