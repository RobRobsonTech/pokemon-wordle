import React, { useState, useEffect } from "react";
import { Button, Input, Layout, Modal } from "antd";

import GameRow from "./components/GameRow";
import "./App.css";

const { Header, Content, Footer } = Layout;

function App() {
	const [myData, setMyData] = useState<any[]>([]);
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

	useEffect(() => {
		const getData = async () => {
			// const res = await fetch("https://pokeapi.co/api/v2/pokemon/");
			const response = await fetch(
				"https://pokeapi.co/api/v2/pokemon?limit=151"
			);
			const data = await response.json();
			// const filteredData = data.results.filter((pokemon: { id: number; }) => pokemon.id < 151);
			setMyData(data.results);
			// setSearchData(filteredData);
		};
		getData();
	}, []);

	useEffect(() => {
		if (myData.length > 0) {
			let chosenDate = new Date();
			let tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);

			// chosenDate = tomorrow;
			const chosenDay = chosenDate.getUTCDate();
			const chosenMonth = chosenDate.getUTCMonth() + 1;
			const chosenYear = chosenDate.getUTCFullYear();

			const randomNumber = chosenDay + chosenMonth + chosenYear;

			const maximum = myData.length;
			const minimum = 1;

			const seedrandom = require("seedrandom");
			const generator = seedrandom(randomNumber);
			const chosenNumber = generator();

			// const seededRandom = seedrandom();
			// const randomNumber2 = seedrandom(randomNumber);

			const calculatedPokemonNumber =
				Math.floor(chosenNumber * (maximum - minimum + 1)) + minimum;

			const todaysPokemonName = myData[calculatedPokemonNumber]?.name;

			setTodaysPokemon(todaysPokemonName);

			const todaysPokemonLettersValue = todaysPokemonName.split("");
			setTodaysLetters(todaysPokemonLettersValue);
			setTodaysPokemonLettersValue(todaysPokemonLettersValue.length);
		}
	}, [myData]);

	const handleSubmit = () => {
		// Do check to see if word is the correct amount of letters.
		// Do check to see if word already exists in api response.
		// Do check to see if letters are in correct space or in the word elsewhere.
		if (guesses[guessNumber].length !== todaysPokemonLettersValue) {
			setErrorMessage("Not enough characters entered!");
			return;
		}

		if (
			!myData.some(
				(pokemon) =>
					pokemon.name.toLowerCase() === guesses[guessNumber].toLowerCase()
			)
		) {
			setErrorMessage("Pokemon not found! Please try one of the original 151.");
			return;
		}
		let slicedSubmittedGuesses = guessesSubmitted.slice();
		slicedSubmittedGuesses[guessNumber] = true;
		setGuessesSubmitted(slicedSubmittedGuesses);

		setGuessNumber(guessNumber + 1);
		document?.getElementById("guess_input")?.focus();

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
				<p>
					You're a winner! It took you {guessNumber} guess
					{guessNumber > 1 ? <>es</> : null} today!
				</p>
			</Modal>

			<Layout className="App d-flex">
				<Header className="wordle__header">
					<div className="wordle__title">Pokemon Wordle</div>
					{/* <div>Today's pokemon is... {myData[todaysPokemon]?.name}</div> */}
				</Header>
				<Content className="wordle__board">
					<div>
						{[...Array(guesses.length)].map(
							(value: undefined, index: number) => (
								<GameRow
									todaysLetters={todaysLetters}
									// guess="test"
									todaysPokemonLettersValue={todaysPokemonLettersValue}
									guessValue={guesses[index]}
									rowNumber={index}
									guessesSubmitted={guessesSubmitted}
								/>
							)
						)}
					</div>
					{/* <div>
          {for(let i = 0; i < maxGuesses; i++) {
            <GameRow />
          }}
        </div> */}

					{/* TODO: Render 6 rows - Make   */}
					{/* <div>
					{myData[todaysPokemon] && (
						<div className="">
							<GameRow todaysWord={myData[todaysPokemon]?.name} guess={guess} />
						</div>
					)}
				</div> */}
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
