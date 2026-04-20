const mongoose = require('mongoose');

const connection = async() => {
    try{
        // Support common env var names across hosts.
        const rawMongoUri =
            process.env.MONGODB_CONNECTION_URI ||
            process.env.MONGODB_URI ||
            process.env.MONGO_URI ||
            '';
        const mongoDbName = (process.env.MONGODB_DATABASE_NAME || '').trim();

        const mongoUri = String(rawMongoUri)
            .trim()
            // Render (or copy/paste) sometimes includes quotes; strip a single wrapping pair.
            .replace(/^"(.*)"$/, '$1')
            .replace(/^'(.*)'$/, '$1');

        if (!mongoUri) {
            throw new Error(
                'Missing MongoDB connection string. Set MONGODB_CONNECTION_URI (or MONGODB_URI / MONGO_URI).'
            );
        }

        if (!/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
            throw new Error(
                'Invalid MongoDB connection string scheme. It must start with "mongodb://" or "mongodb+srv://".'
            );
        }

        // Set connection options to prevent buffering timeout
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        };
        
        // If the URI already includes a database path, don't append another.
        // Also ensure we insert the db name before any query string.
        const hasDbPath = (() => {
            try {
                const u = new URL(mongoUri);
                return Boolean(u.pathname && u.pathname !== '/');
            } catch {
                // Non-standard but still potentially valid for the driver; treat as "unknown"
                return false;
            }
        })();

        const finalUri = (!hasDbPath && mongoDbName)
            ? mongoUri.replace(/\/(\?)/, `/${mongoDbName}$1`).replace(/\/?$/, `/${mongoDbName}`)
            : mongoUri;

        if (!hasDbPath && !mongoDbName) {
            throw new Error(
                'Missing MongoDB database name. Set MONGODB_DATABASE_NAME or include the db name in the connection string.'
            );
        }

        const res = await mongoose.connect(finalUri, options);
        if(res) {
            console.log("Connected to RTN FG Church mongodb")
        }
    }catch(err){
        console.error('Database connection error:', err.message)
        throw err; // Re-throw to allow caller to handle
    }
}
    
module.exports = connection
