
# Image Processing Application

This is an image processing application that uses Redis to manage background jobs. It includes a backend server and a worker to process jobs from the Redis queue.

## Prerequisites

- Node.js (version >= 12)
- Redis
- npm (Node Package Manager)

## Installation

### 1. Clone the Repository

First, clone the repository to your local machine:
```bash
git clone https://github.com/johnwesily/image_processing_csv.git
cd image_processing_csv
```

### 2. Install Dependencies

Navigate to the project directory and install the required dependencies:
```bash
npm install
```

## Running the Application

### 1. Start Redis

Ensure Redis is running. If Redis is not running, start it by executing the following command in a terminal:
```bash
redis-server
```

### 2. Start the Backend Server

Run the following command to start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:3001` by default.

### 3. Start the Worker

In a separate terminal window, run the worker process:
```bash
node src/workers/imageWorker.js
```

The worker will process jobs from the Redis queue and handle image processing tasks.



