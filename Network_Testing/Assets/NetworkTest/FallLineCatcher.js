
function OnTriggerEnter (other : Collider)
{
	// Player fall out!
	if (other.GetComponent (ThirdPersonStatus))
	{
		other.GetComponent (ThirdPersonStatus).Respawn();
	}
}

// Auto setup the pickup
function Reset ()
{
	if (collider == null)
		gameObject.AddComponent(BoxCollider);
	collider.isTrigger = true;
}

