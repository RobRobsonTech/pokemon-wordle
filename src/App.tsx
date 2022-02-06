import React, { useState, useEffect } from "react";
import { Button, Input, Layout, Modal } from "antd";

import { QuestionCircleOutlined } from "@ant-design/icons";
import GameRow from "./components/GameRow";
import "./App.css";

const { Header, Content, Footer } = Layout;

interface App {
	sprites: string;
	dream_world: string;
	front_default: string;
}

function App() {
	const [myData, setMyData] = useState<any[]>([]);
	const [todaysPokemonData, setTodaysPokemonData] = useState<any[]>([]);
	const [todaysPokemon, setTodaysPokemon] = useState("");
	const [todaysPokemonLettersValue, setTodaysPokemonLettersValue] = useState(0);
	const [todaysLetters, setTodaysLetters] = useState([]);
	const [guesses, setGuesses] = useState<any[]>(["", "", "", "", "", ""]);
	const [guessesSubmitted, setGuessesSubmitted] = useState([
		false,
		false,
		false,
		false,
		false,
		false,
	]);
	const [errorMessage, setErrorMessage] = useState("");

	const [guessNumber, setGuessNumber] = useState(0);
	const [showWinningModal, setShowWinningModal] = useState(false);
	const [isGameComplete, setIsGameComplete] = useState(false);
	const [showHintModal, setShowHintModal] = useState(false);
	const [showPokemonHint, setShowPokemonHint] = useState(false);

	useEffect(() => {
		const getData = async () => {
			// const response = await fetch(
			// 	"https://pokeapi.co/api/v2/pokemon?limit=151"
			// );
			const response = await fetch(
				"https://pokeapi.co/api/v2/pokemon?limit=898"
			);
			const data = await response.json();
			setMyData(data.results);
		};
		getData();
	}, []);

	useEffect(() => {
		if (myData.length > 0) {
			let chosenDate = new Date();

			// To test a different word, set the chosen date to tomorrow's date
			// let tomorrow = new Date();
			// tomorrow.setDate(tomorrow.getDate() + 1);
			// chosenDate = tomorrow;

			const chosenDay = chosenDate.getUTCDate();
			const chosenMonth = chosenDate.getUTCMonth() + 1;
			const chosenYear = chosenDate.getUTCFullYear();

			const dateNumber = chosenDay + chosenMonth + chosenYear;

			const maximum = myData.length;
			const minimum = 1;

			// Generate a random seeded number.
			const seedrandom = require("seedrandom");
			const generator = seedrandom(dateNumber);
			const chosenNumber = generator();

			const calculatedPokemonNumber =
				Math.floor(chosenNumber * (maximum - minimum + 1)) + minimum;

			const todaysPokemonName = myData[calculatedPokemonNumber]?.name;

			setTodaysPokemon(todaysPokemonName);

			const todaysPokemonLettersValue = todaysPokemonName.split("");
			setTodaysLetters(todaysPokemonLettersValue);
			setTodaysPokemonLettersValue(todaysPokemonLettersValue.length);
		}
	}, [myData]);

	useEffect(() => {
		const getPokemonSprite = async () => {
			const response = await fetch(
				`https://pokeapi.co/api/v2/pokemon/${todaysPokemon}`
			);
			const data = await response.json();
			setTodaysPokemonData([data]);
		};
		getPokemonSprite();
	}, [todaysPokemon]);

	const handleSubmit = () => {
		// Check if the guess is the correct length
		if (guesses[guessNumber].length !== todaysPokemonLettersValue) {
			setErrorMessage("Not enough characters entered!");
			return;
		}

		// Check if pokemon exists in our data
		if (
			!myData.some(
				(pokemon) =>
					pokemon.name.toLowerCase() === guesses[guessNumber].toLowerCase()
			)
		) {
			setErrorMessage(
				"Pokemon not found! Please check your spelling and try again."
			);
			return;
		}

		// Adjust array to state new guess has been submitted
		let slicedSubmittedGuesses = guessesSubmitted.slice();
		slicedSubmittedGuesses[guessNumber] = true;
		setGuessesSubmitted(slicedSubmittedGuesses);

		// Increase guess number & refocus input
		setGuessNumber(guessNumber + 1);
		document?.getElementById("guess_input")?.focus();

		// Check if the guess is fully correct
		if (guesses[guessNumber].toLowerCase() === todaysPokemon.toLowerCase()) {
			setShowWinningModal(true);
			setIsGameComplete(true);
			return;
		}
	};

	const handleChange = (event: { target: { value: any } }) => {
		setErrorMessage("");
		let slicedGuesses = guesses.slice();
		slicedGuesses[guessNumber] = event.target.value;
		setGuesses(slicedGuesses);
	};

	const handleClose = () => {
		setShowWinningModal(false);
	};

	return (
		<>
			{showWinningModal}
			<Modal
				title="Congratulations!!!"
				visible={showWinningModal}
				onOk={handleClose}
				onCancel={handleClose}
				footer={null}
			>
				<p>You're a winner!</p>
				{todaysPokemonData && (
					<img
						src={
							todaysPokemonData[0]?.sprites?.other?.dream_world?.front_default
						}
						alt="Today's pokemon"
					/>
				)}
				<p>
					It took you {guessNumber} guess
					{guessNumber > 1 ? <>es</> : null} today!
				</p>
			</Modal>

			<Modal
				title="Need a hint?"
				visible={showHintModal}
				onOk={() => setShowHintModal(false)}
				onCancel={() => setShowHintModal(false)}
				footer={null}
			>
				<Button type="primary" onClick={() => setShowPokemonHint(true)}>
					Reveal Hint Picture..?
				</Button>
				{showPokemonHint && todaysPokemonData && (
					<img
						src={todaysPokemonData[0]?.sprites.other.dream_world.front_default}
						alt="Today's pokemon"
						className="wordle__hint__pokemon__image"
					/>
				)}
			</Modal>

			<Layout className="App d-flex">
				<Header className="wordle__header">
					<span className="wordle__title">Pokemon Wordle</span>
					{/* <div>Today's pokemon is... {myData[todaysPokemon]?.name}</div> */}
					<span className="wordle__hint" onClick={() => setShowHintModal(true)}>
						<QuestionCircleOutlined className="wordle__hint__image" />
					</span>
				</Header>
				<Content className="wordle__board">
					<div>
						{[...Array(guesses.length)].map(
							(value: undefined, index: number) => (
								<GameRow
									todaysLetters={todaysLetters}
									todaysPokemonLettersValue={todaysPokemonLettersValue}
									guessValue={guesses[index]}
									rowNumber={index}
									guessesSubmitted={guessesSubmitted}
								/>
							)
						)}
					</div>
				</Content>

				<Footer className="wordle__footer">
					<Input.Group compact>
						<Input
							id="guess_input"
							style={{ width: "calc(100% - 200px)" }}
							placeholder="Guess a pokemon..."
							onChange={handleChange}
							value={guesses[guessNumber]}
							maxLength={todaysPokemonLettersValue}
							className="wordle__input"
							disabled={isGameComplete}
						/>
						<Button
							type="primary"
							onClick={handleSubmit}
							disabled={isGameComplete}
						>
							Submit Guess
						</Button>
					</Input.Group>
					{errorMessage && <div className="error_message">{errorMessage}</div>}
				</Footer>
			</Layout>
		</>
	);
}

export default App;
