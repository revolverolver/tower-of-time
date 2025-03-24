
import { MonoBehaviour, Collider, Object, GameObject } from "UnityEngine";
import PlayerSounds from "./PlayerSounds";
import { TextMeshProUGUI } from "TMPro";
export default class Building extends MonoBehaviour {

    @SerializeField private building: GameObject;
    @SerializeField private levelText: TextMeshProUGUI;
    @SerializeField private woodText: TextMeshProUGUI;

    private playerSounds: PlayerSounds;

    private woodNeeded: int = 20;
    private currentWood: int = 0;

    public level: int = 0;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.playerSounds = PlayerSounds.Instance;
        //this.levelText.text = "";
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    public WoodNeeded() : int
    {
        let amount = this.woodNeeded; // - this.currentWood;
        return amount;
    }

    private CollectWood() : void 
    {
        // Increase wood
        this.currentWood++;

        // Play Sound
        this.playerSounds.PlayQuickSound(1, 0.3, 0.8);

        if (this.currentWood == this.woodNeeded)
        {
            // Build turret
            this.building.SetActive(true);

            // Level up
            this.level++;
            this.levelText.text = "LV. " + this.level.toString();
            this.currentWood = 0;
        }

        // Update text
        this.woodText.text = this.currentWood.toString() + "/20";
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
