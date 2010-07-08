function OnNetworkInstantiate (msg : NetworkMessageInfo) {
	// This is our own player
	if (networkView.isMine)
	{
		Debug.Log("Init my player");
		Camera.main.SendMessage("SetTarget", transform);
		GetComponent("NetworkInterpolatedTransform").enabled = false;
	}
	// This is just some remote controlled player
	else
	{
		Debug.Log("Init remote player");
		name += "Remote";
		GetComponent(ThirdPersonController).enabled = false;
		//GetComponent(ThirdPersonSimpleAnimation).enabled = false;
		GetComponent("NetworkInterpolatedTransform").enabled = true;
	}
}
