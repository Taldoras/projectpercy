

var addScoreUrl2="http://localhost/unity1/scores/addScores.aspx?"; //be sure to add a ? to your url
var highscoreUrl2="http://localhost/unity1/scores/display.aspx";   

function Start() {
    getScores();
}

function postScore(name, score) {
    //This connects to a server side php script that will add the name and score to a MySQL DB.
    // Supply it with a string representing the players name and the players score.
    var highscore_url = addScoreUrl2 + "name=" + WWW.EscapeURL(name) + "&score=" + score;
       
    // Post the URL to the site and create a download object to get the result.
    hs_post = WWW(highscore_url);
    yield hs_post; // Wait until the download is done
	
    if(hs_post.error) {
        print("There was an error posting the high score: " + hs_post.error);
    }
}
 
// Get the scores from the MySQL DB to display in a GUIText.
function getScores() {
    gameObject.guiText.text = "Loading Scores";
    hs_get = WWW(highscoreUrl2);
    yield hs_get;
   
    if(hs_get.error) {
        print("There was an error getting the high score: " + hs_get.error);
    } else {
        gameObject.guiText.text = hs_get.data; // this is a GUIText that will display the scores in game.
    }
}