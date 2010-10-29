var madCat1 : AudioClip;
var madCat2 : AudioClip;



function Update () {
}

function OnGUI () {

	if(GUILayout.Button("MadCat1"))
	{
		print("Play MadCat1");
		audio.PlayOneShot(madCat1);
	}

	if(GUILayout.Button("MadCat2"))
	{
		print("Play MadCat2");
		audio.PlayOneShot(madCat2);
	}

	if(GUILayout.Button("MadCat3"))
	{
		print("Play MadCat2");
		audio.PlayOneShot(madCat2);
	}
	
	if(GUILayout.Button("MadCat4"))
	{
		print("Play MadCat2");
		audio.PlayOneShot(madCat2);
	}
	
	if(GUILayout.Button("MadCat5"))
	{
		print("Play MadCat2");
		audio.PlayOneShot(madCat2);
	}
}
@script RequireComponent(AudioSource)


