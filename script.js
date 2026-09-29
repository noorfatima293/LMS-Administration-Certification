function openModule(moduleName) {

    if (moduleName === "Verification") {
        window.location.href = "verification/index.html";
    }
    else if (moduleName === "QR Verification") {
        window.location.href = "qr/index.html";
    }
    else if (moduleName === "Notifications") {
        window.location.href = "notifications/index.html";
    }
    else if (moduleName === "Communication") {
        window.location.href = "communication/index.html";
    }
    else {
        alert(moduleName + " module will be integrated here.");
    }

}

console.log("LMS project is running successfully.");