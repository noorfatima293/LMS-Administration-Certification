function showSection(sectionId, menuItem) {

    const sections = document.querySelectorAll("main section");

    sections.forEach(function(section) {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");

    const menuItems = document.querySelectorAll(".menu a");

    menuItems.forEach(function(item) {
        item.classList.remove("active");
    });

    menuItem.classList.add("active");

    const titles = {
        dashboard: "Dashboard",
        students: "Student Management",
        courses: "Course Management",
        faculty: "Faculty Management",
        quizzes: "Quiz & Assessment Management",
        certificates: "Certificate Management",
        announcements: "Announcements"
    };

    document.getElementById("pageTitle").textContent =
        titles[sectionId];
}


/* Student Search */

document
    .getElementById("studentSearch")
    .addEventListener("input", function() {

        const searchValue = this.value.toLowerCase();

        const rows =
            document.querySelectorAll("#studentTable tr");

        rows.forEach(function(row) {

            const studentName =
                row.children[0].textContent.toLowerCase();

            row.style.display =
                studentName.includes(searchValue)
                    ? ""
                    : "none";
        });
    });


/* Button Functions */

function addStudent() {
    alert("Student form will be connected with the backend later.");
}

function addCourse() {
    alert("Course form is ready for future backend integration.");
}

function addFaculty() {
    alert("Faculty form will be connected later.");
}

function addQuiz() {
    alert("Quiz creation form is ready for frontend integration.");
}

function issueCertificate() {
    alert("Certificate issuing interface is ready.");
}

function newAnnouncement() {
    alert("Announcement form is ready.");
}
