const redis = require('../redis');
const Todo = require('../models/Todo');

async function routes(fastify, opts) {
  // CREATE
  fastify.post('/todos', async (request, reply) => {
    try {
      const { title, completed } = request.body || {};
      if (!title) {
        return reply.code(400).send({ error: 'title is required' });
      }
      console.log(title);
      const todo = await Todo.create({ title, completed });
      await redis.del('todos:all');
      return reply.code(201).send(todo);
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  });

  // READ ALL
  fastify.get('/todos', async (request, reply) => {
    try {
      // Redis mai todos list ke 
      const cacheKey = 'todos:all';

      const cached = await redis.get(cacheKey);
      if(cached) {  
        return reply.send(JSON.parse(cached));
      }

      const todos = await Todo.findAll({ order: [['createdAt', 'DESC']] });
      console.log("Todos",todos);
      

      await redis.set(cacheKey, JSON.stringify(todos), 'EX',60);

      return reply.send(todos);
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  });

  // READ ONE
  fastify.get('/todos/:id', async (request, reply) => {
    try {
      const { id } = request.params;
       const cacheKey = `todo:${id}`;

       const cached = await redis.get(cacheKey);
       if (cached) return reply.send(JSON.parse(cached));

      const todo = await Todo.findByPk(id);
      if (!todo) return reply.code(404).send({ error: 'Not found' });

      await redis.set(cacheKey, JSON.stringify(todo), 'EX', 60);
      return reply.send(todo);
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  });

  // UPDATE
  fastify.put('/todos/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { title, completed } = request.body || {};
      const todo = await Todo.findByPk(id);
      if (!todo) return reply.code(404).send({ error: 'Not found' });

      if (title !== undefined) todo.title = title;
      if (completed !== undefined) todo.completed = completed;

      await todo.save();
      await redis.del('todos:all');
      await redis.del(`todo:${id}`);
      return reply.send(todo);
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  });

  // DELETE
  fastify.delete('/todos/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const todo = await Todo.findByPk(id);
      if (!todo) return reply.code(404).send({ error: 'Not found' });

      await todo.destroy();
      await redis.del('todos:all');
      await redis.del(`todo:${id}`);
      return reply.code(204).send(); // No content
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    }
  });
}

module.exports = routes;