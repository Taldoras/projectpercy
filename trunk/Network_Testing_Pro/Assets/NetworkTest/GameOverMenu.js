var gameOverVisible : boolean = false;
var gameOverWinnerStyle : GUIStyle;
var gameOverWinnerName : String;
var gameOverWinnerNameStyle : GUIStyle;
var roundOverStyle : GUIStyle;
var btnStyle : GUIStyle;
var gameOverPaw : Texture2D;


function OnGUI(){
	
	var scrW = Screen.width;
	var scrH = Screen.height;
	if(gameOverVisible)
	{
		GUI.BeginGroup(new Rect(scrW/2 - 150,scrH/2 -150,800,800));
		
		GUI.Label(Rect(0,0,300,100), "Winner...", gameOverWinnerStyle);
		GUI.Label(Rect(25,40,500,100), gameOverWinnerName, gameOverWinnerNameStyle);
		GUI.Label(Rect(90, 100, 500, 500), gameOverPaw);
		GUI.Label(Rect(0,225,300,100), "ROUND OVER", roundOverStyle);
		
		if(GUI.Button(Rect(0, 280,200,200), "Play Again", btnStyle))
		{	
			Debug.Log("Play Again");
			Application.LoadLevel("StartupScene");
		}
		
		if(GUI.Button(Rect(220, 280,200,200), "Quit", btnStyle))
		{	
			Debug.Log("Quit");
			Application.LoadLevel("StartupScene");
		}
		
		GUI.EndGroup();
	}
	
}




