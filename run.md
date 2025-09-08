# Project Setup and Testing Guide

This document provides instructions on how to set up the project and run the stress test for the queue system.

## Setup Instructions

### Prerequisites

- Node.js version 18.18.0 (exact version required)
- npm version 9.8.1 (comes with Node.js 18.18.0)
- NestJS CLI version 10.1.18

### Installation Steps

1. **Setup Node.js version**

   Using nvm (Node Version Manager):
   ```bash
   nvm install 18.18.0
   nvm use 18.18.0
   ```
   
   Verify the version:
   ```bash
   node -v  # Should output v18.18.0
   npm -v   # Should output 9.8.1
   ```

2. **Install NestJS CLI**

   ```bash
   npm install -g @nestjs/cli@10.1.18
   ```
   
   Verify the installation:
   ```bash
   nest -v  # Should output 10.1.18
   ```

3. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ML
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Project Dependencies**

   The project uses the following key dependencies:
   - NestJS v10.1.18
   - proper-lockfile v4.1.2 (for file locking)
   - class-transformer v0.5.1 (for DTO transformations)
   - axios v1.6.2 (for the test script)

3. **Start the application**

   For development mode with auto-reload:
   ```bash
   npm run start:dev
   ```

   For production mode:
   ```bash
   npm run start
   ```

   The server will start and listen on port 3000 by default.

## Queue Stress Test

The project includes a stress test script that can verify the robustness of the queue system for handling concurrent stock updates.

### Running the Stress Test

1. **Make sure the server is running**

   Before running the test, ensure the application is running in a separate terminal window.

2. **Execute the queue test script**

   ```bash
   node scripts/queue-test.mjs
   ```

   This script will:
   - Send multiple batches of stock update requests to the server
   - Monitor the queue status during the test
   - Report on the performance of the system

### Test Configuration

The test script (`queue-test.mjs`) is configured to:

- Execute 800 requests in 5 batches of 100 concurrent requests
- Each request contains between 200-400 random stock updates
- Monitor the queue status throughout the test execution
- Wait for all requests to be processed before completing

### Interpreting Test Results

During the test execution, you'll see output like:

```
[2025-09-07T23:21:01.920Z] Queue: 3 elements, Processing: Yes, Active: Yes
Metrics: { pendingUpdatesCount: 846 }
```

This provides information about:
- Current queue size
- Whether the queue is actively processing items
- Status of the queue processor
- Various metrics including pending updates count, success count, error count, etc.

The test is successful if:
- All requests are processed without errors
- The queue empties completely at the end
- You see the "Test completed successfully" message

## Queue System Architecture

This application uses a custom queue implementation (`StockUpdateQueue`) to handle concurrent stock updates in a controlled manner. The queue:

1. Processes updates sequentially to prevent race conditions when accessing the database
2. Uses file locking to ensure data integrity when updating stock levels
3. Provides metrics and status information for monitoring
4. Implements proper lifecycle hooks for controlled startup and shutdown

## Troubleshooting

- **Lock file errors**: If you see "Lock file is already being held" errors, it means the queue is working as designed to prevent concurrent access to the database. The request will be queued and processed in order.
- **Performance issues**: If the queue becomes too large or processing is slow, consider adjusting the batch size in the test script.
