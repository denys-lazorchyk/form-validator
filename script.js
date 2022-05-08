const formHolder = document.querySelector(".formHolder");
const textarea = document.querySelector(".validation__textarea textarea");
const textareaCounter = document.querySelector(
	".validation__textarea .counter"
);
const radioYes = document.querySelector(
	'.validation__radio input[value="yes"]'
);
const radioButtons = document.querySelectorAll(
	'.validation__radio input[name="consent"]'
);
const select = document.querySelector(".validation__select select");
const inputVat = document.querySelector(".validation__inputVat input");
const inputVatCalc = document.querySelector(".validation__inputResult input");
const submit = document.querySelector(".submit");
const form = document.getElementById("myForm");

const maxTextAreaInput = +textarea.getAttribute("maxlengthCustom");

function addWarningMessage(add, sibling, message) {
	let parent = sibling.closest("div");
	if (add) {
		let hasMessage = parent.getAttribute("hasmessage");

		let template = `
        <div class="message">
        <p>
        ${message}
        </p>
        </div>
        `;

		if (hasMessage !== "yes") {
			parent.setAttribute("hasmessage", "yes");
			parent.insertAdjacentHTML("beforeend", template);
			setTimeout(() => {
				parent.querySelector(".message").classList.add("active");
			}, 0);
		}
	} else {
		parent.setAttribute("hasmessage", "no");
		let element = parent.querySelector(".message");
		if (element) {
			element.classList.remove("active");
			setTimeout(() => {
				element.remove();
			}, 300);
		}
	}
}

function setCounterTextArea(value) {
	textareaCounter.textContent = `${value}/${maxTextAreaInput}`;
}

function updateInputVatCalc(vat, sum) {
	if (vat == 0 && sum == 0) {
		inputVatCalc.value = "";
		return;
	}
	let float = parseFloat(sum);
	inputVatCalc.value = Math.round((float / (1 - vat)) * 100) / 100;
}

function validateRadio() {
	return radioYes.checked;
}

function validateTextarea() {
	return textarea.value.length > 0 && textarea.value.length <= maxTextAreaInput;
}

function validateSelect() {
	return !isNaN(parseFloat(select.value));
}

function validateVat() {
	let regex = new RegExp(/^([0-9]*[.,])?[0-9]+$/);
	return regex.test(inputVat.value);
}

function cleaAll() {
	select.value = "";
	textarea.value = "";
	inputVat.value = "";
	radioButtons.forEach((el) => (el.checked = false));
	inputVatCalc.value = "";
}

function addEventListeners() {
	textarea.addEventListener("input", (e) => {
		let length = textarea.value.length;
		setCounterTextArea(length);

		addWarningMessage(
			length > maxTextAreaInput,
			textarea,
			`You can't enter more than ${maxTextAreaInput} characters!`
		);
	});

	select.addEventListener("change", (e) => {
		e.preventDefault();

		if (select.value) {
			inputVat.disabled = false;
			addWarningMessage(false, select, `Text is required`);
		} else {
			addWarningMessage(true, select, `Text is required`);
			inputVat.disabled = true;
		}
	});

	inputVat.addEventListener("input", (e) => {
		e.preventDefault();
		let value = inputVat.value;

		if (value.length < 1 || !validateVat()) {
			updateInputVatCalc(0, 0);
		} else {
			updateInputVatCalc(select.value, inputVat.value);
		}

		addWarningMessage(
			value.length < 1 || !validateVat(),
			inputVat,
			"Please, input number!"
		);
	});

	radioButtons.forEach((element) => {
		element.addEventListener("change", (e) => {
			if (e.target === radioYes) {
				addWarningMessage(false, radioYes, `Send confimation`);
			} else {
				console.log("i am here");
				addWarningMessage(true, e.target, `Send confimation`);
			}
		});
	});

	submit.addEventListener("click", (e) => {
		e.preventDefault();
		let send = true;

		if (!validateTextarea()) {
			send = false;
			addWarningMessage(true, textarea, `Your input is inapropriate!`);
		}

		if (!validateRadio()) {
			send = false;
			addWarningMessage(true, radioYes, `Send confimation`);
		}

		if (!validateSelect()) {
			send = false;
			addWarningMessage(true, select, `Text is required`);
		}

		if (!validateVat()) {
			send = false;
			addWarningMessage(true, inputVat, `Please, input number`);
		}

		if (send) {
			//We cna asend a form here then
			// form.submit();

			fetch("https://6278228ed00bded55ad63444.mockapi.io/validation")
				.then((res) => res.json())
				.then((res) => {
					let rand = Math.floor(Math.random() * 2);
					let result = res[0].results[rand];

					let template = `
                <div class="result ${result}">
                    <h1>${result}</h1>
                    <div class="sign">
                        <span></span>
                        <span></span>
                    </div>
                </div>
                `;
					document.body.insertAdjacentHTML("beforeend", template);
					formHolder.classList.add("blurred");

					let justAdded = document.querySelector(".result");
					setTimeout(() => {
						justAdded.classList.add("active");
					}, 10);

					justAdded.addEventListener("click", () => {
						formHolder.classList.remove("blurred");
						justAdded.classList.remove("active");
						cleaAll();

						setTimeout(() => {
							justAdded.remove();
						}, 300);
					});
				});
		}
	});
}

(() => {
	setCounterTextArea(0);
	addEventListeners();
})();
