function OnGUI () {
	if (GUI.Button (Rect (10,10,150,100), "Start Level")) {
		// print ("Yayayay");
		Application.LoadLevel("Scene1");
	}
}