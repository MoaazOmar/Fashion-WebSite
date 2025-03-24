const express = require('express');
const cors = require('cors'); 
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs'); 

const homeRouter = require('./Routes/home.route');
const connectToDB = require('./Config/database.config');
const productRouter = require('./Routes/singleProduct.route');
const allProductRouter = require('./Routes/products.route');
const authRouter = require('./Routes/auth.route');
const cartRouter = require('./Routes/cart.route');
const adminRouter = require('./Routes/admin.route');
const formRouter  = require('./Routes/form.route');
const orderRouter = require('./Routes/order.route');

const session = require('express-session');
const sessionStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'images')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));

// Session store
const STORE = new sessionStore({
    uri: 'mongodb://127.0.0.1:27017/online-shops',
    collection: 'sessions'
});

// Define session middleware
const sessionMiddleware = session({
    secret: 'this my secret hash express sessions to encrypt......',
    saveUninitialized: false,
    resave: false,
    store: STORE
});
app.use(sessionMiddleware);

// Middleware to parse JSON data
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: 'http://localhost:4200',  // Your frontend URL
    credentials: true  // Ensure cookies/sessions can be sent with requests
}));

// Flash middleware
app.use(flash());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

// Create the HTTP server and initialize Socket.IO
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
      origin: "http://localhost:4200", // Allow Angular app origin
      methods: ["GET", "POST"],
      credentials: true
    }
});
  
// Require your socket file and pass in io and sessionMiddleware
require('./public/newComment.socket')(io, sessionMiddleware);

// Socket connection event for joining rooms
io.on('connection', (socket) => {
    socket.on('joinRoom', (roomId) => {
        console.log('Socket joining room:', roomId);
        socket.join(roomId);
    });
});

// Define routes
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.use('/product', productRouter);
app.use('/products', allProductRouter);
app.use('/admin', adminRouter);
app.use('/form', formRouter);
app.use('/order', orderRouter);
app.use('/', homeRouter);
// Connect to the database
connectToDB.connectDB();

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
