import mongoose from 'mongoose';
import dns from 'dns';
import fs from 'fs';
import path from 'path';

// Fix Windows Node.js querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore
}

function getMongoUri() {
  const candidatePaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), 'web-app', '.env.local'),
    path.join(process.cwd(), '..', '..', 'atlas-credentials.env'),
  ];

  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        const text = fs.readFileSync(p, 'utf8');
        const match = text.match(/MONGODB_URI=(.*)/);
        if (match && match[1]) {
          let uri = match[1].trim().replace(/^['"]|['"]$/g, '');
          if (uri.startsWith('mongodb+srv://') && uri.includes('cluster0.uoqctea.mongodb.net')) {
            const authMatch = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);
            if (authMatch) {
              const [, user, pass] = authMatch;
              uri = `mongodb://${user}:${pass}@ac-pr2sokn-shard-00-00.uoqctea.mongodb.net:27017,ac-pr2sokn-shard-00-01.uoqctea.mongodb.net:27017,ac-pr2sokn-shard-00-02.uoqctea.mongodb.net:27017/zipup?ssl=true&replicaSet=atlas-10kjky-shard-0&authSource=admin&appName=Cluster0`;
            }
          }
          process.env.MONGODB_URI = uri;
          return uri;
        }
      }
    } catch {
      // Ignore read error
    }
  }

  let uri = process.env.MONGODB_URI;
  if (uri) {
    if (uri.startsWith('mongodb+srv://') && uri.includes('cluster0.uoqctea.mongodb.net')) {
      const authMatch = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);
      if (authMatch) {
        const [, user, pass] = authMatch;
        uri = `mongodb://${user}:${pass}@ac-pr2sokn-shard-00-00.uoqctea.mongodb.net:27017,ac-pr2sokn-shard-00-01.uoqctea.mongodb.net:27017,ac-pr2sokn-shard-00-02.uoqctea.mongodb.net:27017/zipup?ssl=true&replicaSet=atlas-10kjky-shard-0&authSource=admin&appName=Cluster0`;
        process.env.MONGODB_URI = uri;
      }
    }
    return uri;
  }

  return 'mongodb://localhost:27017/zipup';
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = getMongoUri();
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };
    cached.promise = mongoose.connect(uri, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
