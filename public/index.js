function insertNewPost(title, imageURL, theme, link) {

  var postCardContext = {
    title: title,
    imageURL: imageURL,
    theme: theme.toUpperCase(),
    link: link
  };

  var postCardHTML = Handlebars.templates.postCard(postCardContext);

  var postCardContainer = document.getElementById('posts');
  postCardContainer.insertAdjacentHTML('beforeend', postCardHTML);

}

allPosts = [];

function handleModalAcceptClick() {

  var title = document.getElementById('post-title-input').value.trim();
  var imageURL = document.getElementById('post-image-input').value.trim();
  var theme = document.getElementById('post-theme-input').value.trim().toUpperCase();
  var link = document.getElementById('post-link-input').value.trim();

  if (!title || !imageURL || !theme || !link) {
    alert("You must fill in all of the fields!");
  } else {

    allPosts.push({
      title: title,
      imageURL: imageURL,
      theme: theme,
      link: link
    });

    insertNewPost(title, imageURL, theme, link);
    hidePostSomethingModal();

  }

}

function showPostSomethingModal() {

  var showSomethingModal = document.getElementById('post-something-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  showSomethingModal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');

}

function clearPostSomethingModalInputs() {

  var postTextInputElements = [
    document.getElementById('post-title-input'),
    document.getElementById('post-image-input'),
    document.getElementById('post-theme-input'),
    document.getElementById('post-link-input')
  ];

  /*
   * Clear any text entered in the text inputs.
   */
  postTextInputElements.forEach(function (inputElem) {
    inputElem.value = '';
  });

}

function hidePostSomethingModal() {

  var showSomethingModal = document.getElementById('post-something-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  showSomethingModal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');

  clearPostSomethingModalInputs();

}

/*
 * This function parses an existing DOM element representing a single post
 * into an object representing that post and returns that object.  The object
 * is structured like this:
 *
 * {
 *   description: "...",
 *   photoURL: "...",
 *   price: ...,
 *   city: "...",
 *   condition: "..."
 * }
 */
function parsePostElem(postElem) {

  var post = {
    theme: postElem.getAttribute('data-theme'),
    title: postElem.getAttribute('data-title'),
    link: postElem.getAttribute('data-link')
  };

  var postImageElem = postElem.querySelector('.post-image-container img');
  post.photoURL = postImageElem.src;

  return post;

}


/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */
window.addEventListener('DOMContentLoaded', function () {

  /*
   * Remember all of the initial post elements initially displayed in the page.
   */
  var postElems = document.getElementsByClassName('post');
  for (var i = 0; i < postElems.length; i++) {
    allPosts.push(parsePostElem(postElems[i]));
  }

  var postSomethingButton = document.getElementById('post-button');
  if (postSomethingButton) {
    postSomethingButton.addEventListener('click', showPostSomethingModal);
  }

  var modalAcceptButton = document.getElementById('modal-accept');
  if (modalAcceptButton) {
    modalAcceptButton.addEventListener('click', handleModalAcceptClick);
  }

  var modalHideButtons = document.getElementsByClassName('modal-hide-button');
  for (var i = 0; i < modalHideButtons.length; i++) {
    modalHideButtons[i].addEventListener('click', hidePostSomethingModal);
  }

});
