const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const users = {};
let countdownTimer = 300; // Initial countdown time in seconds (e.g., 5 minutes)
let countdownInterval; // Interval for countdown timer

function startCountdown() {
  countdownInterval = setInterval(() => {
    countdownTimer--;
    if (countdownTimer <= 0) {
      clearInterval(countdownInterval); // Clear interval when countdown reaches 0
    }
    io.emit('countdownUpdate', countdownTimer);
  }, 1000);
}

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('identify', (userId) => {
    console.log(`User ${userId} connected`);
    users[userId] = socket;
    socket.emit('countdownUpdate', countdownTimer);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    const userId = Object.keys(users).find((key) => users[key] === socket);
    delete users[userId];
  });
});

startCountdown();

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies

// Define the '/products' route to retrieve all products
app.get('/products', (req, res) => {
  // Read products data from db.json
  fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const products = JSON.parse(data).products;
    
    // Adjusting end dates for each product with a gap of approximately 3 days
    products.forEach((product, index) => {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + index * 3); // Adding 3 days for each product
      product.end_date = endDate.toISOString(); // Assigning the adjusted end date
    });

    res.json(products);
  });
});

// Define the '/bid' route for handling bid submissions
app.post('/bid', (req, res) => {
  const { productId, bid, userId } = req.body;
  // Here you would process the bid submission logic
  // For now, let's just send a success response
  console.log(`Received bid for product ${productId} from user ${userId} with amount ${bid}`);
  io.emit('bidUpdate', { productId, bid, userId }); // Emit a bid update event to all connected clients
  res.status(200).json({ message: 'Bid submitted successfully' });
});

const PORT = process.env.PORT || 9001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Cleanup function
process.on('SIGINT', () => {
  clearInterval(countdownInterval); // Clear the countdown interval
  process.exit(); // Exit the process
});
