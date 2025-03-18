
import { MonoBehaviour, Collider, Object, GameObject } from "UnityEngine";
export default class Building extends MonoBehaviour {

    @SerializeField private building: GameObject;

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

    private CollectWood() : void 
    {
        // Increase wood
        this.currentWood++;

        if (this.currentWood == this.woodNeeded)
        {
            // Build turret
            this.building.SetActive(true);
        }
    }

    private OnTriggerEnter(other: Collider) 
    {
        if (other.tag == "BuildingMaterial")
        {
            // Collect Wood
            if (this.currentWood < this.woodNeeded)
                this.CollectWood();

            // Destroy wood piece
            Object.Destroy(other.gameObject);
        }
    }
}
