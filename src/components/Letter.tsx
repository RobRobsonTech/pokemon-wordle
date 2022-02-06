import React from "react";
import "./Letter.css";
import { Col } from "antd";

interface LetterValues {
	letter?: string;
	todaysLetter?: string;
	todaysLetters?: any;
	rowNumber: number;
	guessesSubmitted: any;
}

export default function Letter({
	letter,
	todaysLetter,
	todaysLetters,
	rowNumber,
	guessesSubmitted,
}: LetterValues) {
	return (
		<>
			<Col
				className={`letter__box ${
					guessesSubmitted[rowNumber] &&
					(todaysLetter && todaysLetter.toLowerCase() === letter?.toLowerCase()
						? "letter__box__correct"
						: todaysLetters?.includes(letter?.toLowerCase())
						? "letter_box_wrong_spot"
						: "letter_box_incorrect")
				} `}
			>
				{letter ? letter : null}
			</Col>
		</>
	);
}
