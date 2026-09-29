
// ==========================================
// PULSE LMS - COMMUNICATION WORKSPACE
// VANILLA JAVASCRIPT
// ==========================================


// ---------- NOTIFICATIONS ----------

const notifications = [

    {
        id: 1,
        icon: "✓",
        avatar: "lavender",
        title: "Assignment Update",
        desc: "Web Engineering assignment deadline was updated.",
        time: "8 min ago",
        category: "academic",
        read: false
    },

    {
        id: 2,
        icon: "◈",
        avatar: "violet",
        title: "New Announcement",
        desc: "Student Affairs published a new announcement.",
        time: "32 min ago",
        category: "announcement",
        read: false
    },

    {
        id: 3,
        icon: "◷",
        avatar: "peach",
        title: "Class Reminder",
        desc: "Your OOP lecture starts tomorrow at 10:00 AM.",
        time: "1 hour ago",
        category: "academic",
        read: false
    },

    {
        id: 4,
        icon: "!",
        avatar: "violet",
        title: "Exam Schedule",
        desc: "Midterm examination dates are now available.",
        time: "3 hours ago",
        category: "announcement",
        read: false
    },

    {
        id: 5,
        icon: "⚙",
        avatar: "lavender",
        title: "System Update",
        desc: "LMS maintenance has been completed successfully.",
        time: "Yesterday",
        category: "system",
        read: false
    }

];


// Notification elements

const notificationList =
    document.querySelector("#notificationList");

const unreadCount =
    document.querySelector("#unreadCount");

const navBadge =
    document.querySelector("#navBadge");


// Render notifications

function renderNotifications(filter = "all") {

    notificationList.innerHTML = "";


    const filteredNotifications =
        notifications.filter(notification => {

            if (filter === "all") {
                return true;
            }

            return notification.category === filter;

        });


    filteredNotifications.forEach(notification => {

        const item = document.createElement("div");

        item.className =
            "notification " +
            (notification.read ? "" : "unread");


        item.innerHTML = `

            <span class="avatar ${notification.avatar}">
                ${notification.icon}
            </span>

            <div class="n-main">

                <div class="n-title">
                    ${notification.title}
                </div>

                <div class="n-desc">
                    ${notification.desc}
                </div>

            </div>

            <span class="category">
                ${notification.category}
            </span>

            <span class="n-time">
                ${notification.time}
            </span>

            ${
                !notification.read
                ? '<span class="unread-dot"></span>'
                : ""
            }

        `;


        // Click notification = mark as read

        item.addEventListener("click", function () {

            notification.read = true;

            renderNotifications(filter);

            showToast("Notification marked as read");

        });


        notificationList.appendChild(item);

    });


    updateUnreadCount();

}


// Update unread counter

function updateUnreadCount() {

    const unread =
        notifications.filter(
            notification => !notification.read
        ).length;


    unreadCount.textContent = unread;

    navBadge.textContent = unread;

}


// Initial render

renderNotifications();



// ---------- NOTIFICATION FILTER ----------

const filterButtons =
    document.querySelectorAll(".filter");


filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        this.classList.add("active");


        const filter =
            this.dataset.filter;


        renderNotifications(filter);

    });

});



// ---------- MARK ALL AS READ ----------

document
    .querySelector("#markAll")
    .addEventListener("click", function () {

        notifications.forEach(notification => {
            notification.read = true;
        });


        renderNotifications();

        showToast("All notifications marked as read");

    });



// ---------- VIEW NOTIFICATIONS BUTTON ----------

document
    .querySelector("#viewNotifications")
    .addEventListener("click", function () {

        document
            .querySelector("#notifications")
            .scrollIntoView({
                behavior: "smooth"
            });

    });



// ---------- TOAST MESSAGE ----------

function showToast(message) {

    const toast =
        document.querySelector("#toast");

    const toastText =
        toast.querySelector("span");


    toastText.textContent = message;


    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 2300);

}



// ==========================================
// MESSAGING SYSTEM
// ==========================================


const conversations = [

    [
        "Dr. Ayesha",
        "Project guidelines are ready",
        "DA",
        "violet"
    ],

    [
        "LMS Support",
        "Your ticket has been updated",
        "LS",
        "lavender"
    ],

    [
        "Coding Club",
        "See you at the meetup!",
        "CC",
        "peach"
    ],

    [
        "Academic Office",
        "Midterm schedule",
        "AO",
        "violet"
    ]

];


const conversationsContainer =
    document.querySelector("#conversations");


// Render conversations

function renderConversations(search = "") {

    conversationsContainer.innerHTML = "";


    conversations
        .filter(conversation => {

            return conversation[0]
                .toLowerCase()
                .includes(search.toLowerCase());

        })
        .forEach((conversation, index) => {


            const item =
                document.createElement("div");


            item.className =
                "conversation " +
                (index === 0 ? "active" : "");


            item.innerHTML = `

                <span class="avatar ${conversation[3]}">
                    ${conversation[2]}
                </span>

                <div>

                    <b>
                        ${conversation[0]}
                    </b>

                    <small>
                        ${conversation[1]}
                    </small>

                </div>

            `;


            item.addEventListener("click", function () {

                document
                    .querySelector("#chatName")
                    .textContent =
                    conversation[0];


                document
                    .querySelectorAll(".conversation")
                    .forEach(item => {

                        item.classList.remove("active");

                    });


                item.classList.add("active");

            });


            conversationsContainer
                .appendChild(item);

        });

}


renderConversations();



// Search conversations

document
    .querySelector("#conversationSearch")
    .addEventListener("input", function () {

        renderConversations(this.value);

    });



// ==========================================
// SEND MESSAGE
// ==========================================


const messageInput =
    document.querySelector("#messageInput");

const chatBody =
    document.querySelector("#chatBody");


function sendMessage() {

    const message =
        messageInput.value.trim();


    // Empty message check

    if (message === "") {

        showToast("Please write a message first");

        return;

    }


    // Create new message

    const bubble =
        document.createElement("div");


    bubble.className =
        "bubble sent";


    bubble.innerHTML = `

        ${message}

        <small>
            Just now
        </small>

    `;


    chatBody.appendChild(bubble);


    // Clear input

    messageInput.value = "";


    // Scroll to latest message

    chatBody.scrollTop =
        chatBody.scrollHeight;


    showToast("Message sent");

}


document
    .querySelector("#sendMessage")
    .addEventListener("click", sendMessage);



// Enter key sends message

messageInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);



// ==========================================
// MODAL SYSTEM
// ==========================================


const modal =
    document.querySelector("#modalBackdrop");


const modalTitle =
    document.querySelector("#modalTitle");


const modalText =
    document.querySelector("#modalText");


const modalAction =
    document.querySelector("#modalAction");



// Open modal

function openModal(title, text, buttonText = "Got it") {

    modalTitle.textContent = title;

    modalText.textContent = text;

    modalAction.textContent = buttonText;


    modal.classList.add("open");

}



// Close modal

function closeModal() {

    modal.classList.remove("open");

}



// Close button

document
    .querySelector("#modalClose")
    .addEventListener("click", closeModal);



// Modal action button

modalAction.addEventListener(
    "click",
    closeModal
);



// Click outside modal

modal.addEventListener(
    "click",
    function (event) {

        if (event.target === modal) {

            closeModal();

        }

    }
);



// ==========================================
// ANNOUNCEMENT DATA
// ==========================================


const modalData = {

    registration: {

        title: "Registration Deadline",

        text:
            "Course registration closes Friday at 11:59 PM. Review your selected courses, confirm your choices, and submit before the deadline.",

        button:
            "Review Complete"

    },


    exam: {

        title:
            "Midterm Examination Schedule",

        text:
            "The complete midterm timetable is now available. Check each course, note the date and time, and keep your LMS calendar updated.",

        button:
            "Understood"

    },


    coding: {

        title:
            "Coding Community Meetup",

        text:
            "Join fellow developers for an evening of projects, ideas and collaborative learning. Bring your current project or simply come to learn.",

        button:
            "Sounds Good"

    }

};



// Read More / Details buttons

document
    .querySelectorAll("[data-modal]")
    .forEach(button => {


        button.addEventListener(
            "click",
            function () {


                const key =
                    this.dataset.modal;


                const data =
                    modalData[key];


                if (!data) {
                    return;
                }


                openModal(
                    data.title,
                    data.text,
                    data.button
                );

            }

        );

    });



// ==========================================
// SEND ANNOUNCEMENT
// ==========================================


document
    .querySelector("#sendAnnouncement")
    .addEventListener("click", function () {

        openModal(

            "Send Announcement",

            "Your announcement composer is ready. In a connected LMS, this window can be used to send announcements to selected classes or student groups.",

            "Continue"

        );

    });



// ==========================================
// PROFILE BUTTON
// ==========================================


document
    .querySelector("#profileBtn")
    .addEventListener("click", function () {

        showToast("Profile menu opened");

    });



// ==========================================
// SMALL PAGE INTERACTION
// ==========================================


// Add smooth hover response to windows

const windows =
    document.querySelectorAll(".window");


windows.forEach(windowCard => {

    windowCard.addEventListener(
        "mouseenter",
        function () {

            this.style.transition =
                "transform 0.25s ease";

        }
    );

});



// ==========================================
// PAGE LOAD
// ==========================================


window.addEventListener(
    "load",
    function () {

        document.body.classList.add("loaded");

    }
);
