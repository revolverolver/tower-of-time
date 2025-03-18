
import { MonoBehaviour, Collider, Object } from "UnityEngine";
export default class Building extends MonoBehaviour {

    private woodNeeded: int = 20;
    private currentWood: int = 0;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    public WoodNeeded() : int
    {
        let amount = this.woodNeeded - this.currentWood;
        return amount;
    }

    private OnTriggerEnter(other: Collider) 
    {
        if (other.tag == "BuildingMaterial")
        {
            // Collect Wood
            Object.Destroy(other.gameObject);
        }
    }
}
