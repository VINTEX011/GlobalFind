export async function scheduleMonitoringRefresh(caseId: string) {
  return {
    ok: true,
    caseId,
    worker: "placeholder-monitoring-adapter",
    message:
      "Monitoring refresh queued against keyword, hashtag, nickname, place, and manual import adapters.",
  };
}
