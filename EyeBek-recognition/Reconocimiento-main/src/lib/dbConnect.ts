import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ No se encontró la variable MONGODB_URI");
}

// 👇 Guardamos la conexión en un objeto global para reutilizarla
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnection() {
  if (cached.conn) {
    // Ya existe una conexión activa, la reutilizamos
    return cached.conn;
  }

  if (!cached.promise) {
    // Si no existe, creamos una nueva promesa de conexión
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false, // Evita comandos en cola mientras se conecta
      })
      .then((mongoose) => {
        console.log("✅ MongoDB conectado correctamente");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ Error al conectar con MongoDB:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


// import mongoose from "mongoose";

// mongoose.set('strictQuery', false);

// // ...existing code...
// const dbConnection = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI!);
//     console.log("MongoDB connected");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//   }
// };

// export default dbConnection;