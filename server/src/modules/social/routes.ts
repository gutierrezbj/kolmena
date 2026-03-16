import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import {
  listPosts, getPost, createPost, updatePost, deletePost,
  listPolls, getPollWithOptions, createPoll, votePoll, closePoll,
} from './social.service.js';

const communityParam = z.object({ communityId: z.string().uuid() });
const idParam = z.object({ id: z.string().uuid() });

const createPostBody = z.object({
  title: z.string().min(1).max(255),
  body: z.string().min(1),
  type: z.enum(['announcement', 'general', 'event']).optional(),
  isPinned: z.boolean().optional(),
});

const updatePostBody = z.object({
  title: z.string().min(1).max(255).optional(),
  body: z.string().min(1).optional(),
  isPinned: z.boolean().optional(),
});

const createPollBody = z.object({
  question: z.string().min(3).max(500),
  options: z.array(z.string().min(1).max(255)).min(2).max(10),
  endsAt: z.string().datetime().optional(),
});

const voteBody = z.object({
  optionId: z.string().uuid(),
});

export async function socialRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();
  typedApp.addHook('preHandler', authGuard);

  // --- Posts ---

  typedApp.get('/communities/:communityId/posts', {
    schema: { params: communityParam, tags: ['social'] },
  }, async (request) => {
    return { posts: await listPosts(request.params.communityId) };
  });

  typedApp.post('/communities/:communityId/posts', {
    schema: { params: communityParam, body: createPostBody, tags: ['social'] },
  }, async (request, reply) => {
    const post = await createPost(request.params.communityId, request.user!.id, request.body);
    return reply.status(201).send({ post });
  });

  typedApp.get('/posts/:id', {
    schema: { params: idParam, tags: ['social'] },
  }, async (request) => {
    return { post: await getPost(request.params.id) };
  });

  typedApp.patch('/posts/:id', {
    schema: { params: idParam, body: updatePostBody, tags: ['social'] },
  }, async (request) => {
    return { post: await updatePost(request.params.id, request.body) };
  });

  typedApp.delete('/posts/:id', {
    schema: { params: idParam, tags: ['social'] },
  }, async (request, reply) => {
    await deletePost(request.params.id);
    return reply.status(204).send();
  });

  // --- Polls ---

  typedApp.get('/communities/:communityId/polls', {
    schema: { params: communityParam, tags: ['social'] },
  }, async (request) => {
    return { polls: await listPolls(request.params.communityId) };
  });

  typedApp.post('/communities/:communityId/polls', {
    schema: { params: communityParam, body: createPollBody, tags: ['social'] },
  }, async (request, reply) => {
    const poll = await createPoll(request.params.communityId, request.user!.id, request.body);
    return reply.status(201).send({ poll });
  });

  typedApp.get('/polls/:id', {
    schema: { params: idParam, tags: ['social'] },
  }, async (request) => {
    return { poll: await getPollWithOptions(request.params.id) };
  });

  typedApp.post('/polls/:id/vote', {
    schema: { params: idParam, body: voteBody, tags: ['social'] },
  }, async (request, reply) => {
    const vote = await votePoll(request.params.id, request.body.optionId, request.user!.id);
    return reply.status(201).send({ vote });
  });

  typedApp.patch('/polls/:id/close', {
    schema: { params: idParam, tags: ['social'] },
  }, async (request) => {
    return { poll: await closePoll(request.params.id) };
  });
}
