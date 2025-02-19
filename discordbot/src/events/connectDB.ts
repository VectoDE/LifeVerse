import mongoose from "mongoose"; // Importing mongoose for database connection

// Function to connect to MongoDB
export const connectDB = async () => {
    try {
        // Retrieve the MongoDB URI from environment variables
        const mongoURI = process.env.MONGO_URI;

        // Check if the MongoDB URI is defined; if not, throw an error
        if (!mongoURI) {
            throw new Error("MongoDB URI is not defined in environment variables.");
        }

        // Attempt to connect to MongoDB using the provided URI
        const conn = await mongoose.connect(mongoURI);

        // Log a success message with the host of the connected database
        console.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If an error occurs during connection
        if (error instanceof Error) {
            // Log the error message if it's an instance of Error
            console.error(`Error: ${error.message}`);
        } else {
            // Log a generic error message for unknown errors
            console.error("An unknown error occurred");
        }
        // Exit the process with a failure code
        process.exit(1);
    }
};
