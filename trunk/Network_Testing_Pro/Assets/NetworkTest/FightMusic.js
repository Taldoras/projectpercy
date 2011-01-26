var ago : GameObject;
ago = new GameObject("Ago");
ago.AddComponent("AudioSource");
var clip : AudioClip[];

ago.audio.clip = clip[Random.Range(1,4)];
ago.audio.loop = true;
ago.audio.volume = 0.8;


function Update () {

}