require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const { sequelize, connectDB } = require('./db');
const todoRoutes = require('./routes/todos');

async function start() {
  // DB connect
  await connectDB();

  // Sync models -> Roman Urdu: ab table auto create ho jayega
  await sequelize.sync({ alter: true });
 // ya alter:true

  // Register routes
  fastify.register(require('@fastify/formbody'));
  fastify.register(todoRoutes);

  // Health route
  fastify.get('/health', async () => ({ status: 'ok' }));

  const port = process.env.PORT || 4000;
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();