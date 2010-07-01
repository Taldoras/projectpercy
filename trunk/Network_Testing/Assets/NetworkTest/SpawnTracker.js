var playerPrefab : Transform;
var test:boolean = false;
// Local player information when one is instantiated
private var localPlayer : NetworkPlayer;
private var localTransformViewID : NetworkViewID;
//private var localAnimationViewID : NetworkViewID;
private var isInstantiated : boolean = false;
// The server uses this to track all intantiated player
private var playerInfo : Array = new Array();

private var scoreInfo : Rect = new Rect (0,Screen.height - 170,160,180);

class PlayerInfo {
	var transformViewID : NetworkViewID;
	//var animationViewID : NetworkViewID;
	var player : NetworkPlayer;
	var ready : boolean = false;
	var score : int = 0;
}

function OnGUI () {
	if (Network.isClient && localPlayer.ToString() != 0 && !isInstantiated) 
		if (GUI.Button(new Rect(20,Screen.height-60, 90, 20),"SpawnPlayer"))
		{
			// Spawn the player on all machines
			networkView.RPC("SpawnPlayer", RPCMode.AllBuffered, localPlayer, localTransformViewID);//, localAnimationViewID);
			isInstantiated = true;
		}
		
	scoreInfo = GUILayout.Window(2, scoreInfo, ScoreWindow, "Scores");		
}

// Receive server initialization, record own identifier as seen by the server.
// This is later used to recognize if a network spawned player is the local player.
// Also record assigned view IDs so the server can synch the player correctly.
@RPC
function InitPlayer (player : NetworkPlayer, tViewID : NetworkViewID){//, aViewID : NetworkViewID) {
	Debug.Log("Received player init "+ player +". ViewIDs " + tViewID);// + " and " + aViewID);
	localPlayer = player;
	localTransformViewID = tViewID;
	//localAnimationViewID = aViewID;
}

// Create a networked player in the game. Instantiate a local copy of the player, set the view IDs
// accordingly. 
@RPC
function SpawnPlayer (playerIdentifier : NetworkPlayer, transformViewID : NetworkViewID){//, animationViewID : NetworkViewID) {
	Debug.Log("Instantiating player " + playerIdentifier);
	var instantiatedPlayer : Transform = Instantiate(playerPrefab, transform.position, transform.rotation);
	var networkViews = instantiatedPlayer.GetComponents(NetworkView);
	
	//set the id on the instance so we can communicate with other components 
	instantiatedPlayer.GetComponent (ThirdPersonStatus).setPlayerID(transformViewID);
	
	// Assign view IDs to player object
	if (networkViews.Length != 1) {
		Debug.Log("Error while spawning player, prefab should have 1 network views, has "+networkViews.Length);
		return;
	} else {
		networkViews[0].viewID = transformViewID;
		//networkViews[1].viewID = animationViewID;
	}
	// Initialize local player
	if (playerIdentifier == localPlayer) {
		Debug.Log("Enabling user input as this is the local player");
		// W are doing client prediction and thus enable the controller script + user input processing
		//instantiatedPlayer.GetComponent(ThirdPersonController).enabled = true;
		instantiatedPlayer.GetComponent(ThirdPersonController).getUserInput = true;
		// Enable input network synchronization (server gets input)
		instantiatedPlayer.GetComponent(NetworkController).enabled = true;
		instantiatedPlayer.SendMessage("SetOwnership", playerIdentifier);
		//return;
	// Initialize player on server
	//} else if (Network.isServer) {
	}
	
	instantiatedPlayer.GetComponent(ThirdPersonController).enabled = true;
	//instantiatedPlayer.GetComponent(AuthServerPersonAnimation).enabled = true;
	// Record player info so he can be destroyed properly
	var playerInstance : PlayerInfo = new PlayerInfo();
	playerInstance.transformViewID = transformViewID;
	//playerInstance.animationViewID = animationViewID;
	playerInstance.player = playerIdentifier;
	Debug.Log("playerId (transformViewID): "+playerInstance.transformViewID); 
	playerInfo.Add(playerInstance);
	Debug.Log("There are now " + playerInfo.length + " players active");
	
}

// This runs if the scene is executed from the loader scene.
// Here we must check if we already have clients connect which must be reinitialized.
// This is the same procedure as in OnPlayerConnected except we process already
// connected players instead of new ones. The already connected players have also
// reloaded the level and thus have a clean slate.
function OnNetworkLoadedLevel() {
	if (Network.isServer && Network.connections.Length > 0) {
		for (var p : NetworkPlayer in Network.connections) {
			Debug.Log("Resending player init to "+p);
			var transformViewID : NetworkViewID = Network.AllocateViewID();
			//var	animationViewID : NetworkViewID = Network.AllocateViewID();
			Debug.Log("Player given view IDs "+ transformViewID);// + " and " + animationViewID);
			//networkView.RPC("InitPlayer", p, p, transformViewID, animationViewID);
			networkView.RPC("InitPlayer", p, p, transformViewID);
		}
	}
}

// Send initalization info to the new player, before that he cannot spawn himself
function OnPlayerConnected (player : NetworkPlayer) {
	Debug.Log("Sending player init to "+player);
	var transformViewID : NetworkViewID = Network.AllocateViewID();
	//var	animationViewID : NetworkViewID = Network.AllocateViewID();
	Debug.Log("Player given view IDs "+ transformViewID);// + " and " + animationViewID);
//	networkView.RPC("InitPlayer", player, player, transformViewID, animationViewID);
	networkView.RPC("InitPlayer", player, player, transformViewID);//, animationViewID);

}

function OnPlayerDisconnected (player : NetworkPlayer) 
{
	cleanPlayer( player );
}

function CleanUpPlayer(player : GameObject)
{
	Debug.Log("CleanUpPlayer called");
	netPlayer = player.GetComponent(NetworkPlayer);
	cleanPlayer(netPlayer);
}

function cleanPlayer( player : NetworkPlayer )
{
	Debug.Log("Cleaning up player " + player);
	// Destroy the player object this network player spawned
	var deletePlayer : PlayerInfo;
	for (var playerInstance : PlayerInfo in playerInfo) {
		if (player == playerInstance.player) {
			Debug.Log("Destroying objects belonging to view ID " + playerInstance.transformViewID);
			Network.Destroy(playerInstance.transformViewID);
			deletePlayer = playerInstance;
		}
	}
	playerInfo.Remove(deletePlayer);
	Network.RemoveRPCs(player, 0);
	Network.DestroyPlayerObjects(player);
}

function setPlayerScore(transformViewID : NetworkViewID, score : int)
{
	var playerInstance = getPlayer(transformViewID);
	if(playerInstance)
	{
		networkView.RPC("updateScore",RPCMode.All, playerInstance.transformViewID, score);
	}
	else
	{
		Debug.Log("SpawnTracker.setPlayerScore: Player not found!");
	}
}

@RPC
function updateScore(transformViewID : NetworkViewID, score : int)
{
	var playerInstance : PlayerInfo = getPlayer(transformViewID);
	if(playerInstance)
	{
			Debug.Log("updateScore: "+score);
			playerInstance.score = score;
	}
}

function getPlayer(transformViewID : NetworkViewID)
{
	var tagetPlayer : PlayerInfo = null;
	for(var playerInstance : PlayerInfo in playerInfo)
	{
		if(playerInstance.transformViewID == transformViewID)
		{
			targetPlayer = playerInstance;
		}
	}	
	
	return targetPlayer;
}

function ScoreWindow(windowID : int) 
{	
	for(var playerInstance : PlayerInfo in playerInfo)
	{
		GUILayout.Label(playerInstance.transformViewID+" score: "+playerInstance.score);
	}
}

function Update () {
}