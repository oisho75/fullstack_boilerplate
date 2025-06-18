import { scoresBaseUrl } from "@/paths";
import { useEffect, useState } from "react";

//Quiz stepper that makes sure to list each question 1 at a time.
export function QuizStepper({ questions }: { questions: Question[] }) {
	// Unique key based on quiz ID to persist progress per quiz
	const quizKey = `quiz-progress-${questions[0]?.assignment_id}`;

	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<number, string>>({});
	const [earnedPoints, setEarnedPoints] = useState(0);
	const [totalPoints, setTotalPoints] = useState(0);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [submitted, setSubmitted] = useState(false);
	const [hasHydrated, setHasHydrated] = useState(false);
	const currentQuestion = questions[currentIndex];
	const isLastQuestion = currentIndex === questions.length - 1;
	const isFirstQuestion = currentIndex === 0;

	// Load from localStorage once on mount
	useEffect(() => {
		const saved = localStorage.getItem(quizKey);
		// console.log(localStorage, saved, quizKey);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setCurrentIndex(parsed.currentIndex ?? 0);
				setAnswers(parsed.answers ?? {});
				setSubmitted(parsed.submitted ?? false);
				setCorrectAnswers(parsed.correctAnswers ?? 0);
				setEarnedPoints(parsed.earnedPoints ?? 0);
				setTotalPoints(parsed.totalPoints ?? 0);
				setHasHydrated(true);
			} catch (err) {
				console.error("Error parsing saved quiz progress", err);
			}
		}
	}, [quizKey]);

	// Save to localStorage on state change *after* initial load
	//Needed so it does not reset the local storage on inital renders
	useEffect(() => {
		if (!hasHydrated && localStorage.getItem(quizKey) != null) return; //  skip initial render

		const data = {
			currentIndex,
			answers,
			submitted,
			earnedPoints,
			totalPoints,
			correctAnswers,
		};
		localStorage.setItem(quizKey, JSON.stringify(data));
		// console.log("lMaybe reseting", localStorage, quizKey);
	}, [
		currentIndex,
		answers,
		submitted,
		quizKey,
		hasHydrated,
		earnedPoints,
		totalPoints,
		correctAnswers,
	]);

	// Set the answer when new radio button is clicked
	const handleChoiceChange = (value: string) => {
		setAnswers((prev) => ({
			...prev,
			[currentQuestion.id]: value,
		}));
	};

	//Submit logic
	const handleSubmit = () => {
		//Calculate the points by comparing answers to correct stored answers
		let points = 0;
		let totalPoints = 0;
		let correctAnswersCount = 0;
		for (let i = 0; i < questions.length; i++) {
			totalPoints += questions[i].points;
			if (questions[i].answer === answers[questions[i].id]) {
				points += questions[i].points;
				correctAnswersCount++;
			}
		}

		const user_id = 1; // Only using user 1 but could expand to others
		const assignment_id = questions[0]?.assignment_id; // quiz id to keep track of scores in scores table

		fetch(scoresBaseUrl(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				assignment_id,
				user_id,
				score: points,
			}),
		})
			.then((res) => {
				if (!res.ok) throw new Error("Failed to save score");
				return res.json();
			})
			.then((data) => {
				console.log("Score submitted successfully:", data);
			})
			.catch((err) => {
				console.error("Error submitting score:", err);
			});

		setEarnedPoints(points);
		setTotalPoints(totalPoints);
		setCorrectAnswers(correctAnswersCount);
		// console.log(answers, questions, "SUBMIT", points, totalPoints);
		setSubmitted(true);
	};

	// function for rendering the choices
	const renderChoices = () => {
		const choices = currentQuestion.choices
			? currentQuestion.choices.split(";;").map((c) => c.trim())
			: [];

		const selected = answers[currentQuestion.id];
		//Map over choices and give each one a radio button
		return (
			<div className="flex flex-col space-y-2">
				{choices.map((choice, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<label key={index} className="flex items-center space-x-2">
						<input
							type="radio"
							name={`question-${currentQuestion.id}`}
							value={choice}
							checked={selected === choice}
							onChange={() => handleChoiceChange(choice)}
							disabled={submitted}
						/>
						<span>{choice}</span>
					</label>
				))}
			</div>
		);
	};

	// Logic for showing back/next/submit buttons based on index and whether it is submitted or not.
	// Also contains logic for showing correct answer and points on submission
	return (
		<div className="space-y-6">
			<div className="border p-4 rounded-md">
				<p className="font-semibold mb-2">
					Question {currentIndex + 1} of {questions.length}
				</p>
				<p className="mb-4">{currentQuestion.title}</p>
				{renderChoices()}
				{submitted && currentQuestion.answer === answers[currentQuestion.id] ? (
					<div className="border p-4 rounded-md">
						<p className="font-semibold mb-2">
							Correct Answer: {currentQuestion.points}/{currentQuestion.points}
						</p>
					</div>
				) : (
					submitted && (
						<div className="border p-4 rounded-md">
							<p className="font-semibold mb-2">
								Incorect Answer: 0/{currentQuestion.points}
							</p>
							<p className="mb-4">
								The Correct Answer is: {currentQuestion.answer}
							</p>
						</div>
					)
				)}
				{submitted && (
					<div className="border p-4 rounded-md">
						<p className="mb-4">
							Correct Answers: {correctAnswers}/{questions.length}
						</p>
						<p className="font-semibold mb-2">
							Total Points Earned: {earnedPoints}/{totalPoints}
						</p>
					</div>
				)}
			</div>

			<div className="flex justify-between">
				<button
					type="button"
					onClick={() => setCurrentIndex((i) => i - 1)}
					disabled={isFirstQuestion}
					className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
				>
					← Back
				</button>
				{!submitted && isLastQuestion ? ( //!submitted &&
					<button
						type="button"
						onClick={handleSubmit}
						className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
					>
						Submit
					</button>
				) : (
					<button
						type="button"
						onClick={() => setCurrentIndex((i) => i + 1)}
						className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
						disabled={isLastQuestion}
					>
						Next →
					</button>
				)}
			</div>
		</div>
	);
}
//Question type
export type Question = {
	id: number;
	assignment_id: number;
	title: string;
	choices: string;
	answer: string;
	points: number;
};
