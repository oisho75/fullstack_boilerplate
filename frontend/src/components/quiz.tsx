import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	quizPath,
	scoresApiUrl,
	quizQuestionApiUrl,
	allScoresApiUrl,
} from "@/paths";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// Logic for each quiz item. Get total score to display and top score from the scores table
function QuizItem({ title, id }: Quiz) {
	const [score, setScore] = useState<number | null>(null);
	// const [allScores, setAllScores] = useState<number | null>(null);
	const [totalPoints, setTotalPoints] = useState(0);

	//All Scores api used for testing and checking results
	// useEffect(() => {
	// 	fetch(allScoresApiUrl({}))
	// 		.then((res) => res.json())
	// 		.then(setAllScores)
	// 		.catch((err) => {
	// 			console.error("Failed to fetch questions", err);
	// 		});
	// }, []);

	useEffect(() => {
		fetch(quizQuestionApiUrl({ id: id.toString() }))
			.then((res) => res.json())
			.then((questions: { points: number }[]) => {
				const total = questions.reduce((sum, q) => sum + q.points, 0);
				setTotalPoints(total);
			})
			.catch((err) => {
				console.error("Failed to fetch questions", err);
				setTotalPoints(0);
			});
	}, [id]);

	useEffect(() => {
		fetch(scoresApiUrl({ assignment_id: id.toString(), user_id: "1" }))
			.then((res) => {
				if (!res.ok) throw new Error("No score");
				return res.json();
			})
			.then((data) => setScore(data.score))
			.catch(() => setScore(null));
	}, [id]);

	const handleResetClick = () => {
		const quizKey = `quiz-progress-${id}`;
		localStorage.removeItem(quizKey);
		//console.log("ALLs scores", allScores, localStorage, quizKey);
	};

	// Buttons to take quiz and then reset the answers to retake quiz with link to quiz page
	return (
		<TableRow>
			<TableCell>{id}</TableCell>
			<TableCell>{title}</TableCell>
			<TableCell>
				<Button asChild>
					<Link to={quizPath({ id: id.toString() })}>Take quiz</Link>
				</Button>
				<Button variant="outline" onClick={handleResetClick}>
					<Link to={quizPath({ id: id.toString() })}>
						Reset and Take Quiz Again
					</Link>
				</Button>
			</TableCell>
			{score != null ? (
				<TableCell>
					{score}/{totalPoints}
				</TableCell>
			) : (
				<TableCell>No Score Recorded</TableCell>
			)}
		</TableRow>
	);
}

export type Quiz = {
	id: number;
	title: string;
};

export function QuizzesList({ quizzes }: { quizzes: Quiz[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Actions</TableHead>
					<TableHead>Best Recorded Score</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>{quizzes.map((quiz) => QuizItem(quiz))}</TableBody>
		</Table>
	);
}
