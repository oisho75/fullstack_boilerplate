import cors from "@fastify/cors";
import fastify from "fastify";
import { db } from "./db-client";

const server = fastify();

server.register(cors, {});

const PORT = +(process.env.BACKEND_SERVER_PORT ?? 3001);
//ALL API for different tables
server.get("/", async (_request, _reply) => {
	return "hello world\n";
});

server.get("/users", (_request, reply) => {
	const data = db.prepare("SELECT * FROM users").all();

	return data;
});
// Get all quizzes
server.get("/quizzes", (_request, reply) => {
	const data = db.prepare("SELECT * FROM assignments").all();

	return data;
});
// Get all scores used for testing and checking that scores were stored
server.get("/scores", (_request, reply) => {
	const data = db.prepare("SELECT * FROM scores").all();

	return data;
});
// Get specific quiz
server.get("/quizzes/:id", (request, reply) => {
	const data = db.prepare("SELECT * FROM assignments WHERE id = :id");

	return data.get(request.params);
});
//Get specific score for certain quiz and user
server.get("/scores/:assignment_id/:user_id", (request, reply) => {
	const params = request.params as {
		assignment_id: number;
		user_id: number;
	};

	const { assignment_id, user_id } = params;

	const stmt = db.prepare(`
		SELECT *
		FROM scores
		WHERE assignment_id = :assignment_id AND user_id = :user_id
		ORDER BY score DESC
		LIMIT 1
	`);

	const result = stmt.get({ assignment_id, user_id });

	if (!result) {
		return reply.code(404).send({ message: "No score found" });
	}

	return reply.send(result);
});
// Post a user's score for a specific quiz
server.post("/scores", async (request, reply) => {
	const body = request.body as {
		assignment_id: number;
		user_id: number;
		score: number;
	};
	const { assignment_id, user_id, score } = body;
	if (!assignment_id || !user_id || score === undefined) {
		return reply.code(400).send({ error: "Missing fields" });
	}

	const stmt = db.prepare(`
		INSERT INTO scores (assignment_id, user_id, score)
		VALUES (:assignment_id, :user_id, :score)
	`);

	try {
		const result = stmt.run({ assignment_id, user_id, score });
		reply.code(201).send({ id: result.lastInsertRowid });
	} catch (err) {
		console.error("Failed to insert score:", err);
		reply.code(500).send({ error: "Internal Server Error" });
	}
});
//Questions for a specific quiz
server.get("/quizzes/:id/questions", (request, reply) => {
	const stmt = db.prepare(`
		SELECT id, assignment_id, title, choices, answer, points
		FROM assignment_questions
		WHERE assignment_id = :id
	`);
	const questions = stmt.all(request.params);

	return questions;
});

server.listen({ port: PORT }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at http://localhost:${PORT}`);
});
