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

if(GUI.Button (Rect ( scrW/2 -50, scrH/2 +50, 100, 20), GUIContent ("Login", "Logging in allows you to save your cat!")))
{
	print("login clicked");
}

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
	gState.playerName = playerName;
	
}