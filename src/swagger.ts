import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";

export async function setupSwagger(fastify: FastifyInstance) {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Fastify Firebase Hasura API",
        description: "API documentation for Fastify app with Firebase & Hasura",
        version: "1.0.0",
      },
    },
  });

  await fastify.register(fastifySwaggerUI, {
    routePrefix: "/docs",
  });
}
