
import { MonoBehaviour, Collider, Object, Transform, Quaternion, GameObject, Vector3, Time } from "UnityEngine";
import { forEachChild } from "typescript";
import WoodPiece from "./WoodPiece";
import Building from "./Building";
import { TextMeshProUGUI } from "TMPro";
import PlayerSounds from "./PlayerSounds";
import CameraMovement, {CameraState} from "./CameraMovement";
export default class WoodBackpack extends MonoBehaviour {

    @SerializeField private woodText: TextMeshProUGUI;
    @SerializeField private backpack: Transform;
    @SerializeField slots: Transform[]; // = new Transform[20];

    private gameManager: CameraMovement;

    private playerSounds: PlayerSounds;
    
    private maxWood: int = 20;
    public static woodAmount: int = 0;

    public static woodFull: bool;

    // Sending Wood to build buildings
    private currentBuilding: GameObject;
    private sendAmount: int = 0;
    private sendingWood: bool = false;

    private isPlaying: bool;

    private sendTime: float = 0.1;
    private woodTimer: float = this.sendTime;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.gameManager = CameraMovement.Instance;
        this.playerSounds = PlayerSounds.Instance;

        this.gameManager.OnCameraStateChange.addListener(this.CheckGameState);
    }

    private CheckGameState(newState: CameraState) {
        switch(newState) {
            case CameraState.FOLLOWING_PLAYER:
                this.isPlaying = true;
                break;
            default:
                this.isPlaying = false;
                break;
        }
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (this.sendingWood && this.isPlaying)
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
        wood.SetParent(this.slots[WoodBackpack.woodAmount]);
        wood.transform.localPosition = Vector3.zero;

        // Adjust rotation
        wood.localRotation = Quaternion.Euler(0, 0, 90);

        // Increase wood carried
        WoodBackpack.woodAmount++;

        // Update text
        this.woodText.text = WoodBackpack.woodAmount + "/" + this.maxWood;

        // Play sound
        this.playerSounds.PlayQuickSound(1, 0.8);

        if (WoodBackpack.woodAmount >= this.maxWood)
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
        //console.log(this.slots[WoodBackpack.woodAmount - 1].GetChild(0).name);

        let woodPiece = this.slots[WoodBackpack.woodAmount - 1].GetChild(0);
        let wood = woodPiece.GetComponent<WoodPiece>();
        wood.SendToBuilding(this.currentBuilding);

        WoodBackpack.woodAmount--;
        this.sendAmount--;

        // Update text
        this.woodText.text = WoodBackpack.woodAmount.toString() + "/" + this.maxWood.toString();

        // Play sound
        this.playerSounds.PlayQuickSound(0, 0.3, 0.8);

        // Check if there is wood left
        if (WoodBackpack.woodAmount <= 0 || this.sendAmount <= 0)
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
            if (WoodBackpack.woodAmount <= 0)
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
