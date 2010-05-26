private var gameMaster : GameObject;

function Start()
{
	gameMaster = GameObject.Find("SpawnPoint");
}

function OnTriggerEnter (other : Collider)
{
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

// Auto setup the pickup
function Reset ()
{
	if (collider == null)
		gameObject.AddComponent(BoxCollider);
	collider.isTrigger = true;
}

