const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://xd:xd@todos.vrqt8pk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Conectar a la base de datos al importar este módulo
async function connectToDatabase() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error;
  }
}

// Exportar la función para obtener la instancia de la base de datos
function getDb() {
  return client.db("todos"); // nombre base de datos
}

module.exports = {
  connectToDatabase,
  getDb,
};
