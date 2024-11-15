document.addEventListener("DOMContentLoaded", function () {
  const tocLinks = document.querySelectorAll(".tocWrapper a");
  const headings = Array.from(document.querySelectorAll("h2, h3, h4"));
  let isScrolling = true;

  tocLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const icon = link.querySelector("i");
      if (icon && icon.classList.contains("fa-caret-right")) {
        icon.style.transform = "rotate(90deg)"; // Rotate caret
      }
    });

    link.addEventListener("mouseleave", () => {
      const icon = link.querySelector("i");
      if (icon && icon.classList.contains("fa-caret-right")) {
        icon.style.transform = "rotate(0deg)"; // Reset caret
      }
    });
  });

  function setActiveLink(link) {
    tocLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!isScrolling) return; // Skip if manually clicked

      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (entry.isIntersecting) {
          const activeLink = document.querySelector(
            `.tocWrapper a[href="#${id}"]`,
          );
          if (activeLink) {
            setActiveLink(activeLink);
          }
        }
      });
    },
    {
      rootMargin: "0px 0px -50% 0px", // Customize based on when a section should be active
      threshold: 0.1,
    },
  );

  // Observe each heading for scroll-based active highlighting
  headings.forEach((heading) => observer.observe(heading));

  // Event listener for clicks to manually set active state
  tocLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent jump behavior if desired

      isScrolling = false; // Pause observer updates
      setActiveLink(this);

      // Scroll smoothly to the section
      const targetId = this.getAttribute("href").slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 20, // Offset for fixed header if needed
          behavior: "smooth",
        });
      }

      // Re-enable observer updates after a short delay
      setTimeout(() => {
        isScrolling = true;
      }, 800); // Adjust delay based on scroll duration
    });
  });
});
