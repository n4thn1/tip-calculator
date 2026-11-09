"use strict";

const tipBtns = document.querySelectorAll(".btn--tip");
const tipBtnsContainer = document.querySelector(".tip-card--grid");
const inputBill = document.getElementById("bill");
const inputPeople = document.getElementById("peopleNum");
const inputCustomTip = document.getElementById("btn--tip-custom");
const inputPeopleContainer = document.querySelector(".people-card-input");
const errorText = document.querySelector(".error-text");

const tipAmount = document.getElementById("tip-amount");
const totalAmount = document.getElementById("tip-total");
const resetBtn = document.querySelector(".btn--reset");

const LIMITS = { bill: 100000, people: 999, tip: 100 };
const invalidChars = ["e", "E", "+", "-"];

let state = { bill: 0, people: 0, tip: 0 };

const clearActive = () => tipBtns.forEach((b) => b.classList.remove("active"));

const preventInvalidChars = (element, invalidChars) => {
  element.addEventListener("keydown", (e) => {
    if (invalidChars.includes(e.key)) e.preventDefault();
  });
};

const render = function (tipPerPerson = 0, totalPerPerson = 0) {
  tipAmount.textContent = `$${tipPerPerson.toFixed(2)}`;
  totalAmount.textContent = `$${totalPerPerson.toFixed(2)}`;
};

const updateResetState = function () {
  const hasInput =
    Object.values(state).some((val) => val > 0) || inputCustomTip.value !== "";
  resetBtn.classList.toggle("active", hasInput);
};

const calculation = function () {
  updateResetState();
  const { bill, people, tip } = state;

  if (bill <= 0 || people <= 0 || tip <= 0) {
    render(0, 0);
    return;
  }

  const totalTip = bill * (tip / 100);
  render(totalTip / people, (bill + totalTip) / people);
};

tipBtnsContainer.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn--tip");
  if (!btn) return;

  clearActive();
  btn.classList.add("active");
  inputCustomTip.value = "";

  state.tip = +btn.dataset.tip;
  calculation();
});

const handleNumericInput = (
  input,
  stateKey,
  maxLimit,
  invalidChars,
  onValidInput = null,
) => {
  preventInvalidChars(input, invalidChars);

  input.addEventListener("input", () => {
    if (+input.value > maxLimit) input.value = maxLimit;

    state[stateKey] = +input.value || 0;
    if (onValidInput) onValidInput(input.value);

    calculation();
  });
};

handleNumericInput(inputBill, "bill", LIMITS.bill, invalidChars);

handleNumericInput(inputCustomTip, "tip", LIMITS.tip, invalidChars, () => {
  clearActive();
});

handleNumericInput(
  inputPeople,
  "people",
  LIMITS.people,
  [...invalidChars, ".", ","],
  (rawValue) => {
    const isZero = rawValue.trim() !== "" && state.people === 0;
    inputPeopleContainer.classList.toggle("error", isZero);
    errorText.classList.toggle("hidden", !isZero);

    if (isZero) {
      inputPeople.setAttribute("aria-invalid", "true");
      inputPeople.setAttribute("aria-describedby", "peopleNum-error");
    } else {
      inputPeople.removeAttribute("aria-invalid");
      inputPeople.removeAttribute("aria-describedby");
    }
  },
);

resetBtn.addEventListener("click", function () {
  state = { bill: 0, people: 0, tip: 0 };
  inputBill.value = "";
  inputPeople.value = "";
  inputCustomTip.value = "";

  clearActive();

  inputPeopleContainer.classList.remove("error");
  errorText.classList.add("hidden");
  inputPeople.removeAttribute("aria-invalid");
  inputPeople.removeAttribute("aria-describedby");

  calculation();
});
