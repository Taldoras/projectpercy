// DontDestroyOnLoad(this);

var gameName = "Sumo Cats";
var serverPort = 25002;

var directIP = "127.0.0.1";
var directPort = "25002";

private var timeoutHostList = 0.0;
private var lastHostListRequest = -1000.0;
private var hostListRefreshTimeout = 10.0;

private var natCapable : ConnectionTesterStatus = ConnectionTesterStatus.Undetermined;
private var filterNATHosts = false;
private var probingPublicIP = false;
private var doneTesting = false;
private var timer : float = 0.0;

private var windowRect = Rect (Screen.width-300,0,300,100);
private var hideTest = false;
private var testMessage = "Undetermined NAT capabilities";
private var runDedicated = false;
private var directConnect = false;

private var spawnTracker;

// Enable this if not running a client on the server machine
//MasterServer.dedicatedServer = true;

function OnFailedToConnectToMasterServer(info: NetworkConnectionError)
{
	Debug.Log("Connection to Master Server failed!");
	Debug.Log(info);
}

function OnFailedToConnect(info: NetworkConnectionError)
{
	Debug.Log("Failed to connect!");
	Debug.Log(info);
}

function OnGUI ()
{
	windowRect = GUILayout.Window (0, windowRect, MakeWindow, "Network Controls");
}

function Awake ()
{
	// Start connection test
	natCapable = Network.TestConnection();
	
	// What kind of IP does this machine have? TestConnection also indicates this in the
	// test results
	if (Network.HavePublicAddress())
		Debug.Log("This machine has a public IP address");
	else
		Debug.Log("This machine has a private IP address");
}

function Start()
{
	spawnTracker = GameObject.Find("SpawnPoint");
}

function Update() {
	// If test is undetermined, keep running
	if (!doneTesting) {
		TestConnection();
	}
}

function TestConnection() {
	// Start/Poll the connection test, report the results in a label and react to the results accordingly
	natCapable = Network.TestConnection();
	switch (natCapable) {
		case ConnectionTesterStatus.Error: 
			testMessage = "Problem determining NAT capabilities";
			doneTesting = true;
			break;
			
		case ConnectionTesterStatus.Undetermined: 
			testMessage = "Undetermined NAT capabilities";
			doneTesting = false;
			break;
			
		case ConnectionTesterStatus.PrivateIPNoNATPunchthrough: 
			testMessage = "Cannot do NAT punchthrough, filtering NAT enabled hosts for client connections, local LAN games only.";
			filterNATHosts = true;
			Network.useNat = true;
			doneTesting = true;
			break;
			
		case ConnectionTesterStatus.PrivateIPHasNATPunchThrough:
			if (probingPublicIP)
				testMessage = "Non-connectable public IP address (port "+ serverPort +" blocked), NAT punchthrough can circumvent the firewall.";
			else
				testMessage = "NAT punchthrough capable. Enabling NAT punchthrough functionality.";
			// NAT functionality is enabled in case a server is started,
			// clients should enable this based on if the host requires it
			Network.useNat = true;
			doneTesting = true;
			break;
			
		case ConnectionTesterStatus.PublicIPIsConnectable:
			testMessage = "Directly connectable public IP address.";
			Network.useNat = false;
			doneTesting = true;
			break;
			
		// This case is a bit special as we now need to check if we can 
		// cicrumvent the blocking by using NAT punchthrough
		case ConnectionTesterStatus.PublicIPPortBlocked:
			testMessage = "Non-connectble public IP address (port " + serverPort +" blocked), running a server is impossible.";
			Network.useNat = false;
			// If no NAT punchthrough test has been performed on this public IP, force a test
			if (!probingPublicIP)
			{
				Debug.Log("Testing if firewall can be circumnvented");
				natCapable = Network.TestConnectionNAT();
				probingPublicIP = true;
				timer = Time.time + 10;
			}
			// NAT punchthrough test was performed but we still get blocked
			else if (Time.time > timer)
			{
				probingPublicIP = false; 		// reset
				Network.useNat = true;
				doneTesting = true;
			}
			break;
		case ConnectionTesterStatus.PublicIPNoServerStarted:
			testMessage = "Public IP address but server not initialized, it must be started to check server accessibility. Restart connection test when ready.";
			break;
		default: 
			testMessage = "Error in test routine, got " + natCapable;
	}
	//Debug.Log(natCapable + " " + probingPublicIP + " " + doneTesting);
}

function MakeWindow (id : int) {
	
	hideTest = GUILayout.Toggle(hideTest, "Hide test info");
	directConnect = GUILayout.Toggle(directConnect, "Direct Connect");
	runDedicated = GUILayout.Toggle(runDedicated, "Run as dedicated");
		
	if (!hideTest) {
		GUILayout.Label(testMessage);
		if (GUILayout.Button ("Retest connection"))
		{
			Debug.Log("Redoing connection test");
			probingPublicIP = false;
			doneTesting = false;
			natCapable = Network.TestConnection(true);
		}
	}

	directIP = GUILayout.TextField(directIP, 25);
	directPort = GUILayout.TextField(directPort,10);

	if (Network.peerType == NetworkPeerType.Disconnected)
	{
		//Debug.Log("disconn type is "+NetworkPeerType.Disconnected);
		GUILayout.BeginHorizontal();

		if(runDedicated)
		{
			MasterServer.dedicatedServer = true;
		}
		else
		{
			MasterServer.dedicatedServer = false;		
		}
		
		// Start a new server
		if (GUILayout.Button ("Start Server"))
		{
			Network.InitializeServer(32, serverPort);
			MasterServer.RegisterHost(gameName, "Tons of fun!", "Knock the fat bastard off!");
		}		
		GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal();
		
		GUILayout.BeginHorizontal();
		// Refresh hosts
		if (GUILayout.Button ("Refresh available Servers") || Time.realtimeSinceStartup > lastHostListRequest + hostListRefreshTimeout)
		{
			MasterServer.RequestHostList (gameName);
			lastHostListRequest = Time.realtimeSinceStartup;
		}
		GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal();

		GUILayout.Space(5);

		if(!directConnect)
		{
			var data : HostData[] = MasterServer.PollHostList();
			for (var element in data)
			{
				GUILayout.BeginHorizontal();
				Debug.Log("Hosts found.");
				// Do not display NAT enabled games if we cannot do NAT punchthrough
				if ( !(filterNATHosts && element.useNat) )
				{
					//Debug.Log("NAT punchthrough.");
					var name = element.gameName + " " + element.connectedPlayers + " / " + element.playerLimit;
					GUILayout.Label(name);	
					GUILayout.Space(5);
					var hostInfo;
					hostInfo = "[";
					// Here we display all IP addresses, there can be multiple in cases where
					// internal LAN connections are being attempted. In the GUI we could just display
					// the first one in order not confuse the end user, but internally Unity will
					// do a connection check on all IP addresses in the element.ip list, and connect to the
					// first valid one.
					for (var host in element.ip)
					{
						hostInfo = hostInfo + host + ":" + element.port + " ";
					}
					hostInfo = hostInfo + "]";
					//GUILayout.Label("[" + element.ip + ":" + element.port + "]");	
					GUILayout.Label(hostInfo);	
					GUILayout.Space(5);
					GUILayout.Label(element.comment);
					GUILayout.Space(5);
					GUILayout.FlexibleSpace();
					if (GUILayout.Button("Connect"))
					{
						// Enable NAT functionality based on what the hosts if configured to do
						Network.useNat = element.useNat;
						if (Network.useNat)
							print("Using Nat punchthrough to connect");
						else
							print("Connecting directly to host");
							
						if(!directConnect)
							Network.Connect(element.ip, element.port);			
						//Network.Connect("127.0.0.1", element.port);			
					}
				}
				else
				{
					Debug.Log("No NAT");
				}
				GUILayout.EndHorizontal();	
			}
		}
		else
		{
				if (GUILayout.Button("Connect"))
				{
					Network.useNat = false; //We know address of machine and dont need NAT
					var info: NetworkConnectionError;
					Debug.Log("Attempting connection to "+directIP+":"+directPort);
					info = Network.Connect(directIP, parseInt(directPort));
					Debug.Log("Direct connect result: "+info);
				}				
		}
			
	}
	else
	{
		if (GUILayout.Button ("Disconnect"))
		{
			Network.Disconnect();
			MasterServer.UnregisterHost();
			spawnTracker.SendMessage("CleanAllPlayers");
		}
		if(Network.isServer && !MasterServer.dedicatedServer)
		{
		/*
			if(GUILayout.Button("Connect to Local Server"))
			{
				Network.Connect(directIP, parseInt(directPort));
			}
			*/
		}	
		GUILayout.FlexibleSpace();
	}
	GUI.DragWindow (Rect (0,0,1000,1000));
}
