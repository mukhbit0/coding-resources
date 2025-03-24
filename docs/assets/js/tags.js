import {
  getResourceLinks,
  getSearchBox,
  getSearchBar,
} from "./element-fetchers.js";

export function setupTags() {
  const links = getResourceLinks();
  const sortedTags = getSortedTags(links);
  const searchBox = getSearchBox();
  searchBox.appendChild(createTagSection(sortedTags));
}

/**
 * @param {HTMLElement[]} links - Array of resource link elements
 * @returns {Object} Object with tag names as keys and occurrence counts as values, sorted by count
 */
function getSortedTags(links) {
  const tagsWithCount = {};
  const allTags = [];

  for (const link of links) {
    allTags.push(...(link?.dataset.tags?.split(",").filter(Boolean) || []));
  }

  for (const tag of allTags) {
    tagsWithCount[tag] = (tagsWithCount[tag] || 0) + 1;
  }

  return Object.entries(tagsWithCount)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 1)
    .reduce((acc, [tag, count]) => {
      acc[tag] = count;
      return acc;
    }, {});
}

/**
 * @param {Object} sortedTags - Object with tag names as keys and occurrence counts as values
 * @returns {HTMLElement} The container element with all tag buttons
 */
function createTagSection(sortedTags) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("tags-wrapper", "collapsed");

  const tagSection = document.createElement("div");
  tagSection.classList.add("tags-container");

  for (const tag of Object.keys(sortedTags)) {
    const tagSpan = document.createElement("span");
    tagSpan.textContent = `${tag} (${sortedTags[tag]})`;
    tagSpan.addEventListener("click", (e) => onTagClick(e, tag));
    tagSpan.classList.add("tag-button");

    tagSection.appendChild(tagSpan);
  }

  wrapper.appendChild(tagSection);

  const toggleButton = document.createElement("button");
  toggleButton.classList.add("toggle-tags-btn");
  toggleButton.textContent = "Show more";
  toggleButton.addEventListener("click", function () {
    if (wrapper.classList.contains("collapsed")) {
      wrapper.classList.remove("collapsed");
      toggleButton.textContent = "Show less";
    } else {
      wrapper.classList.add("collapsed");
      toggleButton.textContent = "Show more";
    }
  });

  setTimeout(() => {
    // Hardcoded value; works for now.
    if (tagSection.offsetHeight <= 49) {
      toggleButton.style.display = "none";
    }
  }, 0);

  wrapper.appendChild(toggleButton);

  return wrapper;
}

/**
 * @param {Event} e - The click event object
 * @param {string} tag - The tag name that was clicked
 */
function onTagClick(e, tag) {
  const searchBar = getSearchBar();
  searchBar.value = `#${tag}`;
  searchBar.dispatchEvent(new Event("input"));
}