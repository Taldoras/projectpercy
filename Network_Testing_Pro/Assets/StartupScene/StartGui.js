function OnGUI () {
	if (GUI.Button (Rect (Screen.width/2 -50, Screen.height/2 + 100,100,50), "New Game")) {
		// print ("Yayayay");
		Application.LoadLevel("Scene1");
	}
}