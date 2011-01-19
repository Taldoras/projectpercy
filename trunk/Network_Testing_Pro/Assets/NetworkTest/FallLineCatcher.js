private var spawnManager : GameObject;
var splash : AudioClip; 
var respawning;

function Start()
{
	spawnManager = GameObject.Find("SpawnPoint");
}

function OnTriggerEnter (other : Collider)
{
	var tPS : ThirdPersonStatus = other.GetComponent(ThirdPersonStatus);
	if ( tPS )
	{
		
		print("Play Splash");
		audio.clip = splash;
		audio.Play();
		
		
		//tPS.Respawn();
		respawnPlayer(tPS);
		
		if ( Network.isServer )
		{
			tPS.RemovePoint();
		}
	}
}

function respawnPlayer(tPS)
{
	/*
	if(!respawning)
	{
		respawning = true;
		
		yield WaitForSeconds(3);
		
		tPS.Respawn();
		
		respawning = false;
	}
	*/
	yield WaitForSeconds(3);
	tPS.Respawn();
}

/*
	var tPS : ThirdPersonStatus = other.GetComponent (ThirdPersonStatus);
	// Player fall out!
	if (tPS)
	{
		tPS.Respawn();
		if ( Network.isServer )
		{
			var score : int = 0;
			var attacker = tPS.GetAttacker();
			if ( attacker != null )
			{
				score = attacker.GetComponent(ThirdPersonStatus).AwardPoint();
				tPS.SetAttacker(null);
			}
			else
			{
				score = tPS.RemovePoint();
			}
			//Figure out if an RPC is need/nice-to-have to update scores
		}	
	}
}
*/

// Auto setup the pickup
function Reset ()
{
	if (collider == null)
		gameObject.AddComponent(BoxCollider);
	collider.isTrigger = true;
}

