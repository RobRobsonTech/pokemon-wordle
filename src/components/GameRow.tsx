import React from "react";
import Letter from "./Letter";
import { Row } from "antd";

import "./GameRow.css";

interface RowValues {
	todaysWord?: string;
	guess?: string;
	todaysPokemonLetters?: number;
	guessValue?: string;
}

export default function GameRow({
	todaysWord,
	guess,
	todaysPokemonLetters,
	guessValue,
}: RowValues) {
	return (
		<Row gutter={[16, 16]} className="game__row">
			{guessValue ? (
				<>
					{guessValue.split("").map(function (letter) {
						return <Letter letter={letter} />;
					})}
				</>
			) : (
				<>
					{guess ? (
						<>
							{guess.split("").map(function (letter) {
								return <Letter letter={letter} />;
							})}
						</>
					) : (
						<>
							{[...Array(todaysPokemonLetters)].map(() => (
								<Letter />
							))}
						</>
					)}
				</>
			)}
		</Row>
	);
}
