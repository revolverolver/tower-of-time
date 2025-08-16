
import { MonoBehaviour } from "UnityEngine";

export default class Upgrades extends MonoBehaviour {

    public static walkSpeed: float = 1.0;
    public static chopSpeed: float = 1.0;
    public static woodCapacity: int = 20;
    public static carryStrength: float = 1.0;
    public static reGrowthTime: float = 180;
    public static turretDamage: int = 10;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}
}
