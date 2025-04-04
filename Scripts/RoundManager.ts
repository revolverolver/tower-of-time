
import { MonoBehaviour } from "UnityEngine";
export default class RoundManager extends MonoBehaviour {

    public static round: int = 0;
    public static swarmRound: bool = false;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        RoundManager.round = 0;
        RoundManager.swarmRound = false;
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}
}
