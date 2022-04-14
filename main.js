/*
 * This files holds all the code for Project 1.
 */

//Run once browser has loaded everything
window.onload = function () {
  //Function that adds new Divs to the HTML page
  function addHTML(text) {
    //Grab the container div
    var start_div = document.getElementById("start");
    //make a new Div element
    var newElement = document.createElement("div");
    //add text to that div
    newElement.innerHTML = text;
    //append it to the main
    start_div.appendChild(newElement);
  }

  /**
   * Create the query URL
   *
   * @param {string} query
   * @returns
   */
  const makeQuery = (query) => {
    var baseUrl = "https://www.reddit.com/search.json?q=";
    var newQuery = query.replace(" ", "+");
    return baseUrl + newQuery;
  };

  /**
   * Getting the required details of the users
   *
   * @param {array} authorsList
   * @param {array} titlesList
   * @returns
   */
  const SearchRedditUsers = async (authorsList, titlesList) => {
    var finalUsersDetails = [];
    var baseUrl = "https://www.reddit.com/user/";
    try {
      for (let i = 0; i < authorsList.length; i++) {
        const author = authorsList[i];
        const index = i;
        var response = await fetch(baseUrl + author + "/about.json");
        if (response.status === 200) {
          var data = await response.text();
          var jsonData = JSON.parse(data);
          var uObj = {};
          uObj.name = author;
          uObj.title = titlesList[index];
          uObj.comment_karma = jsonData.data.comment_karma;
          uObj.link_karma = jsonData.data.link_karma;
          finalUsersDetails.push(uObj);
          finalUsersDetails.sort((a, b) => {
            return a.link_karma - b.link_karma;
          });
        }
      }
      return finalUsersDetails;
    } catch (err) {
      console.log(err.message);
    }
  };

  /**
   * Main function to initiate the reddit search
   *
   * @param {string} search_text
   */
  const SearchReddit = async (search_text) => {
    try {
      var queryUrl = makeQuery(String(search_text));
      var response = await fetch(queryUrl);
      if (response.status === 200) {
        var data = await response.text();
        var jsonData = JSON.parse(data);

        var dataObjects = jsonData.data.children;
        var authorsList = [];
        var titlesList = [];
        dataObjects.forEach((item) => {
          if (authorsList.indexOf(item.data.author) == -1) {
            authorsList.push(item.data.author);
            titlesList.push(item.data.title);
          }
        });
        const searchResults = await SearchRedditUsers(authorsList, titlesList);
        return searchResults;
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  //gran the current form in the HTML document
  var form = document.querySelector("form");

  //event that listens for form submit
  form.addEventListener("submit", async function (event) {
    var search_text = form.elements.value.value;

    console.log("Saving value", search_text);

    //get main DIV
    var start_div = document.getElementById("start");

    //Clear main DIV
    start_div.innerHTML = "";

    addHTML("Looking up Reddit Users for search term " + search_text);

    //uncomment these lines to run your code here
    const searchResults = await SearchReddit(search_text);
    addHTML(
      searchResults
        .map(
          (sr) =>
            `User ${sr.name} wrote a post \"${sr.title}"\ with ${sr.link_karma} Link Karma and ${sr.comment_karma} Comment Karma.<br><br>`
        )
        .join('\n')
    );
    console.log("searchResults", searchResults);

    event.preventDefault();
  });
};

