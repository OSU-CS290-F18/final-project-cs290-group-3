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

function getPostIdFromURL() {
  var path = window.location.pathname;
  var pathParts = path.split('/');
  if (pathParts[1] === "posts") {
    return pathParts[2];
  } else {
    return null;
  }
}

function handleModalAcceptClick() {

  var title = document.getElementById('post-title-input').value.trim();
  var imageURL = document.getElementById('post-image-input').value.trim();
  var theme = document.getElementById('post-theme-input').value.trim().toUpperCase();
  var link = document.getElementById('post-link-input').value.trim();

  if (!title || !imageURL || !theme || !link) {
    alert("You must fill in all of the fields!");
  } else {
    var postRequest = new XMLHttpRequest();
    var requestURL = '/posts/' + getPostIdFromURL()  + '/addPost';
    postRequest.open('POST', requestURL);

    var requestBody = JSON.stringify({
      title: title,
      imageURL: imageURL,
      theme: theme,
      link: link
    });

    postRequest.addEventListener('load', function (event) {
      if (event.target.status === 200) {
        insertNewPost(title, imageURL, theme, link);
      } else {
        alert("Error storing post: " + event.target.response);
      }
    });

    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.send(requestBody);

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

function parsePostElem(postElem) {

  var post = {
    theme: postElem.getAttribute('data-theme'),
    title: postElem.getAttribute('data-title'),
    link: postElem.getAttribute('data-link')
  };

  var postImageElem = postElem.querySelector('.post-image-container img');
  post.imageURL = postImageElem.src;

  return post;

}


/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */
window.addEventListener('DOMContentLoaded', function () {

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
