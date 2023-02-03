import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = fastify();

app.get('/', async () => {
  return { message: 'Hello API' };
});

app.get('/posts', async () => {
  const posts = await prisma.post.findMany();
  console.log('new stuff5');
  return { posts };
});

const start = async () => {
  try {
    const address = await app.listen({ port, host: '0.0.0.0' });
    console.log(`[ ready ] Server listening on ${address}`);
  } catch (err) {
    // Errors are logged herep
    process.exit(1);
  }
};

start();
