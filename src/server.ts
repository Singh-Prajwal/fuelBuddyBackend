import Fastify from "fastify";
import userRoutes from "./routes/userRoutes";
import { setupSwagger } from "./swagger";
import cors from "@fastify/cors";
const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: "http://localhost:3001", // Allow only frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true,
});
setupSwagger(fastify);
fastify.register(userRoutes);

fastify.listen({ port: 3000 }, () => {
  console.log("Server running on http://localhost:3000");
});
