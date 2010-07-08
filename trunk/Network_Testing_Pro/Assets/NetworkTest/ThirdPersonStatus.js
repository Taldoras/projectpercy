
private var score : int;
private var respawnPosition : Vector3;
private var attacker : GameObject = null;
private var spawnManager : SpawnTracker = null;
private var playerId : NetworkViewID;

function Start()
{
    spawnManager = GameObject.Find("SpawnPoint").GetComponent(SpawnTracker);
	//respawnPosition = transform.Find("SpawnPoint").position;
	respawnPosition = spawnManager.transform.position;
}

function Update () 
{
}

function setPlayerID( myId : NetworkViewID )
{
	playerId = myId;
}

function Respawn ()
{
	//Camera.main.transform.position = respawnPosition - (transform.forward * 4) + Vector3.up;	// reset camera too
	// Hide the player briefly to give the death sound time to finish...
	SendMessage("HidePlayer");
	
	// Relocate the player. We need to do this or the camera will keep trying to focus on the (invisible) player where he's standing on top of the FalloutDeath box collider.
	transform.position = respawnPosition + Vector3.up;

	yield WaitForSeconds(2.0);	
	
	// (NOTE: "HidePlayer" also disables the player controls.)

	SendMessage("ShowPlayer");	// Show the player again
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


