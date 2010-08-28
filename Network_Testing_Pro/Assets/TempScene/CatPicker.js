
var showPlayersState = false;
var showCatPicker = true;

function OnGUI(){

	var scrW = Screen.width;
	var scrH = Screen.height;
	if(showCatPicker)
	{
		if(GUI.Button(Rect(scrW/2 -50, scrH/2 -50,100,100),"PICK A CAT"))
		{
			print("Cat Pick Click");
			showPlay();
		}	
	}
	
	if(showPlayersState)
	{
		ShowPlayers();	
	}	

}

function showPlay()
{
	showPlayersState = true;
	showCatPicker = false;
}

function ShowPlayers()
{

	print("starting show players");
	var scrW = Screen.width;
	var scrH = Screen.height;

	GUI.Button(Rect(0,0,100,20),"Player One"); // Top Left
	GUI.Button(Rect(scrW - 100,0,100,20),"Player One"); // Top Right
	GUI.Button(Rect(0,scrH -20,100,20),"Player One"); // Bottom Left
	GUI.Button(Rect(scrW -100,scrH - 20,100,20),"Player One"); // Bottom Right
	
}


