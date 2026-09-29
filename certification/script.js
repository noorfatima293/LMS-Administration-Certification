const defaultTemplates = [
  {
    id: "classic-gold",
    name: "Classic Gold",
    version: 1,
    organization: "Northfield Institute",
    title: "Certificate of Completion",
    body: "has successfully completed the course {{course}} on {{date}} and achieved grade {{grade}}.",
    signer: "Director of Learning",
    font: "Georgia",
    accent: "#09638f",
    border: "#b99228",
    verificationUrl: "https://verify.example.org/c/"
  },
  {
    id: "modern-slate",
    name: "Modern Slate",
    version: 1,
    organization: "Northfield Institute",
    title: "Certificate of Completion",
    body: "has successfully completed the course {{course}} on {{date}} and achieved grade {{grade}}.",
    signer: "Director of Learning",
    font: "Arial",
    accent: "#334155",
    border: "#64748b",
    verificationUrl: "https://verify.example.org/c/"
  }
];

let templates = JSON.parse(localStorage.getItem("certificateTemplates") || "null") || defaultTemplates;
let certificates = JSON.parse(localStorage.getItem("issuedCertificates") || "[]");
let activities = JSON.parse(localStorage.getItem("certificateActivities") || "[]");
let selectedTemplateId = templates[0].id;

const $ = (id) => document.getElementById(id);

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("en-GB");
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function saveState() {
  localStorage.setItem("certificateTemplates", JSON.stringify(templates));
  localStorage.setItem("issuedCertificates", JSON.stringify(certificates));
  localStorage.setItem("certificateActivities", JSON.stringify(activities));
}

function addActivity(text) {
  activities.unshift({
    text,
    time: new Date().toLocaleString()
  });
  activities = activities.slice(0, 30);
  saveState();
  renderActivity();
}

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.dataset.page;

      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      document.querySelectorAll(".page").forEach((section) => {
        section.classList.remove("active-page");
      });

      $(`${page}-page`).classList.add("active-page");

      if (page === "templates") {
        renderTemplateTabs();
        loadTemplate(selectedTemplateId);
      }

      if (page === "certificates") {
        renderCertificates();
      }

      if (page === "activity") {
        renderActivity();
      }
    });
  });
}

function getSelectedTemplate() {
  return templates.find((template) => template.id === selectedTemplateId) || templates[0];
}

function renderTemplateOptions() {
  $("issueTemplate").innerHTML = templates.map((template) => `
    <option value="${template.id}">
      ${escapeHtml(template.name)} (v${template.version})
    </option>
  `).join("");

  $("issueTemplate").value = selectedTemplateId;
}

function renderTemplateTabs() {
  const tabs = $("templateTabs");

  tabs.innerHTML = templates.map((template) => `
    <button class="template-tab ${template.id === selectedTemplateId ? "active" : ""}"
      data-template="${template.id}">
      ${escapeHtml(template.name)} v${template.version}
    </button>
  `).join("") + `
    <button class="template-tab" id="newTemplateBtn">+ New template</button>
  `;

  tabs.querySelectorAll("[data-template]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTemplateId = button.dataset.template;
      renderTemplateTabs();
      renderTemplateOptions();
      loadTemplate(selectedTemplateId);
      updateIssuePreview();
    });
  });

  $("newTemplateBtn").addEventListener("click", () => {
    const newId = "template-" + Date.now();

    templates.push({
      id: newId,
      name: "New Template",
      version: 1,
      organization: "Northfield Institute",
      title: "Certificate of Completion",
      body: "has successfully completed the course {{course}} on {{date}} and achieved grade {{grade}}.",
      signer: "Director of Learning",
      font: "Georgia",
      accent: "#09638f",
      border: "#b99228",
      verificationUrl: "https://verify.example.org/c/"
    });

    selectedTemplateId = newId;
    saveState();
    renderTemplateTabs();
    renderTemplateOptions();
    loadTemplate(newId);
    showToast("New template created");
  });
}

function loadTemplate(id) {
  const template = templates.find((item) => item.id === id);
  if (!template) return;

  $("templateName").value = template.name;
  $("organization").value = template.organization;
  $("templateTitle").value = template.title;
  $("templateBody").value = template.body;
  $("signer").value = template.signer;
  $("fontFamily").value = template.font;
  $("accentColor").value = template.accent;
  $("borderColor").value = template.border;
  $("verificationUrl").value = template.verificationUrl;

  $("logoFile").value = "";
  $("signatureFile").value = "";

  $("templateLogo").classList.add("hidden");
  $("signaturePreview").classList.add("hidden");

  updateTemplatePreview();
}

function updateTemplatePreview() {
  const template = {
    name: $("templateName").value,
    organization: $("organization").value,
    title: $("templateTitle").value,
    body: $("templateBody").value,
    signer: $("signer").value,
    font: $("fontFamily").value,
    accent: $("accentColor").value,
    border: $("borderColor").value,
    verificationUrl: $("verificationUrl").value
  };

  $("templatePreviewOrg").textContent = template.organization || "ORGANIZATION";
  $("templatePreviewTitle").textContent = template.title || "Certificate of Completion";
  $("templatePreviewSigner").textContent = template.signer || "Director of Learning";
  $("templatePreviewVersion").textContent = `Template v${getSelectedTemplate()?.version || 1}`;

  const previewBody = replaceFields(
    template.body || "",
    {
      name: "Aisha Khan",
      course: "Data Analytics 101",
      date: "2026-09-29",
      grade: "A",
      id: "CERT-SAMPLE",
      org: template.organization
    }
  );

  $("templatePreviewBody").textContent = previewBody;

  $("templatePreview").style.fontFamily = template.font;
  $("templatePreview").style.setProperty("--accent", template.accent);
  $("templatePreview").style.setProperty("--border", template.border);

  $("templatePreviewOrg").style.color = template.accent;
  $("templatePreviewTitle").style.color = template.accent;

  document.querySelectorAll("#templatePreview .certificate-border, #templatePreview .certificate-inner")
    .forEach((element) => {
      element.style.borderColor = template.border;
    });

  $("templatePreview").querySelector(".student-line").style.borderColor = template.border;

  generateQR(
    "templateQrCode",
    `${template.verificationUrl || "https://verify.example.org/c/"}CERT-SAMPLE`
  );
}

function updateIssuePreview() {
  const template = templates.find((item) => item.id === $("issueTemplate").value) || getSelectedTemplate();
  if (!template) return;

  const student = $("studentName").value.trim() || "Student Name";
  const course = $("courseName").value.trim() || "Course Name";
  const date = $("completionDate").value || todayISO();
  const grade = $("grade").value.trim() || "-";

  $("previewOrg").textContent = template.organization;
  $("previewTitle").textContent = template.title;
  $("previewStudent").textContent = student;
  $("previewSigner").textContent = template.signer;
  $("previewDate").textContent = date;
  $("previewVersion").textContent = `v${template.version}`;

  $("previewBody").textContent = replaceFields(template.body, {
    name: student,
    course,
    date,
    grade,
    id: "CERT-PREVIEW",
    org: template.organization
  });

  $("certificatePreview").style.fontFamily = template.font;
  $("previewOrg").style.color = template.accent;
  $("previewTitle").style.color = template.accent;

  document.querySelectorAll("#certificatePreview .certificate-border, #certificatePreview .certificate-inner")
    .forEach((element) => {
      element.style.borderColor = template.border;
    });

  $("certificatePreview").querySelector(".student-line").style.borderColor = template.border;

  generateQR(
    "qrCode",
    `${template.verificationUrl || "https://verify.example.org/c/"}CERT-PREVIEW`
  );
}

function replaceFields(text, values) {
  return text
    .replaceAll("{{name}}", values.name || "")
    .replaceAll("{{course}}", values.course || "")
    .replaceAll("{{date}}", values.date || "")
    .replaceAll("{{grade}}", values.grade || "")
    .replaceAll("{{id}}", values.id || "")
    .replaceAll("{{org}}", values.org || "");
}

function generateQR(elementId, text) {
  const element = $(elementId);
  if (!element || typeof QRCode === "undefined") return;

  element.innerHTML = "";

  new QRCode(element, {
    text,
    width: 82,
    height: 82,
    colorDark: "#111111",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}

function bindIssueForm() {
  ["studentName", "studentEmail", "courseName", "completionDate", "grade"].forEach((id) => {
    $(id).addEventListener("input", updateIssuePreview);
    $(id).addEventListener("change", updateIssuePreview);
  });

  $("issueTemplate").addEventListener("change", () => {
    selectedTemplateId = $("issueTemplate").value;
    updateIssuePreview();
  });

  $("completionDate").value = todayISO();

  $("createCertificate").addEventListener("click", createCertificate);
}

function createCertificate() {
  const student = $("studentName").value.trim();
  const email = $("studentEmail").value.trim();
  const course = $("courseName").value.trim();
  const date = $("completionDate").value;
  const grade = $("grade").value.trim();
  const template = templates.find((item) => item.id === $("issueTemplate").value) || getSelectedTemplate();

  if (!student || !email || !course || !date || !grade) {
    $("issueMessage").textContent = "Please fill in all fields.";
    $("issueMessage").style.color = "#a34747";
    return;
  }

  const id = "CERT-" + String(Date.now()).slice(-7);

  const certificate = {
    id,
    student,
    email,
    course,
    date,
    grade,
    template: `${template.name} v${template.version}`,
    status: $("issueNow").checked ? "Issued" : "Draft",
    createdAt: new Date().toISOString()
  };

  certificates.unshift(certificate);
  saveState();

  $("issueMessage").style.color = "#27724b";
  $("issueMessage").textContent = `Certificate ${id} created successfully.`;

  addActivity(
    `${certificate.status === "Issued" ? "Issued" : "Created"} certificate ${id} for ${student}`
  );

  $("previewId").textContent = id;
  generateQR(
    "qrCode",
    `${template.verificationUrl || "https://verify.example.org/c/"}${id}`
  );

  renderCertificates();
  showToast("Certificate created");
}

function bindTemplateForm() {
  [
    "templateName",
    "organization",
    "templateTitle",
    "templateBody",
    "signer",
    "fontFamily",
    "accentColor",
    "borderColor",
    "verificationUrl"
  ].forEach((id) => {
    $(id).addEventListener("input", updateTemplatePreview);
    $(id).addEventListener("change", updateTemplatePreview);
  });

  $("logoFile").addEventListener("change", (event) => {
    previewImage(event.target.files[0], $("templateLogo"));
  });

  $("signatureFile").addEventListener("change", (event) => {
    previewImage(event.target.files[0], $("signaturePreview"));
  });

  $("saveTemplate").addEventListener("click", saveTemplateVersion);
}

function previewImage(file, imageElement) {
  if (!file) {
    imageElement.classList.add("hidden");
    return;
  }

  if (!file.type.startsWith("image/")) {
    showToast("Please select an image file");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    imageElement.src = reader.result;
    imageElement.classList.remove("hidden");
  };

  reader.readAsDataURL(file);
}

function saveTemplateVersion() {
  const template = templates.find((item) => item.id === selectedTemplateId);

  if (!template) return;

  template.version += 1;
  template.name = $("templateName").value.trim() || "Untitled Template";
  template.organization = $("organization").value.trim() || "Northfield Institute";
  template.title = $("templateTitle").value.trim() || "Certificate of Completion";
  template.body = $("templateBody").value.trim();
  template.signer = $("signer").value.trim() || "Director of Learning";
  template.font = $("fontFamily").value;
  template.accent = $("accentColor").value;
  template.border = $("borderColor").value;
  template.verificationUrl = $("verificationUrl").value.trim() || "https://verify.example.org/c/";

  saveState();
  renderTemplateTabs();
  renderTemplateOptions();
  updateTemplatePreview();

  $("templateMessage").textContent = `Saved as version ${template.version}.`;
  $("templateMessage").style.color = "#27724b";

  addActivity(`Updated ${template.name} to version ${template.version}`);
  showToast("Template version saved");
}

function renderCertificates(filter = "") {
  const body = $("certificateTableBody");

  const filtered = certificates.filter((certificate) => {
    const value = `${certificate.id} ${certificate.student} ${certificate.course} ${certificate.template}`.toLowerCase();
    return value.includes(filter.toLowerCase());
  });

  if (!filtered.length) {
    body.innerHTML = `
      <tr>
        <td colspan="6">No certificates found.</td>
      </tr>
    `;
    return;
  }

  body.innerHTML = filtered.map((certificate) => `
    <tr>
      <td>${escapeHtml(certificate.id)}</td>
      <td>${escapeHtml(certificate.student)}</td>
      <td>${escapeHtml(certificate.course)}</td>
      <td>${escapeHtml(formatDate(certificate.date))}</td>
      <td>${escapeHtml(certificate.template)}</td>
      <td><span class="status">${escapeHtml(certificate.status)}</span></td>
    </tr>
  `).join("");
}

function renderActivity() {
  const list = $("activityList");

  if (!activities.length) {
    list.innerHTML = `<div class="activity-item">No activity yet.</div>`;
    return;
  }

  list.innerHTML = activities.map((item) => `
    <div class="activity-item">
      <div class="activity-title">${escapeHtml(item.text)}</div>
      <div class="activity-time">${escapeHtml(item.time)}</div>
    </div>
  `).join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initialize() {
  setupNavigation();
  renderTemplateOptions();
  renderTemplateTabs();
  loadTemplate(selectedTemplateId);
  bindIssueForm();
  bindTemplateForm();
  renderCertificates();
  renderActivity();
  updateIssuePreview();

  $("certificateSearch").addEventListener("input", (event) => {
    renderCertificates(event.target.value);
  });
}

initialize();
