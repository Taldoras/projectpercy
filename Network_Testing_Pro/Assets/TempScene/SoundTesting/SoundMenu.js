var madCat1 : AudioClip;
var madCat2 : AudioClip;
var madCatHit : AudioClip;
var fallingCat : AudioClip;
var catHurt : AudioClip;
var meow : AudioClip;
var meow2 : AudioClip;
var crowd : AudioClip;
var winRoar : AudioClip;
var splash : AudioClip;
var beep : AudioClip;

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

	if(GUILayout.Button("MadCatHit"))
	{
		print("Play MadCatHit");
		audio.PlayOneShot(madCatHit);
	}
	
	if(GUILayout.Button("FallingCat"))
	{
		print("Play FallingCat");
		audio.PlayOneShot(fallingCat);
	}
	
	if(GUILayout.Button("CatHurt"))
	{
		print("Play CatHurt");
		audio.PlayOneShot(catHurt);
	}
	
	if(GUILayout.Button("Meow"))
	{
		print("Play Meow");
		audio.PlayOneShot(meow);
	}
	
	if(GUILayout.Button("Meow2"))
	{
		print("Play Meow2");
		audio.PlayOneShot(meow2);
	}
	
	if(GUILayout.Button("Crowd"))
	{
		print("Play Crowd");
		audio.PlayOneShot(crowd);
	}
	
	if(GUILayout.Button("WinRoar"))
	{
		print("Play WinRoar");
		audio.PlayOneShot(winRoar);
	}
	
	if(GUILayout.Button("Splash"))
	{
		print("Play Splash");
		audio.PlayOneShot(splash);
	}
	
	if(GUILayout.Button("Beep"))
	{
		print("Play Beep");
		audio.PlayOneShot(beep);
	}
	
	

}
@script RequireComponent(AudioSource)


