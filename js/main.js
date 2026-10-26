
document.addEventListener("DOMContentLoaded", () => {

    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Initialize AOS animations
    if (window.AOS) {
        AOS.init({
            duration: 700,
            once: true,
            offset: 55,
            easing: "ease-out-cubic",
            disable: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        });
    }

    const body = document.body;

    // Load saved theme and text direction
    try {
        if (localStorage.getItem("ledgerly-theme") === "dark") {
            body.classList.add("dark");
        }

        if (localStorage.getItem("ledgerly-rtl") === "true") {
            body.dir = "rtl";
        }
    } catch (error) {
        // The page still works if local storage is unavailable.
    }

    // Dark mode toggle
    document.querySelectorAll(".theme-toggle").forEach((button) => {

        const updateIcon = () => {
            const isDark = body.classList.contains("dark");

            button.innerHTML = isDark
                ? '<i data-lucide="sun"></i>'
                : '<i data-lucide="moon"></i>';

            button.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );

            if (window.lucide) {
                lucide.createIcons();
            }
        };

        updateIcon();

        button.addEventListener("click", () => {
            body.classList.toggle("dark");

            try {
                localStorage.setItem(
                    "ledgerly-theme",
                    body.classList.contains("dark") ? "dark" : "light"
                );
            } catch (error) {}

            updateIcon();
        });
    });

    // RTL / LTR toggle
    document.querySelectorAll(".rtl-toggle").forEach((button) => {

        button.addEventListener("click", () => {

            body.dir = body.dir === "rtl" ? "ltr" : "rtl";

            try {
                localStorage.setItem(
                    "ledgerly-rtl",
                    body.dir === "rtl" ? "true" : "false"
                );
            } catch (error) {}

        });
    });

    // Mobile navigation toggle
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    if (menuButton && navigation) {

        menuButton.addEventListener("click", () => {

            const isOpen = navigation.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            menuButton.innerHTML = isOpen
                ? '<i data-lucide="x"></i>'
                : '<i data-lucide="menu"></i>';

            if (window.lucide) {
                lucide.createIcons();
            }
        });
    }

    // Home dropdown for mobile and click interaction
    const dropdown = document.querySelector(".nav-dropdown");
    const dropdownButton = document.querySelector(".dropdown-trigger");

    if (dropdown && dropdownButton) {

        dropdownButton.addEventListener("click", () => {

            const isOpen = dropdown.classList.toggle("open");

            dropdownButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }

});
