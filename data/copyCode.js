function createDOMElements() {
  const container = document.createElement("div");
  container.innerHTML =
    "<div class='tooltip-copy'><input type='submit' value='Copy' /></div>";
  container.className = "div-copy";
  return container;
}

function attachCopyCodeFunctionality(div) {
  const elementsToClean = [];
  document
    .querySelectorAll("pre")
    .forEach(function createButtonAndAttachHandlers(pre) {
      let timeout = null;
      const copy = div.cloneNode(true);
      pre.appendChild(copy);
      elementsToClean.push(pre);

      copy.onclick = function copyTextToClipboard() {
        navigator.clipboard.writeText(pre.textContent);
        copy.classList.add("clicked");
        clearTimeout(timeout);
        timeout = setTimeout(function hidePopup() {
          copy.classList.remove("clicked");
        }, 1500);
      };
    });

  return elementsToClean;
}

export default function createCopyCodeFunctionality() {
  const container = createDOMElements();
  return attachCopyCodeFunctionality(container);
}
