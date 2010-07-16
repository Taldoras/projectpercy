function OnGUI () {
	if (GUI.Button (Rect (Screen.width -110, Screen.height -60 ,100,50), "Main Menu")) {
		// print ("Yayayay");
		Application.LoadLevel("StartupScene");
	}
}