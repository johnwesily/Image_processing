Running the Application

1. Install Dependencies
Navigate to the project directory and run:


npm install

2. Start Redis
Ensure Redis is running. If not, start it:


redis-server

3. Start the Backend Server
Run the following command to start the backend server:

npm start
The server will run on http://localhost:3001 by default.

4. Start the Worker
In a separate terminal, run the worker process:


node src/workers/imageWorker.js
The worker will process jobs from the Redis queue.

