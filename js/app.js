// Speech Synthesis API initialisation
const synth = window.speechSynthesis;

// DOM elements
const form = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

let voices = [];

// Append the possible voices into the Select Tag
getVoices = () => {
  voices = synth.getVoices();

  voices.forEach(voice => {
    const option = document.createElement("option");
    option.textContent = voice.name;

    // Set needed Atributes
    option.setAttribute("data-name", voice.name);

    // Append the element between parenthesis as a child of voiceSelect in the DOM
    voiceSelect.appendChild(option);
  });
};

// Fill the voice array
getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speech
const speak = () => {
  // Add background animation
  if (textInput.value !== "") {
    body.style.background = "#141414 url(img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x";
    body.style.backgroundSize = "100% 25%";
    body.style.backgroundPositionY = "7%";
  }

  // Check if Already speaking
  if (synth.speaking) {
    console.error("Уже говорит...");
    return;
  }
  if (textInput.value !== "") {
    // Sending a Speech Request to the API
    const speakRequest = new SpeechSynthesisUtterance(textInput.value);

    // Run when the speacking will be done:
    speakRequest.onend = e => {
      console.log("Done Speaking!");
      body.style.background = "#141414";
    };

    speakRequest.onerror = e => {
      console.log("Speacking Error!");
    };

    // Grabing the Selected voice from the select <tag>
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );

    // Looping through voices until the selected voice matches the element in the array
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakRequest.voice = voice;
      }
    });

    // Set pitch and rate
    speakRequest.rate = rate.value;
    speakRequest.pitch = pitch.value;

    // Speak
    synth.speak(speakRequest);
  }
};

// EVENT LISTENERS

// submiting the form
form.addEventListener("submit", e => {
  // prevent from actually submiting to a file
  e.preventDefault();
  speak();
  textInput.blur();
});

// Making the ranges interactive
rate.addEventListener("change", e => {
  rateValue.textContent = rate.value;
});

pitch.addEventListener("change", e => {
  pitchValue.textContent = pitch.value;
});

// Call the speack function as soon as we change the language
voiceSelect.addEventListener("change", e => speak());
