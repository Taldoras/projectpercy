var pushPower = 3;
var pushLayers : LayerMask = -1;
private var controller : ThirdPersonController;
private var rigidBody : Rigidbody;

@script RequireComponent(ThirdPersonController)
//@script RequireComponent(Rigidbody)

function Start ()
{
	controller = GetComponent (ThirdPersonController);
	rigidBody = GetComponent(Rigidbody);
	//Debug.Log("Spawn point type is: "+GameObject.Find("SpawnPoint"));
}

function OnControllerColliderHit (hit : ControllerColliderHit)
{
/*
	var body : Rigidbody = hit.collider.attachedRigidbody;
	// no rigidbody
	if (body == null || body.isKinematic)
	{
		Debug.Log("no rigid body!!!");
		return;
	}
	// Ignore pushing those rigidbodies
	var bodyLayerMask = 1 << body.gameObject.layer;
	if ((bodyLayerMask & pushLayers.value) == 0)
		return;
*/
	if ( Network.isServer )
	{
		if (  hit.collider.gameObject.tag != "Player" )
		{
			return;
		}

		Debug.Log("I am "+controller.gameObject.name);
		Debug.Log("I hit a "+hit.collider.gameObject.name);

		// We dont want to push objects below us
		//if (hit.moveDirection.y < -0.3) 
			//return;
		
		// Calculate push direction from move direction, we only push objects to the sides
		// never up and down
		var pushDir = Vector3 (hit.moveDirection.x, 0.5, hit.moveDirection.z);
		//var pushDir = rigidBody.velocity;
		
		// push with move speed but never more than walkspeed
		var controller = hit.collider.gameObject.GetComponent(CharacterController);
		//var rb = hit.collider.gameObject.GetComponent(Rigidbody);
		//controller.transform.position = controller.transform.position + (pushDir * pushPower);
		var slamDirection = transform.InverseTransformDirection(controller.transform.position - transform.position);
		slamDirection.y = 0;
		slamDirection.z = 1;
		if (slamDirection.x >= 0)
			slamDirection.x = 1;
		else
			slamDirection.x = -1;
			
		var victim : GameObject = hit.collider.gameObject; 
		victim.SendMessage("SetAttacker", this.gameObject);
		victim.SendMessage("Slam", transform.TransformDirection(slamDirection));		
		Debug.Log(this.gameObject.GetInstanceID()+" attacked "+victim.GetInstanceID());
	}	
}

