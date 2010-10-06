function OnGUI()
{
	if(GUI.Button(Rect(0, 10,100,20),"Start Count"))
	{
		countDown();	
		Debug.Log("Start Countdown");
	}
}

function countDown(){
	var o_countdownTimer : countdownTimer;
	var f_timerdone = timerDone;
	o_countdownTimer = GetComponent(countdownTimer);
	Debug.Log("setting timer");
	o_countdownTimer.setStartTime(10);
	o_countdownTimer.setTimerDoneAction(f_timerdone);
	
	o_countdownTimer.setTimerState(true);


}

function timerDone() {
	guiText.text = "FIGHT!";
}