function verifyCertificate() {
    const certificateId = document.getElementById("certificateId").value;
    const result = document.getElementById("result");

    if (certificateId === "") {
        result.textContent = "Please enter a certificate ID.";
        return;
    }

    result.textContent = "Certificate ID received for verification.";
}