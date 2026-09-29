function sendMessage() {
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;
    const result = document.getElementById("result");

    if (name === "" || message === "") {
        result.textContent = "Please fill in all fields.";
        return;
    }

    result.textContent = "Your message has been submitted.";
}