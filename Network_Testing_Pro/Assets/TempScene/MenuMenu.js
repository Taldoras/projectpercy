var catPicker : CatPicker;
var catStats : CatStats;
var gameOver : GameOver;

function OnGUI () {

	if(GUI.Button(Rect(0,40,100,20), "Cat Picker"))
	{
		print("Show CatPicker");
		if(catPicker.showCatPicker)
		{
			catPicker.showCatPicker = false;
		}
		else
		{
			catPicker.showCatPicker = true;
		}
		
	}

	if(GUI.Button(Rect(0,70,100,20), "Cat Stats"))
	{
		print("Show CatStats");
		if(catStats.catStatsVisible)
		{
			catStats.catStatsVisible = false;
		}
		else
		{
			catStats.catStatsVisible = true;
		}
	}

	if(GUI.Button(Rect(0,100,100,20), "Game Over"))
	{
		print("Show GameOver");
		if(gameOver.gameOverVisible)
		{
			gameOver.gameOverVisible = false;
		}
		else
		{
			gameOver.gameOverVisible = true;
		}
	}


}