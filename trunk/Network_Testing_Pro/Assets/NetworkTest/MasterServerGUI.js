// DontDestroyOnLoad(this);

var gState : GlobalState;
gState = GameObject.Find("GlobalState").GetComponent(GlobalState);

var connected = false;

var gameName = "Sumo Cats";

var listenPort = 25000;
var strListenPort = "25000";

var remotePort = 25001;
var strRemotePort = "25001";

var remoteIP = "127.0.0.1";

private var timeoutHostList = 0.0;
private var lastHostListRequest = -1000.0;
private var hostListRefreshTimeout = 10.0;

private var natCapable : ConnectionTesterStatus = ConnectionTesterStatus.Undetermined;
private var filterNATHosts = false;
private var probingPublicIP = false;
private var doneTesting = false;
private var timer : float = 0.0;

private var windowRect = Rect ((Screen.width/2)-150,0,300,100);
private var hideTest = false;
private var testMessage = "Undetermined NAT capabilities";
private var runDedicated = false;
private var directConnect = false;

private var spawnTracker : SpawnTracker;

// Enable this if not running a client on the server machine
//MasterServer.dedicatedServer = true;

function OnFailedToConnectToMasterServer(info: NetworkConnectionError)
{
	//Debug.Log("Connection to Master Server failed!");
	//Debug.Log(info);
}

function OnFailedToConnect(info: NetworkConnectionError)
{
	connected = false;
	//Debug.Log("Failed to connect!");
	//Debug.Log(info);
}

function Awake()
{
	MasterServer.ClearHostList();
	MasterServer.RequestHostList(gameName);

	//natCapable = Network.TestConnection();

	/*
	var data : HostData[] = MasterServer.PollHostList();
	if ( data.length <= 0 )
	{
		//Debug.Log("MasterServerGUI Awake() starting server ");
		Network.InitializeServer(32, listenPort);
		MasterServer.RegisterHost(gameName, "Tons of fun!", "Knock the fat bastard off!");
	}
	*/
}

function Start()
{
	spawnTracker = GameObject.Find("SpawnPoint").GetComponent(SpawnTracker);
}

var gotStartTime = false;
var startTime;
var startedServer = false;
var triedLocal = false;

function Update()
{
	if (doneTesting)
	{
		if (!connected)
		{
			MasterServer.RequestHostList(gameName);
			var data : HostData[] = MasterServer.PollHostList();
			//Debug.Log("MasterServerGUI Update() data length = " + data.length);
			if ( data.length > 0 && !Network.isServer)
			{
				////Debug.Log("MasterServerGUI Update() connecting to server: data[0].ip: " + data[0].ip + " data[0].port: " + data[0].port);
				// How can I tell that if the IP address is from a private network?
				Network.useNat = false;
				Network.Connect(data[0].ip, data[0].port);
				connected = true;
			}
			else
			{
				//Debug.Log("MasterServerGUI Update() no server to connect to ");
				if (!gotStartTime)
				{
					startTime = System.DateTime.Now;
					gotStartTime = true;
				}
				else
				{
					var currentTime = System.DateTime.Now;
					var timeDiff = currentTime.Subtract(startTime);
					
					if ( timeDiff.TotalSeconds > 3 )
					{
						if ( triedLocal )
						{
							//Debug.Log("MasterServerGUI Update() starting server ");
							Network.InitializeServer(32, listenPort);
							MasterServer.RegisterHost(gameName, "Tons of fun!", "Knock the fat bastard off!");
							connected = true;
						}
					}
					else
					{
						if ( !triedLocal )
						{
							Network.useNat = false;
							Network.Connect("127.0.0.1", listenPort);
							connected = true;
							triedLocal = true;
						}
					}
				}
			}
		}
		else
		{
			if ( Network.peerType != NetworkPeerType.Disconnected && !spawnTracker.isLocalInitialized() )
			{
				var playerInstance : PlayerInfo  = spawnTracker.InitServerPlayer();
				spawnTracker.SpawnServerPlayer(playerInstance.transformViewID, playerInstance.animationViewID, playerInstance.textureID);
			}
		}
	}
	else
	{
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
				testMessage = "Non-connectable public IP address (port "+ listenPort +" blocked), NAT punchthrough can circumvent the firewall.";
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
			testMessage = "Non-connectble public IP address (port " + listenPort +" blocked), running a server is impossible.";
			Network.useNat = false;
			// If no NAT punchthrough test has been performed on this public IP, force a test
			if (!probingPublicIP)
			{
				//Debug.Log("Testing if firewall can be circumnvented");
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
	//Debug.Log(natCapable + " " + probingPublicIP + " " + doneTesting + " " + testMessage);
}

function MakeWindow (id : int) 
{

}
