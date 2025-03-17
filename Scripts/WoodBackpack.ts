
import { MonoBehaviour, Collider, Object } from "UnityEngine";
export default class WoodBackpack extends MonoBehaviour {
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    private AddWoodToBackpack() : void
    {

    }

    private OnTriggerEnter(other: Collider) 
    {
        if (other.tag == "Wood")
        {
            // Add wood
            this.AddWoodToBackpack();

            // Destroy flying wood
            Object.Destroy(other.gameObject);
        }
    }
}
