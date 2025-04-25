const get = id => document.getElementById(id);

const languages = ['swe', 'eng'];
const languageButtons = {};
let currentLanguage = 'eng';

createLanguageButtons();

function loadLanguage(language) {
	languageButtons[currentLanguage].style.display = 'flex';
	languageButtons[language].style.display = 'none';

	load(language);
	currentLanguage = language;
}

function createLanguageButtons() {
	const sidebar = get('sidebar');

	languages.forEach(language => {
		console.log(`Loading language: ${language}`);
	
		const button = document.createElement('button');
		button.id = `${language}-button`;
		button.className = 'language-button';
	
		const img = document.createElement('img');
		img.src = `images/flags/${language}.png`;
		img.alt = language.toUpperCase();
		img.className = 'language-button-img';
		button.appendChild(img);
	
		button.addEventListener('click', () => {
			loadLanguage(language);
		});
	
		sidebar.appendChild(button);
		languageButtons[language] = button;
	});

	loadLanguage(languages[0]);
}

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

(async function loopHeader() {
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

function load(filename) {
	filename = filename +'.json';

	const mainContainer = get('main-container');
    mainContainer.innerHTML = ''; // Clear existing content
	
	fetch('data/' + filename)
		.then(response => response.json())
		.then(data => {
			let cards = data.cards;
			Object.keys(cards).forEach(key => {
				const card = document.createElement('div');
				card.className = 'card';

				const cardHeader = document.createElement('h2');
				cardHeader.innerHTML = key.charAt(0).toUpperCase() + key.slice(1);
				cardHeader.className = 'card-header';
				card.appendChild(cardHeader);

				card.id = key;
				cards[key].forEach(item => {
					createSection(item, card);
				});

				mainContainer.appendChild(card);
			});

		});
}

function createSection(sectionData, container) {
	const section = document.createElement('div');
	section.className = 'section';

	const header = document.createElement('div');
	header.className = 'section-header';
	
	if (sectionData.image) {
		const img = document.createElement('img');
		img.src = sectionData.image;
		img.alt = sectionData.title;
		img.className = 'section-image';
		
		if (sectionData.link) {
			const link = document.createElement('a');
			link.href = sectionData.link;
			link.target = '_blank'; // Open link in a new tab
			link.rel = 'noopener noreferrer'; // Security measure to prevent access to the previous page
			link.appendChild(img);
			header.appendChild(link);
		} else {
			header.appendChild(img);
		}
	}

	const titleContainer = document.createElement('div');
	titleContainer.className = 'section-title-container';

	const title = document.createElement('h3');
	title.innerHTML = sectionData.title;
	title.className = 'section-title';
	titleContainer.appendChild(title);

	if (sectionData.place) {
		const place = document.createElement('p');
		place.innerHTML = sectionData.place;
		place.className = 'section-subtitle';
		titleContainer.appendChild(place);
	}

	if (sectionData.date) {
		const date = document.createElement('p');
		date.innerHTML = sectionData.date;
		date.className = 'section-subtitle';
		titleContainer.appendChild(date);
	}

	section.appendChild(header);
	section.appendChild(titleContainer);

	const paragraph = document.createElement('p');
	paragraph.innerHTML = sectionData.content;
	paragraph.className = 'section-text';
	section.appendChild(paragraph);

	container.appendChild(section);
}