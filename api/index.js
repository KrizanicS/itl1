const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { sequelize } = require('./config/database');
const passportConfig = require('./config/passport');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
passportConfig(passport);

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.json({ status: 'ok', database: 'disconnected' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Taxi App API - NodeJS, Express, MySQL, Sequelize' });
});

// Sync database and start server
const startServer = async () => {
  try {
    let retries = 10;
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        break;
      } catch (err) {
        console.log(`Waiting for database... (${retries} retries left)`);
        retries--;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
