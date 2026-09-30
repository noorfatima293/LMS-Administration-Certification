function openModule(moduleName) {

    if (moduleName === "Administration") {
        window.location.href = "admin/index.html";
    }
    else if (moduleName === "Certification") {
        window.location.href = "certification/index.html";
    }
    else if (moduleName === "Integration") {
        window.location.href = "integration/index.html";
    }
    else if (moduleName === "Verification") {
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
        alert(moduleName + " module is not available.");
    }

}

console.log("LMS project is running successfully.");