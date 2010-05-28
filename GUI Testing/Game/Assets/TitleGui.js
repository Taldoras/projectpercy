
var cubeRenderer : Renderer;

var ScoresGui : GUIText;

function OnGUI() 
{	
	if(GUI.Button(Rect(0,0, 200, 100), "Click Me!"))
	{
		var ps:scores = ScoresGui.GetComponent(scores);	
		
		
		//do stuff
		if(cubeRenderer.material.color == Color.red)
		{
			cubeRenderer.material.color = Color.white;
			ps.postScore("test", 30);
			ps.getScores();
		}
		else
		{
			cubeRenderer.material.color = Color.red;
			ps.postScore("test", 30);
			ps.getScores();
		}
			
		
		
			
	}
}