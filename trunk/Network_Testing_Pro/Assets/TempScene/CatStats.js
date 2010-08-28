var catStatsVisible = false;

function OnGUI(){

	var scrW = Screen.width;
	var scrH = Screen.height;

	if(catStatsVisible)
	{
		GUI.Button(Rect(0,0,100,20),"Player One"); // Top Left
		GUI.Button(Rect(scrW - 100,0,100,20),"Player One"); // Top Right
		GUI.Button(Rect(0,scrH -20,100,20),"Player One"); // Bottom Left
		GUI.Button(Rect(scrW -100,scrH - 20,100,20),"Player One"); // Bottom Right
	}

}