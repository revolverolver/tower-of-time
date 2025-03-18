
import { MonoBehaviour, Collider, Object, Transform, Quaternion, GameObject, Vector3, Time } from "UnityEngine";
import { forEachChild } from "typescript";
import WoodPiece from "./WoodPiece";
import Building from "./Building";
export default class WoodBackpack extends MonoBehaviour {

    @SerializeField private backpack: Transform;
    @SerializeField slots: Transform[]; // = new Transform[20];
    
    private maxWood: int = 20;
    private woodAmount: int = 0;

    public static woodFull: bool;

    // Sending Wood to build buildings
    private currentBuilding: GameObject;
    private sendAmount: int = 0;
    private sendingWood: bool = false;

    private sendTime: float = 0.1;
    private woodTimer: float = this.sendTime;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (this.sendingWood)
        {
            if (this.woodTimer <= 0 && this.sendAmount > 0)
            {
                this.SendWoodPiece();

                // Reset timer
                this.woodTimer = this.sendTime;
            }
            
            this.woodTimer -= Time.deltaTime;
        }
    }

    private AddWoodToBackpack(obj: GameObject) : void
    {
        // Disable collider and wood script to prevent multiple adds
        let collider = obj.GetComponent<Collider>();
        collider.enabled = false;

        let woodPiece = obj.GetComponent<WoodPiece>();
        woodPiece.carried = true;

        // Place wood in free slot in backpack
        let wood = obj.transform;
        wood.SetParent(this.slots[this.woodAmount]);
        wood.transform.localPosition = Vector3.zero;

        // Adjust rotation
        wood.localRotation = Quaternion.Euler(0, 0, 90);

        // Increase wood carried
        this.woodAmount++;

        if (this.woodAmount >= this.maxWood)
        {
            WoodBackpack.woodFull = true;
        }
    }

    private StartSendingWood(obj: GameObject) : void
    {
        // Ask building if it needs wood and how much
        let building = obj.GetComponent<Building>();
        let woodToSend = building.WoodNeeded();

        if (woodToSend == 0)
            return;

        // Start Sending Wood
        this.currentBuilding = obj;

        this.sendAmount = woodToSend;
        this.sendingWood = true;
        this.woodTimer = this.sendTime;

        // Send first piece before starting the timer
        this.SendWoodPiece();
    }

    private SendWoodPiece() : void
    {
        // Send piece from top of backpack
        console.log(this.slots[this.woodAmount - 1].GetChild(0).name);

        let woodPiece = this.slots[this.woodAmount - 1].GetChild(0);
        let wood = woodPiece.GetComponent<WoodPiece>();
        wood.SendToBuilding(this.currentBuilding);

        this.woodAmount--;
        this.sendAmount--;

        // Check if there is wood left
        if (this.woodAmount <= 0 || this.sendAmount <= 0)
        {
            // No more wood to send so let's stop sending
            this.sendingWood = false;
        }
        else if (WoodBackpack.woodFull)
        {
            // Backpack no longer full
            WoodBackpack.woodFull = false;
        }
    }

    OnTriggerEnter(other: Collider) 
    {
        // Getting Wood
        if (other.tag == "Wood")
        {
            if (WoodBackpack.woodFull)
            {
                // Inventory full
                Object.Destroy(other.gameObject);
            }
            else
            {
                // Add wood
                this.AddWoodToBackpack(other.gameObject);
            }
        }

        // Building
        if (other.tag == "Building")
        {
            if (this.woodAmount <= 0)
                return;

            // Player is carrying wood and will start sending wood
            this.StartSendingWood(other.gameObject);
        }
    }

    private OnTriggerExit(other: Collider) 
    {
        // Building
        if (other.tag == "Building")
        {
            this.sendingWood = false;
        }
    }
}
