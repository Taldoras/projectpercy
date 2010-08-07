
// login stuff
var userNamePrime = "user name";
var passwordPrime = "password";
var userName = userNamePrime;
var password = passwordPrime;
var loginStatus = "";
var loggedin = false;

var loginUrl="https://pp.lvlys.com/login/login/login-game.aspx?"; 	
var createAccountUrl="https://pp.lvlys.com/login/login/createAccount-game.aspx?"; 	

// gui stuff
var windowRect = Rect(20, 200, 200, 400);
	
function Start() {

}

function OnGUI () {
	if(loggedin)
	{
		//showStart();			
		windowRect = GUI.Window (0, windowRect, showStart, "");		
	}
	else
	{
		//showLogin();
		windowRect = GUI.Window (0, windowRect, showLogin, "");
	}
		
	clearFields();

}

function showStart()
{
	if(GUI.Button( Rect(20,30,100,20), "Logout")) 
	{
		loggedin = false;	
		userName = "";
		password = "";
	}
		
	if (GUI.Button (Rect (20,60,100,50), "New Game")) {		
		Application.LoadLevel("Scene1");
	}	
		

}
	
function showLogin() {
	//print("Showing login");
	
	// the users name
	 GUI.SetNextControlName ("txtUserName");
	userName = GUI.TextField(Rect(20,10,100,20), userName); 

	// password
	GUI.SetNextControlName ("txtPassword");
	password = GUI.TextField( Rect(20,40,100,20), password); 
	
	// login button
	if(GUI.Button( Rect(20,70,100,20), "Login")) 
	{		
		postLogin(userName, password);
		Debug.Log("login click:" + userName); 		
	}
	
	// create user
	if(GUI.Button( Rect(20,100,100,20), "Create User")) 
	{		
		postCreate(userName, password);
		Debug.Log("create click:" + userName); 		
	}
	
	GUI.Label(Rect(20,130,400,50),  loginStatus);	
}

function postLogin(userName, password) {
    //This connects to a server side php script that will add the name and score to a MySQL DB.
    // Supply it with a string representing the players name and the players score.
    var login_url = loginUrl + "u=" + WWW.EscapeURL(userName) + "&p=" +  WWW.EscapeURL(password);
     
	loginStatus = "Attempting Login...";
    // Post the URL to the site and create a download object to get the result.
    login_post = WWW(login_url);
    yield login_post; // Wait until the download is done
	
    if(login_post.error) {
        print("There was an error logging in: " + login_post.error);
    }
	
	if(login_post.data == "1")
	{
		print("Login Successful!");
		loggedin = true;
		showStartGame();
	}
	else
	{
		loginStatus = "Invalid User Name or Password";
		Debug.Log("login click:" + userName); 	
	}
}

function postCreate(userName, password) {
    //This connects to a server side php script that will add the name and score to a MySQL DB.
    // Supply it with a string representing the players name and the players score.
    var create_url = createAccountUrl + "u=" + WWW.EscapeURL(userName) + "&p=" +  WWW.EscapeURL(password);
       
    // Post the URL to the site and create a download object to get the result.
    create_post = WWW(create_url);
    yield create_post; // Wait until the download is done
	
    if(create_post.error) {
        print("There was an error creating the account: " + create_post.error);
    }
	
	if(create_post.data == "1")
	{
		print("Creation Successful!");
		
		userName = "";
		password = "";
		
		loginStatus = "Account created, please login.";
	}
	else
	{
		loginStatus = create_post.data;
		Debug.Log("create click:" + userName); 	
	}
}


function clearFields() {
	// clears fields on focus 

	if( (GUI.GetNameOfFocusedControl ()  == "txtUserName") &&	(userName == "user name") )
	{
		userName = "";
	}
	
	if( (GUI.GetNameOfFocusedControl ()  == "txtPassword") &&	(password == "password") )
	{
		password = "";
	}
		
}

function showStartGame() {

}