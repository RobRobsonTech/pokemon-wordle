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
	const [todaysPokemonPicture, setTodaysPokemonPicture] = useState("");
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
	const [usedHint, setUsedHint] = useState(false);

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
			if (todaysPokemon) {
				const response = await fetch(
					`https://pokeapi.co/api/v2/pokemon/${todaysPokemon}`
				);
				const data = await response.json();
				const todaysPokemonData = data;
				setTodaysPokemonData([todaysPokemonData]);

				let todaysPokemonPicture = "";

				if (todaysPokemonData?.sprites?.other?.dream_world?.front_default) {
					todaysPokemonPicture =
						todaysPokemonData?.sprites?.other?.dream_world?.front_default;
				} else if (todaysPokemonData?.sprites?.other?.home?.front_default) {
					todaysPokemonPicture =
						todaysPokemonData?.sprites?.other?.home?.front_default;
				} else if (todaysPokemonData?.sprites?.front_default) {
					todaysPokemonPicture = todaysPokemonData.sprites.front_default;
				}

				setTodaysPokemonPicture(todaysPokemonPicture);
			}
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
				"Who's that Pokemon??? Sorry... that Pokemon was not found! Please check your spelling and try again."
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
		if (event.target.value.length > todaysPokemonLettersValue) {
			return;
		}

		setErrorMessage("");

		let slicedGuesses = guesses.slice();
		slicedGuesses[guessNumber] = event.target.value;
		setGuesses(slicedGuesses);
	};

	const handleClose = () => {
		setShowWinningModal(false);
	};

	const handleHintDisplay = () => {
		setShowPokemonHint(!showPokemonHint);
		setUsedHint(true);
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
					<>
						{todaysPokemonPicture ? (
							<img
								src={todaysPokemonPicture}
								alt="Today's pokemon"
								className="wordle__pokemon__image"
							/>
						) : (
							<div>
								Well that's embarrassing... we couldn't find an image to use as
								a hint. So here's the first letter of today's Pokemon:{" "}
								{todaysPokemon.charAt(0)}
							</div>
						)}
					</>
				)}
				<p>
					It took you {guessNumber} guess
					{guessNumber > 1 ? <>es</> : null} today!
				</p>
				{usedHint && <p>Although... you did use the hint 🤪</p>}
			</Modal>

			<Modal
				title="Need a hint?"
				visible={showHintModal}
				onOk={() => setShowHintModal(false)}
				onCancel={() => setShowHintModal(false)}
				footer={null}
			>
				<Button type="primary" onClick={handleHintDisplay}>
					{showPokemonHint ? (
						<>Hide Hint Picture..?</>
					) : (
						<>Reveal Hint Picture..?</>
					)}
				</Button>
				{showPokemonHint && todaysPokemonPicture && (
					<img
						src={todaysPokemonPicture}
						alt="Today's pokemon"
						className="wordle__pokemon__image wordle__hint__pokemon__image"
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
					{todaysPokemonLettersValue && (
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
					)}
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
					{errorMessage && (
						<>
							<div className="error_message">{errorMessage}</div>
							<img
								src={require("./assets/img/MissingNo.png")}
								alt="MissingNo"
								className="error__image rotate"
							/>
						</>
					)}
				</Footer>
			</Layout>
		</>
	);
}

export default App;
