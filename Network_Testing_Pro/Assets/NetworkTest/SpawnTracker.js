var playerPrefab : Transform;
var test:boolean = false;
// Local player information when one is instantiated
private var initialized : boolean  = false;
private var localTransformViewID : NetworkViewID;
//private var localAnimationViewID : NetworkViewID;
private var isInstantiated : boolean = false;
// The server uses this to track all intantiated player
private var playerInfo : Array = new Array();

private var scoreInfo : Rect = new Rect (0,320,320,320);
var catScoreMenuTexture : Texture2D;
var catLifeMenuTexture : Texture2D;

class PlayerInfo 
{
	var transformViewID : NetworkViewID;
	//var animationViewID : NetworkViewID;
	var player : NetworkPlayer; //local server players will not have a value for this since there is no network connection
	var playerTransform : Transform;
	var ready : boolean = false;
	var score : int = 0;
}

function OnGUI () 
{
	if(Network.isClient)
	{
		if (initialized && !isInstantiated) 
		{
			if (GUI.Button(new Rect(20,Screen.height-60, 90, 20),"SpawnPlayer"))
			{
				// Spawn the player on all machines
				networkView.RPC("SpawnPlayer", RPCMode.AllBuffered, localTransformViewID);//, localAnimationViewID);
				isInstantiated = true;
			}
		}	
	}
	DrawScoreMenus();
}

function DrawScoreMenus()
{
	var picDimensionX = 32;
	var picDimensionY = 32;

	var menuPositions = new Array();
	menuPositions[0] = [0,0];
	menuPositions[1] = [Screen.width-256,0];
	menuPositions[2] = [0,Screen.height-70];
	menuPositions[3] = [Screen.width-256,Screen.height-70];
	
	var playerCount = playerInfo.length;
	if ( playerCount > 0 )
	{
		var currentPlayerIndex = 0;
		while ( (currentPlayerIndex < playerInfo.length) && (currentPlayerIndex < menuPositions.length) )
		{
			var x = menuPositions[currentPlayerIndex][0];
			var y = menuPositions[currentPlayerIndex][1];
			GUI.Label(Rect(x,y,256,70), catScoreMenuTexture);

			var playerinstance : PlayerInfo = playerInfo[currentPlayerIndex];
			for ( var i=0; i<=(8+playerinstance.score); i=i+1)
			{
				var currentX = x + i*(picDimensionX-6);
				GUI.Label(Rect(currentX,y+(70-picDimensionY),picDimensionX,picDimensionY),catLifeMenuTexture);
			}
		
			currentPlayerIndex++;
		}
	}
	
}

// This runs if the scene is executed from the loader scene.
// Here we must check if we already have clients connect which must be reinitialized.
// This is the same procedure as in OnPlayerConnected except we process already
// connected players instead of new ones. The already connected players have also
// reloaded the level and thus have a clean slate.
function OnNetworkLoadedLevel() 
{
/*
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
*/	
}

// Send initalization info to the new player, before that he cannot spawn himself
function OnPlayerConnected (player : NetworkPlayer) 
{
	if(Network.isServer)
	{
		Debug.Log("Sending player init to "+player);
		var transformViewID : NetworkViewID = Network.AllocateViewID();
		//var	animationViewID : NetworkViewID = Network.AllocateViewID();
		Debug.Log("Player given view IDs "+ transformViewID);// + " and " + animationViewID);
		var playerInstance : PlayerInfo = new PlayerInfo();
		playerInstance.transformViewID = transformViewID;
		//playerInstance.animationViewID = animationViewID;
		playerInstance.player = player;	
		networkView.RPC("InitPlayer", player, transformViewID);//, animationViewID);
	}
}

function OnPlayerDisconnected (player : NetworkPlayer) 
{
	Debug.Log("*** OnPlayerDisconnected ***");
	var playerInstance = getPlayer(player);
	cleanPlayer(playerInstance);
	
}


function OnDisconnectedFromServer(info : NetworkDisconnection)  
{
	Debug.Log("*** OnDisconnectedFromServer ***");
	if (!Network.isServer)
	{
		CleanAllPlayers();
	}
}
	

function CleanUpPlayer(transformViewID : NetworkViewID)
{
	//Debug.Log("CleanUpPlayer called");
	var playerInstance = getPlayer(transformViewID);
	cleanPlayer(playerInstance);
	networkView.RPC("DestroyPlayer", RPCMode.All, transformViewID);
}

function cleanPlayer( deletePlayer : PlayerInfo )
{
	Debug.Log("cleanPlayer begin");
	if( deletePlayer == null )
		return;
	//Debug.Log("Cleaning up player " + playerInstance.player);
	// Destroy the player object this network player spawned
	Debug.Log("Player not null");
	//Debug.Log("Destroying objects belonging to view ID " + playerInstance.transformViewID);
	if(deletePlayer.transformViewID == localTransformViewID)
		isInstantiated = false;	

	networkView.RPC("DestroyPlayer", RPCMode.All, deletePlayer.transformViewID);

	Network.RemoveRPCs(deletePlayer.player, 0);
	Network.Destroy(deletePlayer.transformViewID);
	Network.DestroyPlayerObjects(deletePlayer.player);
	playerInfo.Remove(deletePlayer);
	Debug.Log("playerInfo length is "+playerInfo.length);
}

function CleanAllPlayers()
{
	Debug.Log("Clean ALL players "+playerInfo.length);
	isInstantiated = false;	
	initialized = false;
	
	
	for(var playerInstance : PlayerInfo in playerInfo)
	{
		var deletePlayer : PlayerInfo;

		//Debug.Log("Destroying objects belonging to view ID " + playerInstance.transformViewID);
		deletePlayer = playerInstance;

		//Network.RemoveRPCs(deletePlayer.player, 0);
		//Network.Destroy(playerInstance.transformViewID);
		//Network.DestroyPlayerObjects(deletePlayer.player);
	}
	playerInfo.length = 0;
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

function getPlayer(player : NetworkPlayer)
{
	var tagetPlayer : PlayerInfo = null;
	for(var playerInstance : PlayerInfo in playerInfo)
	{
		if(playerInstance.player == player)
		{
			targetPlayer = playerInstance;
		}
	}	
	
	return targetPlayer;
}

function ScoreWindow(windowID : int) 
{	
	GUILayout.ExpandWidth(true);
	for(var playerInstance : PlayerInfo in playerInfo)
	{
		GUILayout.Label(playerInstance.transformViewID+" score: "+playerInstance.score);
	}
}

function Update () {
}


function InitServerPlayer()
{

	Debug.Log("Initialize server player. (No net connection)");
	var transformViewID : NetworkViewID = Network.AllocateViewID();
	//var	animationViewID : NetworkViewID = Network.AllocateViewID();
	Debug.Log("Server player given view IDs "+ transformViewID);// + " and " + animationViewID);
	var playerInstance : PlayerInfo = new PlayerInfo();
	playerInstance.transformViewID = transformViewID;
	//playerInstance.animationViewID = animationViewID;
	//playerInstance.player = null;	
	playerInfo.Add(playerInstance);
	
	localTransformViewID = transformViewID;
	initialized = true;
	
	return localTransformViewID;
}

function SpawnServerPlayer(transformViewID)
{
	var playerInstance = getPlayer(transformViewID);
	if( playerInstance == null )
	{
		Debug.Log("Could not find player instance for server player with transformviewID "+transformViewID);
		return;
	}

	Debug.Log("Instantiating server player");
	var instantiatedPlayer : Transform = Instantiate(playerPrefab, transform.position, transform.rotation);
	var networkViews = instantiatedPlayer.GetComponents(NetworkView);
	
	//set the id on the instance so we can communicate with other components 
	instantiatedPlayer.GetComponent (ThirdPersonStatus).setPlayerID(transformViewID);
	
	// Assign view IDs to player object
	if (networkViews.Length != 1) 
	{
		Debug.Log("Error while spawning player, prefab should have 1 network views, has "+networkViews.Length);
		return;
	} 
	else 
	{
		networkViews[0].viewID = transformViewID;
		//networkViews[1].viewID = animationViewID;
	}
	
	instantiatedPlayer.GetComponent(ThirdPersonController).enabled = true;
	// Record player info so he can be destroyed properly
	playerInstance.playerTransform = instantiatedPlayer;
	Debug.Log("playerId (transformViewID): "+playerInstance.transformViewID); 

	// Initialize local player
	Debug.Log("Enabling user input as this is the server player");
	// W are doing client prediction and thus enable the controller script + user input processing
	//instantiatedPlayer.GetComponent(ThirdPersonController).enabled = true;
	instantiatedPlayer.GetComponent(ThirdPersonController).getUserInput = true;
	// Enable input network synchronization (server gets input)
	instantiatedPlayer.GetComponent(NetworkController).enabled = true;
	instantiatedPlayer.SendMessage("SetOwnership");
	var camObj : GameObject = GameObject.FindWithTag("MainCamera");
	var followCam : SmoothLookAt = camObj.GetComponent(SmoothLookAt);
	followCam.target = instantiatedPlayer;
	
	Debug.Log("There are now " + playerInfo.length + " players active");
	
	networkView.RPC("SpawnPlayer", RPCMode.OthersBuffered, localTransformViewID);//, localAnimationViewID);
	isInstantiated = true;	
}

function isLocalInitialized()
{
	return initialized;
}

function getLocalTransformViewID()
{
	return localTransformViewID;
}

//RPC Calls ########################################

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

@RPC
function UpdatePlayerTexture(transformViewID : NetworkViewID, textureIndex : int) 
{
	var playerInstance : PlayerInfo = getPlayer(transformViewID);
	if(playerInstance)
	{
		var ms = playerInstance.playerTransform.GetComponent(MaterialSelection);
	}
}


// Receive server initialization, record own identifier as seen by the server.
// This is later used to recognize if a network spawned player is the local player.
// Also record assigned view IDs so the server can synch the player correctly.
@RPC
function InitPlayer (tViewID : NetworkViewID){//, aViewID : NetworkViewID) {
	Debug.Log("Received player init ViewIDs " + tViewID);// + " and " + aViewID);
	localTransformViewID = tViewID;
	//localAnimationViewID = aViewID;
	initialized = true;
}

// Create a networked player in the game. Instantiate a local copy of the player, set the view IDs
// accordingly. 
@RPC
function SpawnPlayer (transformViewID : NetworkViewID)//, animationViewID : NetworkViewID) {
{
	Debug.Log("Instantiating player " + transformViewID);
	var instantiatedPlayer : Transform = Instantiate(playerPrefab, transform.position, transform.rotation);
	var networkViews = instantiatedPlayer.GetComponents(NetworkView);
	
	//set the id on the instance so we can communicate with other components 
	instantiatedPlayer.GetComponent (ThirdPersonStatus).setPlayerID(transformViewID);
	
	// Assign view IDs to player object
	if (networkViews.Length != 1) 
	{
		Debug.Log("Error while spawning player, prefab should have 1 network views, has "+networkViews.Length);
		return;
	} 
	else 
	{
		networkViews[0].viewID = transformViewID;
		//networkViews[1].viewID = animationViewID;
	}
	
	instantiatedPlayer.GetComponent(ThirdPersonController).enabled = true;
	//instantiatedPlayer.GetComponent(AuthServerPersonAnimation).enabled = true;
	// Record player info so he can be destroyed properly
	var playerInstance : PlayerInfo = new PlayerInfo();
	playerInstance.transformViewID = transformViewID;
	//playerInstance.animationViewID = animationViewID;
	//playerInstance.player = playerIdentifier;
	playerInstance.playerTransform = instantiatedPlayer;
	Debug.Log("playerId (transformViewID): "+playerInstance.transformViewID); 
	playerInfo.Add(playerInstance);
		
	// Initialize local player
	if (transformViewID == localTransformViewID) 
	{
		Debug.Log("Enabling user input as this is the local player");
		// W are doing client prediction and thus enable the controller script + user input processing
		//instantiatedPlayer.GetComponent(ThirdPersonController).enabled = true;
		instantiatedPlayer.GetComponent(ThirdPersonController).getUserInput = true;
		// Enable input network synchronization (server gets input)
		instantiatedPlayer.GetComponent(NetworkController).enabled = true;
		instantiatedPlayer.SendMessage("SetOwnership");
		var camObj : GameObject = GameObject.FindWithTag("MainCamera");
		var followCam : SmoothLookAt = camObj.GetComponent(SmoothLookAt);
		followCam.target = instantiatedPlayer;
		//followCam.DidChangeTarget(); //Call this to update target association (spring follow camera)
	}
	else
	{
		//instantiatedPlayer.name += "Remote";
	}
	
	Debug.Log("There are now " + playerInfo.length + " players active");
	
}

@RPC
function DestroyPlayer (transformViewID : NetworkViewID)
{
	var playerInstance : PlayerInfo = getPlayer(transformViewID);
	playerInfo.Remove(playerInstance);

	Destroy(playerInstance.playerTransform.gameObject);
	Debug.Log("playerInfo length is "+playerInfo.length);	
}

