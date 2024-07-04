(function (window, document) {
  // Paste your dataLayer and helper functions here
    function fireTag1Tag() {
    // Code to fire Tag1 Tag
    console.log("Tag1 Tag fired!");
  }

  function Tag1Logic() {
        if (event === 'pageLoad' && element === '/welcome') {
          fireundefinedTag();
      } 

  }  function fireTag2Tag() {
    // Code to fire Tag2 Tag
    console.log("Tag2 Tag fired!");
  }

  function Tag2Logic() {
        if (event === 'click' && element === '/element') {
          fireundefinedTag();
      } 

  }
})(window, document);