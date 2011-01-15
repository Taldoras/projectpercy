//var catMaterials : Material[];
var catTextures : Texture[];

private var textureSelectWin = Rect (Screen.width-200,Screen.height-150,200,25);
private var textureIndex = 0;
private var spawnTracker : SpawnTracker = null;
private var thirdPersonStatus : ThirdPersonStatus = null;
private var tempTexIndex = 0;
private var GUS = null;
private var renderMenu = false;
private var sumoCatRenderers = null;

function Start () 
{
	spawnTracker = GameObject.Find("SpawnPoint").GetComponent(SpawnTracker);
	thirdPersonStatus = GetComponent("ThirdPersonStatus");
	GUS = GetComponent("GraduallyUpdateState");
	sumoCatRenderers =  this.gameObject.GetComponentsInChildren(Renderer);
	setPlayerTexture(textureIndex);
	tempTexIndex = textureIndex;
	//Debug.Log("post renderer ");
	//Debug.Log("ST.get is "+spawnTracker.getLocalTransformViewID()+" tps.id "+thirdPersonStatus.getPlayerID());
	renderMenu = spawnTracker.getLocalTransformViewID() == thirdPersonStatus.getPlayerID();
	//Debug.Log("Render window is: "+renderMenu);
}

function TextureSelectorWindow (id : int) 
{
	if( GUILayout.Button ("Next Texture") )
	{
		tempTexIndex = tempTexIndex + 1;
		if( tempTexIndex >= catTextures.length )
		{
			GUILayout.Label("Texture wrap "+tempTexIndex);
			tempTexIndex = 0;
		}
		setPlayerTexture(tempTexIndex);		
	}
	
	if( GUILayout.Button("Apply Texture") )
	{
		textureIndex = tempTexIndex;
		networkView.RPC("UpdatePlayerTexture",
			RPCMode.AllBuffered,
			spawnTracker.getLocalTransformViewID(),
			textureIndex); 
	}
}

function getPlayerTexture()
{
	return textureIndex;
}

function setPlayerTexture( texIdx : int )
{
	if( texIdx >= 0 && texIdx < catTextures.length )
	{
		textureIndex = texIdx;		
		for( i = 0; i < sumoCatRenderers.length; i++)
		{
			sumoCatRenderers[i].material.mainTexture = catTextures[textureIndex];
		}
	}
	else
	{
		Debug.Log("Texture out of bounds for "+thirdPersonStatus.getPlayerID());
	}
}

function Update () 
{

}

function OnGUI ()
{
	if( renderMenu )
	{
		textureSelectWin = GUILayout.Window (3, textureSelectWin, TextureSelectorWindow, "Texture Select");
	}
}

@RPC
function UpdatePlayerTexture( transformViewID : NetworkViewID, textureIndex : int )
{
	var playerInstance : PlayerInfo = spawnTracker.getPlayer(transformViewID);	
	if( playerInstance )
	{
		playerInstance.playerTransform.gameObject.GetComponent("MaterialSelection").setPlayerTexture(textureIndex);
	}
}
