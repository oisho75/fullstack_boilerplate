import type { Question } from "@/components/question";
import { QuizStepper } from "@/components/question";
import type { Quiz } from "@/components/quiz";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { quizApiUrl, quizQuestionApiUrl, rootPath } from "@/paths";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// Actual Quiz page. Get the Quiz and questions from the DB with useEffect()
//State in React is a way to store and manage dynamic data in a component.
// This effect runs: Once on component mount and whenever specified state values change
export function QuizPage() {
	const { id } = useParams();
	if (!id) throw new Error("Quiz id param is required");

	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [questions, setQuestions] = useState<Question[] | null>(null);
	const [error, setError] = useState<Error | null>(null);
	useEffect(() => {
		fetch(quizApiUrl({ id }))
			.then((res) => res.json())
			.then(setQuiz)
			.catch(setError);
	}, [id]);
	useEffect(() => {
		fetch(quizQuestionApiUrl({ id }))
			.then((res) => res.json())
			.then(setQuestions)
			.catch(setError);
	}, [id]);

	if (error)
		return (
			<div className="text-red-500 p-4">
				<p className="font-bold mb-1">An error has occurred:</p>
				<p>{error.message}</p>
			</div>
		);

	if (!quiz || !questions)
		return <div className="text-center p-8">Loading...</div>;

	return (
		<Card className="w-[600px] mx-auto">
			<CardHeader className="pb-8">
				<CardTitle>
					Quiz #{quiz.id}: {quiz.title}
				</CardTitle>
				<CardDescription>Quiz details below...</CardDescription>

				<QuizStepper questions={questions} />
			</CardHeader>
			<CardFooter className="flex justify-between pt-8">
				<Link
					to={rootPath.pattern}
					className="text-muted-foreground hover:text-blue-600"
				>
					Back to home page
				</Link>
			</CardFooter>
		</Card>
	);
}
