// Global menu for base level features
var quitMenu = false;
var audioMenu = false;

function Update()
{
	// Toggle escape menu
	if (Input.GetKeyDown ("escape")) 
	{ 		
		quitMenu= !quitMenu;
		// print("escape pressed " + quitMenu);
	}
	
}

function OnGUI () 
{
	if (quitMenu == true)
	{
		// render the escape menu
		GUI.Box (Rect (Screen.width/2 - 75,Screen.height/2 - 200,150,300), "Main Menu");
		
		if (GUI.Button (Rect(Screen.width/2 - 75 + 30,Screen.height/2 - 200 +30,100,20),"Start Screen"))	
		{
			quitMenu = false;
			Application.LoadLevel("StartupScene");
		}
		
		if (GUI.Button (Rect(Screen.width/2 - 75 +30, Screen.height/2 - 200 + 60,100,20),"Audio"))	
		{
			audioMenu = true;
			quitMenu = false;
		}
		
		if (GUI.Button (Rect(Screen.width/2 - 75 +30, Screen.height/2 - 200 + 90,100,20),"Exit Menu"))	
		{
			quitMenu = false;
		}
		
	}
	
	if (audioMenu == true)
	{
		// render the escape menu
		GUI.Box (Rect (Screen.width/2 - 150,Screen.height/2 - 200,300,300), "Audio Settings");
		
		if (GUI.Button (Rect(Screen.width/2 - 75 +30, Screen.height/2 - 200 + 90,100,20),"Accept"))	
		{
			audioMenu = false;
			quitMenu = true;
		}
		
	}	
	
	
	
	
	
	
}