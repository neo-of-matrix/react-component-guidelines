import { reportError } from '@requests/reportError';

const mergeChunksRequest = async (data: {
  fileId: string;
  originalFilename: string;
  totalChunks: number;
}) => {
  try {
    const response = await fetch('http://localhost:3000/merge-chunks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = (await response.json()) as { status: string };
    return result;
  } catch (err) {
    reportError({
      name: 'MergeChunksRequestError',
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : String(err),
    });
    throw err;
  }
};

export { mergeChunksRequest };
