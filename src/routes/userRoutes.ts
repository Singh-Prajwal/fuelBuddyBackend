import { FastifyInstance } from "fastify";
import { verifyToken } from "../auth/middleware";
import { executeGraphQL } from "../hasura/client";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/users",
    { preHandler: verifyToken },
    async (request, reply) => {
      const { name, email } = request.body as { name: string; email: string };
      console.log("name", name);
      console.log("email", email);
      const mutation = `
      mutation addUser($name: String!, $email: String!) {
        insert_Users_one(object: { name: $name, email: $email }) {
          id
          name
          email
        }
      }
    `;

      try {
        const response = await executeGraphQL(mutation, { name, email });
        reply.send({ success: true, user: response.insert_Users_one });
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          message: "Failed to insert user",
          error: error.message || error,
        });
      }
    }
  );

  fastify.get("/users", { preHandler: verifyToken }, async (_, reply) => {
    const query = `
      query MyQuery {
        Users {
          id
          name
          email
          created_at
        }
      }
    `;

    try {
      const response = await executeGraphQL(query);
      console.log("response.data.users", response.Users);
      reply.send({ success: true, users: response.Users });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        message: "Failed to fetch users",
        error: error.message || error,
      });
    }
  });

  fastify.get(
    "/users/:id",
    { preHandler: verifyToken },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const query = `
      query GetUserById($id: uuid!) {
        users_by_pk(id: $id) {
          id
          name
          email
          created_at
        }
      }
    `;

      try {
        const response = await executeGraphQL(query, { id });
        reply.send({ success: true, user: response.data.users_by_pk });
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          message: "Failed to fetch user",
          error: error.message || error,
        });
      }
    }
  );

  fastify.put(
    "/users/:id",
    { preHandler: verifyToken },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { name, email } = request.body as { name: string; email: string };

      const mutation = `
      mutation UpdateUser($id: uuid!, $name: String!, $email: String!) {
        update_Users_by_pk(pk_columns: { id: $id }, _set: { name: $name, email: $email }) {
          id
          email
          name
          updated_at
          created_at
        }
      }
    `;

      try {
        const response = await executeGraphQL(mutation, { id, name, email });
        reply.send({ success: true, user: response.update_Users_by_pk });
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          message: "Failed to update user",
          error: error.message || error,
        });
      }
    }
  );

  fastify.delete(
    "/users/:id",
    { preHandler: verifyToken },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const mutation = `
      mutation DeleteUser($id: uuid!) {
        delete_Users_by_pk(id: $id) {
          id
        }
      }
    `;

      try {
        const data = await executeGraphQL(mutation, { id });
        reply.send({ message: "User deleted", id: data.delete_Users_by_pk.id });
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          message: "Failed to delete user",
          error: error.message || error,
        });
      }
    }
  );
}
