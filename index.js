const get = id => document.getElementById(id);

// Event listeners for language buttons
get('swedish-button').addEventListener('click', () => {
    load('swe.json');
});

get('english-button').addEventListener('click', () => {
    load('eng.json');
});

load('eng.json'); // Default to English

const timeout = 3000;
const messages = [
	"Hej",
	"Hello",
	"Bonjour",
	"Hola",
	"Hallo",
	"Ciao",
	"Привіт",
	"Olá",
	"Dia duit",
	"Ahoj",
	"Cześć",
	"Tere",
	"Sveiki",
	"Hei",
	"Γειά σου",
	"Buna ziua",
	"Merhaba",
	"你好",
	"こんにちは",
	"안녕",
	"नमस्ते",
	"أهلاً"
];
let prevIndex = 0;

(async function loop() {
	while (true) {
		await updateHeader();
	}
})();

function updateHeader() {
	return new Promise(resolve => {
		setTimeout(() => {
			console.log("Updating header...");

			let header = get("header");
			header.classList.add("fade-out");
			header.addEventListener("transitionend", function onTransitionEnd() {
				header.removeEventListener("transitionend", onTransitionEnd);
				header.innerHTML = nextMessage();
				header.classList.remove("fade-out");
				header.classList.add("fade-in");

				header.addEventListener("transitionend", function onFadeInEnd() {
					header.removeEventListener("transitionend", onFadeInEnd);
					header.classList.remove("fade-in");

					console.log("Header updated.");
					resolve();
				});
			});
		}, timeout);
	});
}

function nextMessage() {
	let randomIndex = Math.floor(Math.random() * messages.length);
	if (randomIndex === prevIndex) {
		randomIndex = (randomIndex + 1) % messages.length;
	}
	prevIndex = randomIndex;
	return messages[randomIndex];
}

function load(file) {
	const mainContainer = get('main-container');
    mainContainer.innerHTML = ''; // Clear existing content
	
	fetch('data/' + file)
		.then(response => response.json())
		.then(data => {
			let cards = data.cards;
			Object.keys(cards).forEach(key => {
				const section = document.createElement('div');
				section.className = 'section';

				const sectionHeader = document.createElement('h2');
				sectionHeader.innerHTML = key.charAt(0).toUpperCase() + key.slice(1);
				sectionHeader.className = 'section-header';
				section.appendChild(sectionHeader);

				section.id = key;
				cards[key].forEach(item => {
					createCard(item, section);
				});

				mainContainer.appendChild(section);
			});

		});
}

function createCard(cardData, container) {
	const card = document.createElement('div');
	card.className = 'card';

	const header = document.createElement('a');
	header.className = 'card-header';
	if (cardData.link) {
		header.href = cardData.link;
	}

	if (cardData.image) {
		const img = document.createElement('img');
		img.src = cardData.image;
		img.alt = cardData.title;
		img.className = 'card-image';
		header.appendChild(img);
	}

	const titleContainer = document.createElement('div');
	titleContainer.className = 'card-title-container';

	const title = document.createElement('h3');
	title.innerHTML = cardData.title;
	title.className = 'card-title';
	titleContainer.appendChild(title);

	if (cardData.place) {
		const place = document.createElement('p');
		place.innerHTML = cardData.place;
		place.className = 'card-subtitle';
		titleContainer.appendChild(place);
	}

	if (cardData.date) {
		const date = document.createElement('p');
		date.innerHTML = cardData.date;
		date.className = 'card-subtitle';
		titleContainer.appendChild(date);
	}

	header.appendChild(titleContainer);

	card.appendChild(header);

	const paragraph = document.createElement('p');
	paragraph.innerHTML = cardData.content;
	card.appendChild(paragraph);

	container.appendChild(card);
}