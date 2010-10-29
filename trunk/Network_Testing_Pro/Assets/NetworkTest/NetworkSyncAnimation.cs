using UnityEngine;
using System.Collections;
using System;

public class NetworkSyncAnimation : MonoBehaviour {
	
	public enum AniStates 
	{
		idle = 0,
		walk,
		jump/*,
		jumpfall,
		attack,
		gothit,
		deathfall*/
	}
	
	public AniStates currentAnimation = AniStates.idle;
	public AniStates lastAnimation = AniStates.idle;
	
	public void SyncAnimation(String animationValue)
	{
		currentAnimation = (AniStates)Enum.Parse(typeof(AniStates), animationValue);
	}
	
	// Update is called once per frame
	void Update () 
	{
		//Debug.Log("Current Animation is "+currentAnimation);
		if (lastAnimation != currentAnimation)
		{
			lastAnimation = currentAnimation;
			animation.CrossFade(Enum.GetName(typeof(AniStates), currentAnimation));
			animation["idle"].normalizedSpeed = 1.0F;
			//sumoCat.animation["run"].normalizedSpeed = 1.0F;
			animation["walk"].normalizedSpeed = 1.0F;
		}
	}
	
	void OnSerializeNetworkView(BitStream stream, NetworkMessageInfo info)
	{
		if (stream.isWriting)
		{
			char ani = (char)currentAnimation;
			stream.Serialize(ref ani);
		}
		else
		{
			char ani = (char)0;
			stream.Serialize(ref ani);
			
			currentAnimation = (AniStates)ani;
		}	
	
	}

}
