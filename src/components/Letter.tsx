import React from "react";
import "./Letter.css";
import { Col } from "antd";

interface LetterValues {
	letter?: string;
}

export default function Letter({ letter }: LetterValues) {
	return <Col className="letter__box mx-2">{letter ? letter : null}</Col>;
}
