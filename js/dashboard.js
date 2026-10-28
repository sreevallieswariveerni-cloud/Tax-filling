
document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const page = document.querySelector(".dashboard-page");

    if (!page) return;

    const sidebarToggle = document.getElementById("sidebar-toggle");
    const navItems = page.querySelectorAll(".nav-item[data-section]");
    const sections = page.querySelectorAll(".page-section");
    const pageTitle = document.getElementById("page-title");
    const themeToggle = document.getElementById("theme-toggle");
    const rtlToggle = document.getElementById("rtl-toggle");
    const settingsTheme = document.getElementById("settings-theme");
    const settingsRtl = document.getElementById("settings-rtl");
    const uploadForm = document.getElementById("upload-form");
    const profileForm = document.getElementById("profile-form");
    const toast = document.getElementById("toast");

    let toastTimer;

    const documents = [
        {
            name: "Bank Statement",
            category: "Banking",
            date: "20 Oct 2026",
            status: "Under review"
        },
        {
            name: "Income Proof",
            category: "Income",
            date: "18 Oct 2026",
            status: "Pending"
        },
        {
            name: "PAN Card",
            category: "Tax",
            date: "15 Oct 2026",
            status: "Verified"
        },
        {
            name: "Previous Tax Return",
            category: "Tax",
            date: "12 Oct 2026",
            status: "Verified"
        }
    ];

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    }

    function refreshIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    /* PAGE NAVIGATION */

    function openSection(sectionId) {
        const target = document.getElementById(sectionId);

        if (!target || !target.classList.contains("page-section")) {
            return;
        }

        sections.forEach((section) => {
            section.classList.toggle("active", section.id === sectionId);
        });

        navItems.forEach((item) => {
            const isActive = item.dataset.section === sectionId;

            item.classList.toggle("active", isActive);

            if (isActive) {
                item.setAttribute("aria-current", "page");
            } else {
                item.removeAttribute("aria-current");
            }
        });

        if (pageTitle) {
            pageTitle.textContent = target.dataset.title || "Dashboard";
        }

        if (sidebarToggle) {
            sidebarToggle.checked = false;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        refreshIcons();
    }

    navItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            openSection(item.dataset.section);
        });
    });

    page.querySelectorAll("[data-open]").forEach((button) => {
        button.addEventListener("click", () => {
            openSection(button.dataset.open);
        });
    });

    /* THEME */

    function updateThemeButton() {
        const isDark = root.dataset.theme === "dark";

        if (themeToggle) {
            themeToggle.innerHTML = isDark
                ? '<i data-lucide="sun"></i>'
                : '<i data-lucide="moon"></i>';

            themeToggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
        }

        if (settingsTheme) {
            settingsTheme.setAttribute("aria-pressed", String(isDark));
            settingsTheme.innerHTML = isDark
                ? "<i></i><b>On</b>"
                : "<i></i><b>Off</b>";
        }

        refreshIcons();
    }

    function toggleTheme() {
        root.dataset.theme =
            root.dataset.theme === "dark" ? "light" : "dark";

        updateThemeButton();
    }

    themeToggle?.addEventListener("click", toggleTheme);
    settingsTheme?.addEventListener("click", toggleTheme);

    /* RIGHT-TO-LEFT */

    function updateRtlButton() {
        const isRtl = root.dir === "rtl";

        if (settingsRtl) {
            settingsRtl.setAttribute("aria-pressed", String(isRtl));
            settingsRtl.innerHTML = isRtl
                ? "<i></i><b>On</b>"
                : "<i></i><b>Off</b>";
        }
    }

    function toggleRtl() {
        root.dir = root.dir === "rtl" ? "ltr" : "rtl";
        updateRtlButton();
    }

    rtlToggle?.addEventListener("click", toggleRtl);
    settingsRtl?.addEventListener("click", toggleRtl);

    /* DOCUMENT TABLES */

    function getStatusClass(status) {
        if (status === "Verified") return "filed";
        if (status === "Under review") return "review";
        return "pending";
    }

    function renderDocuments() {
        const recentTable = document.getElementById("recent-table");
        const documentTable = document.getElementById("document-table");

        const totalDocs = document.getElementById("total-docs");
        const pendingDocs = document.getElementById("pending-docs");
        const docCount = document.getElementById("doc-count");
        const libraryCount = document.getElementById("library-count");

        const pendingCount = documents.filter((doc) =>
            ["Pending", "Under review"].includes(doc.status)
        ).length;

        if (totalDocs) totalDocs.textContent = documents.length;
        if (pendingDocs) pendingDocs.textContent = pendingCount;
        if (docCount) docCount.textContent = documents.length;

        if (libraryCount) {
            libraryCount.textContent =
                `${documents.length} document${documents.length === 1 ? "" : "s"}`;
        }

        const rows = documents.map((doc, index) => {
            const safeName = escapeHTML(doc.name);
            const safeCategory = escapeHTML(doc.category);
            const safeDate = escapeHTML(doc.date);
            const safeStatus = escapeHTML(doc.status);
            const statusClass = getStatusClass(doc.status);

            return `
                <tr>
                    <td>${safeName}</td>
                    <td>${safeCategory}</td>
                    <td>${safeDate}</td>
                    <td>
                        <span class="pill ${statusClass}">
                            ${safeStatus}
                        </span>
                    </td>
                    ${
                        documentTable
                            ? `<td>
                                <button
                                    class="text-btn delete-document"
                                    type="button"
                                    data-index="${index}">
                                    Remove
                                </button>
                            </td>`
                            : ""
                    }
                </tr>
            `;
        });

        if (recentTable) {
            recentTable.innerHTML = rows.slice(0, 4).join("");
        }

        if (documentTable) {
            documentTable.innerHTML = rows.length
                ? rows.join("")
                : `<tr><td colspan="5">No documents added yet.</td></tr>`;
        }

        documentTable?.querySelectorAll(".delete-document").forEach((button) => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.index);

                if (!Number.isInteger(index) || !documents[index]) return;

                documents.splice(index, 1);
                renderDocuments();
                showToast("Document removed from this demo.");
            });
        });
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, (character) => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }

    /* DEMO UPLOAD */

    uploadForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = document.getElementById("doc-name");
        const categoryInput = document.getElementById("doc-category");
        const fileInput = document.getElementById("doc-file");
        const uploadStatus = document.getElementById("upload-status");

        const name = nameInput.value.trim();
        const category = categoryInput.value;
        const file = fileInput.files[0];

        if (!name || !file) {
            uploadStatus.textContent = "Enter a name and select a file.";
            return;
        }

        const allowedExtensions = [
            "pdf", "png", "jpg", "jpeg",
            "doc", "docx", "xls", "xlsx"
        ];

        const extension = file.name.split(".").pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            uploadStatus.textContent = "This file type is not supported.";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            uploadStatus.textContent = "File size must be 10 MB or less.";
            return;
        }

        documents.unshift({
            name,
            category,
            date: new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }),
            status: "Pending"
        });

        renderDocuments();

        uploadStatus.textContent =
            "Demo entry added. The file was not uploaded to a server.";

        uploadForm.reset();
        showToast("Demo document added.");
    });

    /* PROFILE FORM */

    profileForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("profile-name").value.trim();
        const email = document.getElementById("profile-email").value.trim();
        const profileStatus = document.getElementById("profile-status");

        if (!name || !email) {
            profileStatus.textContent = "Please enter your name and email.";
            return;
        }

        const nameDisplay = page.querySelector(".user-info b");
        const avatar = page.querySelector(".avatar");

        if (nameDisplay) nameDisplay.textContent = name;
        if (avatar) avatar.textContent = name.charAt(0).toUpperCase();

        profileStatus.textContent =
            "Changes applied in this demo. They are not saved to a server.";

        showToast("Profile updated for this session.");
    });

    /* TO-DO COUNTER */

    const todoCheckboxes = page.querySelectorAll(".todo input");
    const todoCount = document.getElementById("todo-count");

    function updateTodoCount() {
        const remaining = [...todoCheckboxes].filter(
            (checkbox) => !checkbox.checked
        ).length;

        if (todoCount) {
            todoCount.textContent =
                `${remaining} task${remaining === 1 ? "" : "s"}`;
        }
    }

    todoCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", updateTodoCount);
    });
    
/* PROFILE DROPDOWN */
const profileTrigger = document.getElementById("profile-trigger");
const profileDropdown = document.getElementById("profile-dropdown");

profileTrigger?.addEventListener("click", () => {
    const isOpen = profileTrigger.getAttribute("aria-expanded") === "true";

    profileTrigger.setAttribute("aria-expanded", String(!isOpen));
    profileDropdown.hidden = isOpen;

    if (!isOpen) {
        refreshIcons();
    }
});

document.addEventListener("click", (event) => {
    if (
        profileDropdown &&
        !event.target.closest(".profile-menu")
    ) {
        profileDropdown.hidden = true;
        profileTrigger?.setAttribute("aria-expanded", "false");
    }
});

profileDropdown?.querySelectorAll("[data-profile-section]").forEach((button) => {
    button.addEventListener("click", () => {
        openSection(button.dataset.profileSection);
        profileDropdown.hidden = true;
        profileTrigger?.setAttribute("aria-expanded", "false");
    });
});

    /* NOTIFICATIONS AND SIGN OUT */

    document.getElementById("notification-btn")?.addEventListener("click", () => {
        showToast("You are all caught up.");
    });

    document.getElementById("logout-btn")?.addEventListener("click", () => {
        showToast("Connect your authentication system to sign out securely.");
    });

    /* INITIAL SETUP */

    renderDocuments();
    updateThemeButton();
    updateRtlButton();
    updateTodoCount();
    refreshIcons();

    const initialSection = window.location.hash.replace("#", "");

    if (initialSection && document.getElementById(initialSection)?.classList.contains("page-section")) {
        openSection(initialSection);
    } else {
        openSection("overview");
    }
});
