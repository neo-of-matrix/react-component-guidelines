const reportError = (error: { name: string; message: string; stack: unknown }) => {
  if (navigator.sendBeacon) {
    const data = new Blob([`projectId=123&error=$${error.name}:${error.message}`], {
      type: 'application/x-www-form-urlencoded',
    });
    navigator.sendBeacon('http://localhost:3000/report-error', data);
  }
};
export { reportError };
