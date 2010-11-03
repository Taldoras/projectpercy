// state stuff
var gState : GlobalState;

function OnGUI () {

var scrW = Screen.width;
var scrH = Screen.height;

// make a window
//startMenuWin= GUI.Window (0, startMenuWin, showStartUp, "");		
if(GUI.Button (Rect ( scrW/2 -50, scrH/2 +10, 100, 20), GUIContent ("Quick Play", "Jump straight into the fight!")))
{
	print("quickplay clicked");
	startQuickplay();
}

/*
 * Login disabled
if(GUI.Button (Rect ( scrW/2 -50, scrH/2 +50, 100, 20), GUIContent ("Login", "Logging in allows you to save your cat!")))
{
	print("login clicked");
}
*/

if(GUI.Button (Rect ( scrW/2 -50, scrH/2 +90, 100, 20), GUIContent ("Exit", "Quit the game")))
{
	print("exit clicked");
}
    
// If the user hovers the mouse over the button, the global tooltip gets set
GUI.Box (Rect (scrW/2 -150, scrH -40, 300, 40), GUI.tooltip);

if(GUI.Button (Rect ( scrW -100, scrH -20, 100, 20), GUIContent ("Credits", "Madmen and Villians")))
{
	print("credits clicked");
}

// make credits button 
// bottom right corner
}

function startQuickplay() {
	
	//set player's name
	var playerName = getQuickName();
	gState.playerName = playerName;
		
	// start it up!
	Application.LoadLevel("Scene1");
	
}


function getQuickName()
{
	//return "Garfiend";
	
	var NumberOfPreWords = 8;
	var prefix = new Array();
	
	prefix.Push("Gar");
	prefix.Push("Mister");
	prefix.Push("Pooky");
	prefix.Push("Soo");
	prefix.Push("Chew");
	prefix.Push("Puss");
	prefix.Push("Killy");
	prefix.Push("Biggsie");
	prefix.Push("Hunni");
	
	

	var NumberOfSufWords = 7;
	var suffix = new Array();
	
	suffix.Push("fiend");
	suffix.Push("boy");
	suffix.Push("bum");
	suffix.Push("pickles");
	suffix.Push("puss");
	suffix.Push("gore");
	suffix.Push("monster");
	suffix.Push("cutt");
	

    // Generate a random number between 1 and NumberOfWords
    var rndPre = Mathf.Ceil(Random.value * NumberOfPreWords);
	var rndSuf = Mathf.Ceil(Random.value * NumberOfSufWords);

    // Display the word inside the text box
    var prefixName = prefix[rndPre];
	
	var suffixName = suffix[rndSuf];

	var numberName = Random.Range(1,99);

	var fullName = (prefixName + suffixName + numberName);
	print("Name for quickplay: " + fullName);
	
	return fullName;
}








