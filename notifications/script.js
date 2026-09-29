function showNotification() {
    const notificationList = document.getElementById("notificationList");

    notificationList.innerHTML = `
        <div class="notification">
            Your certificate has been successfully verified.
        </div>

        <div class="notification">
            A new LMS update is available.
        </div>
    `;
}