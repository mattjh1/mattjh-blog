const backToTop = document.querySelector(".back-to-top");

window.onscroll = function () {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
};

// Smooth scroll to top when clicked
backToTop.addEventListener("click", function (event) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
