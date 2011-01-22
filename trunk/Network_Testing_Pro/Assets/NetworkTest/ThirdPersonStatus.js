
private var score : int;
private var respawnPosition : Vector3;
private var attacker : GameObject = null;
private var spawnManager : SpawnTracker = null;
private var playerId : NetworkViewID;
private var playerName = "";
private var textureIndex : int = 0;
private var globalState : GlobalState;

function Start()
{
    spawnManager = GameObject.Find("SpawnPoint").GetComponent(SpawnTracker);
	respawnPosition = spawnManager.transform.position;
	
	//go get player name
	globalState = GameObject.Find("GlobalState").GetComponent(GlobalState);
	
	if ( globalState.localplay )
	{
		if ( !globalState.player1Spawned ) 
		{
			playerName = globalState.playerName;
			globalState.player1Spawned = true;
		}
		else
		{
			playerName = globalState.playerName2;
		}
	}
	else
	{
		playerName = globalState.playerName;
	}
	
	spawnManager.setPlayerName(playerId, playerName);
}

function Update () 
{
}

function Respawn ()
{
	//Camera.main.transform.position = respawnPosition - (transform.forward * 4) + Vector3.up;	// reset camera too
	// Hide the player briefly to give the death sound time to finish...
	//SendMessage("HidePlayer");
	
	// Relocate the player. We need to do this or the camera will keep trying to focus on the (invisible) player where he's standing on top of the FalloutDeath box collider.
	transform.position = respawnPosition + Vector3.up;

	//yield WaitForSeconds(2.0);	
	
	//SendMessage("ShowPlayer");	// Show the player again
}

function AwardPoint()
{
	score++;
	Debug.Log("Point awarded to "+playerId+" score now "+score);
	spawnManager.setPlayerScore(playerId, score);
	return score;
}

function RemovePoint()
{
	score--;
	Debug.Log("Suicide! Point removed from "+playerId+" score now "+score);
	spawnManager.setPlayerScore(playerId, score);
	return score;
}

function SetAttacker(attackedBy : GameObject)
{
	//if(attackedBy != null)
		//Debug.Log(this.gameObject.GetInstanceID()+" was attacked by "+attackedBy.GetInstanceID());
	attacker = attackedBy;
}

function GetAttacker()
{
	return attacker;
}

function setPlayerID( myId : NetworkViewID )
{
	playerId = myId;
}

function getPlayerID()
{
	return playerId;
}

function getPlayerName()
{
	return playerName;
}

function setPlayerName( newName )
{
	playerName = newName;
}
