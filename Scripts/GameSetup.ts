
import { GameObject, MonoBehaviour, Object, Transform } from "UnityEngine";
import EnemyNavigation from "./EnemyNavigation";
export default class GameSetup extends MonoBehaviour {

    @SerializeField private worldCanvas: Transform;

    // Objects
    @SerializeField private trees: GameObject; 
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.SetupStuff();
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    private SetupStuff() : void
    {
        EnemyNavigation.isWalking = false;
        //Object.Instantiate(this.trees, this.worldCanvas);
    }

    public RestartEverything() : void
    {
        // Destroy stuff
        // Enemies, Trees, Turrets, 


        // Reload stuff


        // Reset static values


        // Reset other values


        // Reset positions

    }
}
