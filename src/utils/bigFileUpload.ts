import { reportError } from '@requests/reportError';
import { mergeChunksRequest } from '@requests/upload';
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
    formData.append('file', chunk);
    formData.append('fileId', fileId);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('originalFilename', file.name);
    chunkList.push(formData);
  }
  return chunkList;
};
const uploadChunk = async (formData: FormData) => {
  try {
    const response = await fetch('http://localhost:3000/upload-chunk', {
      method: 'POST',
      body: formData,
    });
    await response.json();
  } catch (err) {
    reportError({
      name: 'ChunkUploadError',
      message: 'Error uploading chunk',
      stack: err instanceof Error ? err.stack : String(err),
    });
    throw err;
  }
};
const mergeChunks = async (file: File, fileId: string, totalChunks: number) => {
  // 所有分片上传完成后，通知后端合并
  const result = await mergeChunksRequest({
    fileId,
    originalFilename: file.name,
    totalChunks,
  });
  return result;
};
async function concurrentUpload(chunkList: FormData[], maxConcurrent = 3) {
  const results = [];
  for (let i = 0; i < chunkList.length; i += maxConcurrent) {
    const batch = chunkList.slice(i, i + maxConcurrent);
    const batchResults = batch.map((formData) => {
      return uploadChunk(formData);
    });
    results.push(batchResults);
  }
  return await Promise.all(results.flat());
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
