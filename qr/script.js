const certificates = {

    "CERT-1001": {
        name: "Muskan Mahato",
        course: "Frontend Development",
        issueDate: "20 September 2026",
        status: "Verified"
    },

    "CERT-1002": {
        name: "Riya Sharma",
        course: "Web Development",
        issueDate: "18 September 2026",
        status: "Verified"
    },

    "CERT-1003": {
        name: "Sana Patel",
        course: "JavaScript Fundamentals",
        issueDate: "15 September 2026",
        status: "Verified"
    }
};

function scrollToVerify() {
    document
        .getElementById("verify")
        .scrollIntoView({behavior: "smooth"});
}

function verifyCertificate() {

    const input =document.getElementById("certificateId");
    const certificateId =input.value.trim().toUpperCase();
    const result =document.getElementById("verificationResult");

    if (certificateId === "") {
        result.style.display = "block";

        result.innerHTML = `
            <p class="invalid">Please enter a certificate ID.</p>
        `;
        return;
    }

    const certificate =certificates[certificateId];
    result.style.display = "block";

    if (certificate) {
        result.innerHTML = `

            <span class="verified">✓ Certificate Verified </span>
            
            <h3>Certificate Details</h3>

            <p><strong>Certificate ID:</strong>${certificateId}</p>
            <p><strong>Student Name:</strong>${certificate.name}</p>
            <p><strong>Course:</strong>${certificate.course}</p>
            <p><strong>Issue Date:</strong>${certificate.issueDate}</p>
            <p><strong>Status:</strong>${certificate.status}</p>
        `;

        generateQRCode(certificateId);
    }else {

        result.innerHTML = `

            <p class="invalid">✕ Certificate Not Found</p>
            <p>Please check the certificate ID and try again.</p>
        `;
    }
}

function generateQRCode(certificateId) {

    const qrContainer =document.getElementById("qrcode");

    qrContainer.innerHTML = "";
    const verificationURL =window.location.origin + window.location.pathname + "?certificate=" + certificateId;

    new QRCode(
        qrContainer,
        {
            text: verificationURL,
            width: 170,
            height: 170
        }
    );
}

function showVerificationPage(certificateId) {

    const certificate =certificates[certificateId];

    if (!certificate) {
        document.body.innerHTML = `
            <div class="qr-verification-page">
                <div class="verification-card">

                    <div class="error-icon">✕</div>

                    <h1>Certificate Not Found</h1>

                    <p class="verified-text">The certificate ID is invalid or does not exist.</p>

                </div>
            </div>
        `;
        return;
    }

    document.body.innerHTML = `
        <div class="qr-verification-page">
            <div class="verification-card">
            
                <div class="success-icon">✓</div>

                <h1>Certificate Verified</h1>

                <p class="verified-text">This certificate is successfully verified.</p>

                <div class="certificate-details">

                    <p><strong>Certificate ID:</strong>${certificateId}</p>
                    <p><strong>Student Name:</strong>${certificate.name}</p>
                    <p><strong>Course:</strong>${certificate.course}</p>
                    <p><strong>Issue Date:</strong>${certificate.issueDate}</p>
                    <p><strong>Status:</strong>${certificate.status} </p>

                </div>
            </div>
        </div>
    `;
}

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const params =new URLSearchParams(window.location.search);
        const certificateId =params.get("certificate");

        if (certificateId) {
            showVerificationPage(certificateId.toUpperCase());
        }
    }
);
