using UnityEngine;
using System.Collections;

public class NewBehaviourScript : MonoBehaviour {
	Renderer cubeRenderer;

	// Use this for initialization
	void Start () {
	
	}
	
	void OnGUI(){
		if(GUI.Button(new Rect(0,0, 200, 100), "Click Me!"))
		{
			//do stuff
			if(cubeRenderer.material.color == Color.red)
				cubeRenderer.material.color = Color.white;
			else
				cubeRenderer.material.color = Color.red;
		}
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
