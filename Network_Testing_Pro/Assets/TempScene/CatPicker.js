var showCatPicker = false;

function OnGUI(){

	var scrW = Screen.width;
	var scrH = Screen.height;
	if(showCatPicker)
	{
		if(GUI.Button(Rect(scrW/2 -50, scrH/2 -50,100,100),"PICK A CAT"))
		{
			print("Cat Pick Click");
		}	
	}
	
}


