var runSpeedScale = 1.0;
var walkSpeedScale = 1.0;

private var myAnim : Animation;
private	var playerController : ThirdPersonController;
	
var meow : AudioClip;
var meow2 : AudioClip;
var meow3Mad : AudioClip;

function Start ()
{
	playerController = GetComponent(ThirdPersonController);
	myAnim = GetComponentInChildren(Animation);

	Debug.Log("myAnim is "+myAnim);

	// By default loop all animations
	myAnim.wrapMode = WrapMode.Loop;

	//animation["run"].layer = 1;
	myAnim["walk"].layer = 1;
	myAnim["idle"].layer = 1;
	myAnim.SyncLayer(1);

	// The jump animation is clamped and overrides all others
	myAnim["jump"].layer = 1;
	myAnim["jump"].wrapMode = WrapMode.ClampForever;

    // We are in full control here - don't let any other animations play when we start
	myAnim.Stop();
	myAnim.Play("idle");
}

function Update ()
{
	var currentSpeed = playerController.GetSpeed();

	// Fade in run
	if (currentSpeed > playerController.walkSpeed)
	{
		//animation.CrossFade("run");
		// We fade out jumpland quick otherwise we get sliding feet
		//animation.Blend("jumpland", 0);
	}
	// Fade in walk
	else if (currentSpeed > 0.1)
	{
		myAnim.CrossFade("walk");
		// We fade out jumpland realy quick otherwise we get sliding feet
		//animation.Blend("jumpland", 0);
	}
	// Fade out walk and run
	else
	{
		myAnim.CrossFade("idle");
		//myAnim.Blend("walk", 0.0, 0.3);
		//animation.Blend("run", 0.0, 0.3);
		//animation.Blend("run", 0.0, 0.3);
	}
	
	//animation["run"].normalizedSpeed = runSpeedScale;
	myAnim["walk"].normalizedSpeed = walkSpeedScale;
	
	if (playerController.IsJumping ())
	{
		//if (playerController.IsControlledDescent())
		//{
			//animation.CrossFade ("jetpackjump", 0.2);
		//}
		//else 
		if (playerController.HasJumpReachedApex ())
		{
			//animation.CrossFade ("jumpfall", 0.2);
		}
		else
		{
			myAnim.CrossFade ("jump", 0.2);
			
			MakeNoise("jump");
			/*
			*
			* Extracting to fucnction maybe...
			*
			
			
			if (!audio.isPlaying)
			{
				print("Play Meow");
				audio.clip = meow;
				audio.Play();
			}
			*/
		}
	}
	// We fell down somewhere
	else if (!playerController.IsGroundedWithTimeout())
	{
		//animation.CrossFade ("ledgefall", 0.2);
	}
	// We are not falling down anymore
	else
	{
		//animation.Blend ("idle", 0.0, 0.2);
	}
}

function DidLand () {
	//animation.Play("jumpland");
}

function DidButtStomp () {
	//animation.CrossFade("buttstomp", 0.1);
	//animation.CrossFadeQueued("jumpland", 0.2);
}

function Slam () {
	//animation.CrossFade("buttstomp", 0.2);
	var playerController : ThirdPersonController = GetComponent(ThirdPersonController);
	while(!playerController.IsGrounded())
	{
		yield;	
	}
	//animation.Blend("buttstomp", 0, 0);
}


function DidWallJump ()
{
	// Wall jump animation is played without fade.
	// We are turning the character controller 180 degrees around when doing a wall jump so the animation accounts for that.
	// But we really have to make sure that the animation is in full control so 
	// that we don't do weird blends between 180 degree apart rotations
	//animation.Play ("walljump");
}

function MakeNoise(soundType)
{
	if (!audio.isPlaying)
	{
		//print("Play Meow");
		
		var randomSound = Random.Range(1,30);
		
		if(randomSound < 13)
		{
		audio.clip = meow;
		}
		else if(randomSound < 27)
		{
		audio.clip = meow2;
		}
		else if(randomSound < 30)
		{
		audio.clip = meow3Mad;
		}
		
		audio.Play();
	}
		
}

@script AddComponentMenu ("Third Person Player/Third Person Player Animation")