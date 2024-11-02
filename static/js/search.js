// Constants and Fuse.js options
const summaryInclude = 60;
const fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.3,
  tokenize: true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    { name: "title", weight: 0.8 },
    { name: "contents", weight: 0.5 },
    { name: "tags", weight: 0.3 },
    { name: "categories", weight: 0.3 },
  ],
};

const posts = [];

// Populate the posts array from the DOM
document.querySelectorAll(".postListItem").forEach((item) => {
  posts.push({
    title: item.querySelector(".postTitle").textContent,
    contents: item.querySelector(".postExcerpt").textContent,
    element: item,
  });
});

// Initialize Fuse.js with the posts data
const fuse = new Fuse(posts, fuseOptions);

const searchInput = document.getElementById("search-query");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const searchQuery = this.value.trim();

    if (searchQuery) {
      const result = fuse.search(searchQuery);
      filterPosts(result);
    } else {
      document.querySelectorAll(".postListItem").forEach((item) => {
        item.style.display = "block";
      });
      const noResults = document.querySelector(".no-results");
      if (noResults) {
        noResults.remove();
      }
    }
  });
}

// Function to filter posts based on search results
function filterPosts(results) {
  document.querySelectorAll(".postListItem").forEach((item) => {
    item.style.display = "none"; // Hide all posts
  });

  // Show only the matching posts
  results.forEach((result) => {
    result.item.element.style.display = "block"; // Show matching post
  });

  // If no results found, show a message
  const noResults = document.querySelector(".no-results");
  if (results.length === 0) {
    if (!noResults) {
      const message = document.createElement("div");
      message.textContent = "No matches found.";
      message.className = "no-results";
      document.getElementById("post-list").appendChild(message);
    }
  } else {
    if (noResults) {
      noResults.remove();
    }
  }
}
