
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
    private Start() : void 
    {
        Upgrades.walkSpeed = 1.0;
        Upgrades.chopSpeed = 1.0;
        Upgrades.woodCapacity = 20;
        Upgrades.carryStrength = 1.0;
        Upgrades.reGrowthTime = 180;
        Upgrades.turretDamage = 10;
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}
}
