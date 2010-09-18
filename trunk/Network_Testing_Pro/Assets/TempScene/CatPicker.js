var showCatPicker = false;
var menuSkin1 : GUISkin;
var catPickerStyle : GUIStyle;

var leftArrow : Texture2D;
var rightArrow : Texture2D;

var catFaces : Texture2D[];

function OnGUI(){

	GUI.skin = menuSkin1;
	
	var scrW = Screen.width;
	var scrH = Screen.height;
	if(showCatPicker)
	{
		GUI.BeginGroup(new Rect(scrW/2 - 150,scrH/2 -150,400,400));
		
		
		if(GUI.Button(Rect(0, 50,100,100),leftArrow, "catPickerStyle"))
		{
			print("Cat Pick Click Left");
		}
		
		if(GUI.Button(Rect(300, 50,100,100),rightArrow, "catPickerStyle"))
		{
			print("Cat Pick Click right");
		}
		
		if(GUI.Button(Rect(100, 50, 100, 100),"this cat image", "catPickerStyle"))
		{
			print("Cat Pick Image");
			guiTexture.texture = catFaces[1];
		}
		GUI.EndGroup();
	}
	
}


