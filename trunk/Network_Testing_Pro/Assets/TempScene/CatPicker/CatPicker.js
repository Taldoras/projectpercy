var showCatPicker = false;
var menuSkin1 : GUISkin;
var catPickerStyle : GUIStyle;

var leftArrow : Texture2D;
var rightArrow : Texture2D;

var currentCatFace = 1;
var catFaceMax = 4;
var catFace1 : Texture2D;
var catFace2 : Texture2D;
var catFace3 : Texture2D;
var catFace4 : Texture2D;
var currentCatFaceTexture : Texture2D;
currentCatFaceTexture = catFace1;


function OnGUI(){

	GUI.skin = menuSkin1;
	
	var scrW = Screen.width;
	var scrH = Screen.height;
	if(showCatPicker)
	{
		GUI.BeginGroup(new Rect(scrW/2 - 150,scrH/2 -150,400,400));
		
		GUI.Label(Rect(0,0,300,100), "Choose a Character");
		
		if(GUI.Button(Rect(0, 50,100,100),leftArrow, "catPickerStyle"))
		{
			currentCatFace = currentCatFace - 1;
			currentCatFace = showCatFace(currentCatFace);			
			Debug.Log("Cat Pick Click Left " + currentCatFace);
		}
		
		if(GUI.Button(Rect(300, 50,100,100),rightArrow, "catPickerStyle"))
		{
			currentCatFace = currentCatFace + 1;
			currentCatFace = showCatFace(currentCatFace);	
			Debug.Log("Cat Pick Click right " + currentCatFace);
		}
		
		if(GUI.Button(Rect(100, 50, 100, 100),currentCatFaceTexture, "catPickerStyle"))
		{
			Debug.Log("Cat Pick Image");
			
			
		}
		
		
		
		GUI.EndGroup();
	}
	
}

function showCatFace(currentCatFace){
	Debug.Log("doing showCatFace. currentCatFace: " + currentCatFace);
	
	if(currentCatFace <= 1)
	{
		currentCatFace = catFaceMax;		
	}
	
	if(currentCatFace > 4)
	{
		currentCatFace = 1;		
	}
	
	if(currentCatFace ==1)
	{
		currentCatFaceTexture = catFace1;
	}
	if(currentCatFace ==2)
	{
		currentCatFaceTexture = catFace2;
	}
	if(currentCatFace ==3)
	{
	currentCatFaceTexture = catFace3;
	}
	if(currentCatFace ==4)
	{
		currentCatFaceTexture = catFace4;
	}

	Debug.Log("after showCatFace. currentCatFace: " + currentCatFace);
	return currentCatFace;
}




