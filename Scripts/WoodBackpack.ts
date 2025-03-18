
import { MonoBehaviour, Collider, Object, Transform, Quaternion, GameObject, Vector3 } from "UnityEngine";
import { forEachChild } from "typescript";
import WoodPiece from "./WoodPiece";
export default class WoodBackpack extends MonoBehaviour {

    @SerializeField private backpack: Transform;
    @SerializeField slots: Transform[]; // = new Transform[20];
    
    private maxWood: int = 20;
    private woodAmount: int = 0;

    public static woodFull: bool;
    
    //Called when script instance is loaded
    private Awake() : void 
    {
        /*let children = this.backpack.GetComponentsInChildren<Transform>();

        for(let i = 0; i < 21; i++)
        {
            this.slots[i] = children[i];
        }*/
    }

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

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

    OnTriggerEnter(other: Collider) 
    {
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
    }
}
