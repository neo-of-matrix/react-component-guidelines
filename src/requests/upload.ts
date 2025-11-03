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
    console.error('Error merging chunks:', err);
    throw err;
  }
};

export { mergeChunksRequest };
