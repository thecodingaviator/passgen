function generatePassword(length, options) {
  const charSets = {
      alphabets: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      numbers: "0123456789",
      specials: "!@#$%^&*()_+-=[]{}|;':\",.<>?/"
  };

  if (options.readable) {
      charSets.alphabets = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"; // Exclude similar characters
      charSets.numbers = "23456789"; // Exclude similar numbers
  }

  let availableChars = "";
  let password = "";
  const minCategoryLength = Math.ceil(length * 0.15); // At least 15% of the total length per category

  const addCharsFromCategory = (category) => {
      availableChars += charSets[category];
      for (let i = 0; i < minCategoryLength; i++) {
          password += charSets[category].charAt(Math.floor(Math.random() * charSets[category].length));
      }
  };

  if (options.useAlphabets) addCharsFromCategory("alphabets");
  if (options.useNumbers) addCharsFromCategory("numbers");
  if (options.useSpecials) addCharsFromCategory("specials");

  // Fill the remaining length with random characters from all selected categories
  while (password.length < length) {
      password += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
  }

  // Shuffle the password to mix the characters
  password = password.split('').sort(() => 0.5 - Math.random()).join('');

  return password;
}

function updatePassword() {
  const options = {
      useAlphabets: document.getElementById('alphabets').checked,
      useNumbers: document.getElementById('numbers').checked,
      useSpecials: document.getElementById('specials').checked,
      readable: document.getElementById('readable').checked,
  };
  const length = parseInt(document.getElementById('lengthSlider').value, 10);

  const password = generatePassword(length, options);
  document.getElementById('password').textContent = password;

  document.getElementById('copyMessage').style.visibility = 'hidden';
}

function initializeEventListeners() {
  ['alphabets', 'numbers', 'specials', 'readable'].forEach(id => {
      document.getElementById(id).addEventListener('change', updatePassword);
  });

  document.getElementById('lengthSlider').addEventListener('input', () => {
      document.getElementById('lengthValue').textContent = document.getElementById('lengthSlider').value;
      updatePassword();
  });

  document.getElementById('copy').addEventListener('click', () => {
      const password = document.getElementById('password').textContent;
      navigator.clipboard.writeText(password).then(() => {
          const copyMessage = document.getElementById('copyMessage');
          copyMessage.style.visibility = 'visible';
          setTimeout(() => {
              copyMessage.style.visibility = 'hidden';
          }, 2000);
      });
  });
}

// Initialize password generation and event listeners on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  updatePassword();
});
