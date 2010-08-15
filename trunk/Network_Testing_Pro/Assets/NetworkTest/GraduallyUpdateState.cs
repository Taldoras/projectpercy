using UnityEngine;
using System;
using System.Collections;
using System.Reflection;

// For the client which owns the player, the local transform contains 
// the current client _predicted_ position/rotation. The buffered state
// contains the _server_ position/rotation, which is the correct state. The
// predicted and server states are interpolated together so the predicted
// state will always converge with the server state.
//
// For the server the transform contains the current 100% legal position and
// rotation of the player in question. He sends this over the network
// to all clients.
//
// For other clients, which don't own this player, the buffered state contains 
// the correct values. This is played back with a 100 ms delay to elminate
// choppyness. The delay needs to be higher is the ping time between the server
// and client is larger than 100 ms.
public class GraduallyUpdateState : MonoBehaviour {
	
	Component targetController;
	FieldInfo isMovingFieldInfo;
	CharacterController characterController;
	
	bool m_interpol = false;
	bool m_extrapol = false;
	
	internal struct  State
	{
		internal double timestamp;
		internal Vector3 pos;
		internal Quaternion rot;
		//internal Vector3 velocity;
		//internal Vector3 angularVelocity;
	}
	// How far behind should server data be played back during remote player
	// interpolation. The poorer the connection the higher this value needs to
	// be. Fast connections should do fine with 0.1. The server latency
	// affects this the most.
	public double m_InterpolationBackTime = 0.1; 	
	public double m_ExtrapolationLimit = .5;
	
	// We store twenty states with "playback" information
	State[] m_BufferedState = new State[20];

	// Keep track of what slots are used
	int m_TimestampCount;
	int m_LocalStateCount;
	
	bool m_IsMine = false;
	
	// Stat variables for latency, msg rate
	float m_Timer = Time.time + 1;
	int m_MsgCounter = 0;
	int m_MsgRate = 0;
	double m_MsgLatencyTotal = 0;
	double m_MsgLatency = 0;
	
	// Stat variabels for prediction stuff
	float m_TimeAccuracy = 0;
	float m_PredictionAccuracy = 0;
	
	GameObject spawnTracker = null;		
	
	// The position vector distance to start error correction. The higher the latency the higher this
	// value should be or it constantly tries to correct errors in prediction, of course this depends
	// on the game too.
	public float m_PredictionThreshold = 0.25F;
	// Time difference in milliseconds where we check for error in position. If the server time value
	// of a state is too different from the local state time then the error correction comparison is
	// highly unreliable and you might try to correct more errors than there really are.
	public float m_TimeThreshold = 0.05F;
		
	Rect connInfo = new Rect (Screen.width-280,40,320,160);
	Rect playerInfo = new Rect(0, 0, 160, 80);
	
	// We need to grab a reference to the isMoving variable in the javascript ThirdPersonController script
	void Start() 
	{
		
		targetController = GetComponent("ThirdPersonController");
		isMovingFieldInfo=targetController.GetType().GetField("isMoving");
		spawnTracker = GameObject.Find("SpawnPoint");
		//characterController = GetComponent("CharacterController");
	}
	
	// Convert field info from character controller script to a local bool variable
	bool targetIsMoving 
	{
		get {
			return (bool) isMovingFieldInfo.GetValue(targetController);
		}
	}

	void OnGUI() 
	{
		if (m_IsMine) 
		{
			connInfo = GUILayout.Window(0, connInfo, MakeConnInfoWindow, "Local Player");
		}
		else
		{
			playerInfo = GUILayout.Window(1, playerInfo, MakeNetPlayerInfoWindow, "Net Player");
		}
	}
	
	void MakeNetPlayerInfoWindow(int windowID)
	{
		GUILayout.Label(string.Format("Buffer Latest Pos: {0},{1},{2}", m_BufferedState[0].pos.x,m_BufferedState[0].pos.y,m_BufferedState[0].pos.z));
		GUILayout.Label(string.Format("Buffer Latest Rot: {0},{1},{2}", m_BufferedState[0].rot.x,m_BufferedState[0].rot.y,m_BufferedState[0].rot.z));
		GUILayout.Label(string.Format("Message count: {0}", m_MsgCounter));
		GUILayout.Label(string.Format("Transform Latest Pos: {0},{1},{2}", transform.position.x,transform.position.y,transform.position.z));
		GUILayout.Label(string.Format("Transform Latest Rot: {0},{1},{2}", transform.rotation.x,transform.rotation.y,transform.rotation.z));
		GUILayout.Label(string.Format("Interpolating: {0}", m_interpol));
		GUILayout.Label(string.Format("Extrapolating: {0}", m_extrapol));
	
	}
	
	void MakeConnInfoWindow(int windowID) 
	{
		//GUILayout.BeginVertical();
		GUILayout.Label(string.Format("{0} msg/s {1,4:f3} ms", m_MsgRate, m_MsgLatency));
		GUILayout.Label(string.Format("Time Difference : {0,3:f3}", m_TimeAccuracy));
		GUILayout.Label(string.Format("Prediction Difference : {0,3:f3}", m_PredictionAccuracy));
		//GUILayout.EndVertical();
		if (Time.time - m_Timer > 0) {
			m_MsgRate = m_MsgCounter;
			m_Timer = Time.time + 1;
			m_MsgCounter = 0;
			if (m_MsgRate != 0) {
				m_MsgLatency = (m_MsgLatencyTotal/(double)m_MsgRate)*1000F;
			} else {
				m_MsgLatency = 0;
			}
			m_MsgLatencyTotal = 0;
		}
		GUILayout.Label(string.Format("Latest Pos: {0},{1},{2}", transform.position.x,transform.position.y,transform.position.z));
		GUILayout.Label(string.Format("Latest Rot: {0},{1},{2}", transform.rotation.x,transform.rotation.y,transform.rotation.z));
	}
	
	// The network sync routine makes sure m_BufferedState always contains the last 20 updates
	// The latest update is in slot 0, oldest in slot 19
	void OnSerializeNetworkView(BitStream stream, NetworkMessageInfo info)
	{
		// Always send transform (depending on reliability of the network view)
		if (stream.isWriting)
		{
			
			Vector3 pos = transform.position;
			Quaternion rot = transform.rotation;
			stream.Serialize(ref pos);
			stream.Serialize(ref rot);
			
		}
		// When receiving, buffer the information
		else
		{		
			m_MsgCounter++;
			m_MsgLatencyTotal += (Network.time-info.timestamp);
			
			// Receive latest state information
			
			Vector3 pos = Vector3.zero;
			Quaternion rot = transform.rotation;//Quaternion.identity;
			stream.Serialize(ref pos);
			stream.Serialize(ref rot);
						
			// Shift buffer contents, oldest data erased, 18 becomes 19, ... , 0 becomes 1
			for (int i=m_BufferedState.Length-1;i>=1;i--)
			{
				m_BufferedState[i] = m_BufferedState[i-1];
			}
			
			// Save currect received state as 0 in the buffer, safe to overwrite after shifting
			State state;
			state.timestamp = info.timestamp;
			state.pos = pos;
			state.rot = rot;
			//state.velocity = velocity;
			//state.angularVelocity = angularVelocity;			
			m_BufferedState[0] = state;
			
			// Increment state count but never exceed buffer size
			m_TimestampCount = Mathf.Min(m_TimestampCount + 1, m_BufferedState.Length);

			// Check integrity, lowest numbered state in the buffer is newest and so on
			for (int i=0;i<m_TimestampCount-1;i++)
			{
				if (m_BufferedState[i].timestamp < m_BufferedState[i+1].timestamp)
					Debug.Log("State inconsistent");
			}
			
			//Debug.Log("stamp: " + info.timestamp + "my time: " + Network.time + "delta: " + (Network.time - info.timestamp));
		}
	}
	
	void SetOwnership() 
	{
		Debug.Log("Setting ownership for local player");
		m_IsMine = true;
	}
	
	// This only runs where the component is enabled, which is only on remote peers (server/clients)
	void Update () 
	{
		double currentTime = Network.time;
		double interpolationTime = currentTime - m_InterpolationBackTime;
		
		// We have a window of interpolationBackTime where we basically play 
		// By having interpolationBackTime the average ping, you will usually use interpolation.
		// And only if no more data arrives we will use extrapolation
		m_interpol = m_BufferedState[0].timestamp > interpolationTime;
		 if (m_BufferedState[0].timestamp > interpolationTime)
		{
			for (int i = 0; i < m_TimestampCount ; i++)
			{
				// Find the state which matches the interpolation time (time+0.1) or use last state
				if (m_BufferedState[i].timestamp <= interpolationTime || i == m_TimestampCount-1)
				{
					// The state one slot newer (<100ms) than the best playback state
					State rhs = m_BufferedState[Mathf.Max(i-1, 0)];
					// The best playback state (closest to 100 ms old (default time))
					State lhs = m_BufferedState[i];
					
					// Use the time between the two slots to determine if interpolation is necessary
					double length = rhs.timestamp - lhs.timestamp;
					float t = 0.0F;
					// As the time difference gets closer to 100 ms t gets closer to 1 in 
					// which case rhs is only used
					if (length > 0.0001)
						t = (float)((interpolationTime - lhs.timestamp) / length);
					
					// if t=0 => lhs is used directly
					transform.localPosition = Vector3.Lerp(lhs.pos, rhs.pos, t);
					transform.localRotation = Quaternion.Slerp(lhs.rot, rhs.rot, t);
					//m_InterpolationTime = (Network.time - m_BufferedState[i].timestamp)*1000;
					return;
				}
			}
		}
		// Use extrapolation. Here we do something really simple and just repeat the last
		// received state. You can do clever stuff with predicting what should happen.
		else
		{
			State latest = m_BufferedState[0];
			
			float extrapolationLength = (float)(interpolationTime - latest.timestamp);
			m_extrapol = extrapolationLength < m_ExtrapolationLimit;
			// Don't extrapolation for more than 500 ms, you would need to do that carefully
			if (extrapolationLength < m_ExtrapolationLimit)
			{
				
				transform.position = latest.pos;
				transform.rotation = latest.rot;
				
			}
		}
	}
/*
	void OnDisconnectedFromServer(NetworkDisconnection info)  
	{
		if (Network.isServer)
		{
			Debug.Log("Local server connection disconnected");
		}
		else 
		{
			if (info == NetworkDisconnection.LostConnection)
				Debug.Log("Lost connection to the server");
			else
			{
				Debug.Log("Successfully diconnected from the server.  PeerType now "+Network.peerType);
			}
			if (spawnTracker == null)
			{
				Debug.Log("SpawnTracker is null");
			}
			else
			{

				//Right now there is only one network view for this object, the transform network view.  
				//In the future we could have many more so we would need to index by the proper one.
				NetworkView[] netViews = gameObject.GetComponents<NetworkView>();
				if( netViews.Length == 1)
					spawnTracker.SendMessage("CleanUpPlayer", netViews[0].viewID);
				else
					Debug.Log("Could not find the network views.");
			}
		}
		//Destroy(gameObject);
	}
*/	
}