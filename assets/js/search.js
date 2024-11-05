const itemsPerPage = 5; // Set the number of items to display per page
const maxVisiblePages = 5;
let currentPage = 1;
let paginatedResults = [];
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

// Collect posts from the DOM
const posts = [];
document.querySelectorAll(".postListItem").forEach((item) => {
  const tags = item.dataset.tags;
  const categories = item.dataset.categories;
  posts.push({
    title: item.querySelector(".postTitle").textContent,
    contents: item.querySelector(".postExcerpt").textContent,
    tags: tags ? tags.split(",") : [],
    categories: categories ? categories.split(",") : [],
    element: item,
  });
});

const fuse = new Fuse(posts, fuseOptions);
const searchInput = document.getElementById("search-query");
const paginationControls = document.getElementById("pagination-controls");

// Search and pagination handling
if (searchInput) {
  searchInput.addEventListener("input", function () {
    const searchQuery = this.value.trim();
    currentPage = 1;

    if (searchQuery) {
      const result = fuse.search(searchQuery);
      paginatedResults = result.map((res) => res.item);
      renderPage(currentPage);
      renderPagination();
      highlightMatches(searchQuery);
    } else {
      resetSearch();
    }
  });
}

// Reset search and paginate all posts
function resetSearch() {
  paginatedResults = posts;
  renderPage(1);
  renderPagination();

  // Clear any existing highlights
  const markInstance = new Mark(document.querySelectorAll(".postListItem"));
  markInstance.unmark();
}

// Render the specified page of results
function renderPage(page) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Hide all items initially
  document.querySelectorAll(".postListItem").forEach((item) => {
    item.style.display = "none";
  });

  // Display only items for the current page
  const itemsToShow = paginatedResults.slice(startIndex, endIndex);
  itemsToShow.forEach((item) => {
    item.element.style.display = "block";
  });

  // Handle no results found
  if (paginatedResults.length === 0) {
    if (!document.querySelector(".no-results")) {
      const message = document.createElement("div");
      message.className = "no-results";
      message.textContent = "No matches found.";
      document.getElementById("post-list").appendChild(message);
    }
  } else {
    const noResults = document.querySelector(".no-results");
    if (noResults) noResults.remove();
  }
}

function highlightMatches(query) {
  const markInstance = new Mark(document.querySelectorAll(".postListItem"));
  markInstance.unmark({
    done: function () {
      markInstance.mark(query);
    },
  });
}

// Render pagination buttons
function renderPagination() {
  const paginationControls = document.getElementById("pagination-controls");
  paginationControls.innerHTML = "";

  const totalPages = Math.ceil(paginatedResults.length / itemsPerPage);
  const startPage =
    Math.floor((currentPage - 1) / maxVisiblePages) * maxVisiblePages + 1;
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  // Chevron for Previous Page Set
  if (startPage > 1) {
    const prevChevron = document.createElement("i");
    prevChevron.classList.add("fas", "fa-chevron-left", "pagination-chevron");
    prevChevron.addEventListener("click", function () {
      currentPage = startPage - 1;
      renderPage(currentPage);
      renderPagination();
    });
    paginationControls.appendChild(prevChevron);
  }

  // Render page buttons
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.classList.add("pagination-button");
    pageButton.textContent = i;
    if (i === currentPage) pageButton.classList.add("active");

    pageButton.addEventListener("click", function () {
      currentPage = i;
      renderPage(currentPage);
      renderPagination();
    });

    paginationControls.appendChild(pageButton);
  }

  // Chevron for Next Page Set
  if (endPage < totalPages) {
    const nextChevron = document.createElement("i");
    nextChevron.classList.add("fas", "fa-chevron-right", "pagination-chevron");
    nextChevron.addEventListener("click", function () {
      currentPage = endPage + 1;
      renderPage(currentPage);
      renderPagination();
    });
    paginationControls.appendChild(nextChevron);
  }
}

// Initialize page by resetting search
resetSearch();
