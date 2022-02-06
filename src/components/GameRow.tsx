import React from "react";
import Letter from "./Letter";
import { Row } from "antd";

import "./GameRow.css";

interface RowValues {
	todaysLetters?: any;
	guess?: string;
	todaysPokemonLettersValue?: number;
	guessValue?: string;
	rowNumber: number;
	guessesSubmitted: any;
}

export default function GameRow({
	todaysLetters,
	guess,
	todaysPokemonLettersValue,
	guessValue,
	rowNumber,
	guessesSubmitted,
}: RowValues) {
	const guessLetters = guessValue?.split("");

	if (
		guessLetters &&
		todaysPokemonLettersValue &&
		guessLetters.length < todaysPokemonLettersValue
	) {
		for (let i = 0; guessLetters?.length < todaysPokemonLettersValue; i++) {
			guessLetters?.push(" ");
		}
	}
	return (
		<Row gutter={[16, 16]} className="game__row">
			{guessValue ? (
				<>
					{guessLetters?.map(function (letter, index) {
						return (
							<Letter
								letter={letter}
								todaysLetter={todaysLetters[index]}
								todaysLetters={todaysLetters}
								rowNumber={rowNumber}
								guessesSubmitted={guessesSubmitted}
							/>
						);
					})}
				</>
			) : (
				<>
					{guess ? (
						<>
							{guess.split("").map(function (letter) {
								return (
									<Letter
										letter={letter}
										rowNumber={rowNumber}
										guessesSubmitted={guessesSubmitted}
									/>
								);
							})}
						</>
					) : (
						<>
							{[...Array(todaysPokemonLettersValue)].map(() => (
								<Letter
									rowNumber={rowNumber}
									guessesSubmitted={guessesSubmitted}
								/>
							))}
						</>
					)}
				</>
			)}
		</Row>
	);
}
