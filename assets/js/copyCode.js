document.addEventListener("DOMContentLoaded", function () {
  const codeBlocks = document.querySelectorAll("pre code");
  codeBlocks.forEach((block) => {
    const button = document.createElement("button");
    button.innerText = "Copy";
    button.className = "copy-button";
    button.onclick = function () {
      const text = block.textContent;
      navigator.clipboard.writeText(text).then(() => {
        button.innerText = "Copied!";
        setTimeout(() => (button.innerText = "Copy"), 4000);
      });
    };
    block.parentNode.insertBefore(button, block);
  });
});
