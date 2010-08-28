var gameOverVisible = false;

function OnGUI(){

	var scrW = Screen.width;
	var scrH = Screen.height;
	if(gameOverVisible)
	{
		if(GUI.Button(Rect(scrW/2 -50, scrH/2 -50,100,100),"Game Over"))
		{
			print("Cat Pick Click");
		}	
	}
	
}
