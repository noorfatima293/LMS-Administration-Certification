function generateQR() {
    const certificateId = document.getElementById("certificateId").value;
    const qrResult = document.getElementById("qrResult");

    if (certificateId === "") {
        qrResult.textContent = "Please enter a certificate ID.";
        return;
    }

    qrResult.textContent = "QR verification code will be generated for: " + certificateId;
}