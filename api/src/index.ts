import express from 'express';

const app = express();

// Configurations
const PORT = 3000;

// Middlewares
app.use(express.json());

app.listen(PORT, () => {
    console.log(`API is running on port ${PORT || 3000}`);
});