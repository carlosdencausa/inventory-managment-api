// Mock for StockUpdateQueue
export const mockQueueStatus = {
  queueSize: 5,
  isProcessing: true,
  isActive: true,
  metrics: {
    pendingUpdatesCount: 42,
    totalProcessed: 100,
    successCount: 95,
    errorCount: 5,
    lastProcessedAt: '2025-09-07T10:30:00.000Z',
  },
};

export const mockEmptyQueueStatus = {
  queueSize: 0,
  isProcessing: false,
  isActive: true,
  metrics: {
    pendingUpdatesCount: 0,
    totalProcessed: 120,
    successCount: 115,
    errorCount: 5,
    lastProcessedAt: '2025-09-07T10:35:00.000Z',
  },
};
