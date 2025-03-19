
import { MonoBehaviour, AudioSource, Mathf, Time } from "UnityEngine";
import PlayerController from "./PlayerController";
export default class PlayerSounds extends MonoBehaviour {

    @SerializeField private constantSource: AudioSource;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        this.AdjustWalkingSound();
    }

    private AdjustWalkingSound() : void
    {
        let volume = (PlayerController.movement > 0.1) ? PlayerController.movement : 0;
        this.constantSource.volume = volume * 0.9;
        this.constantSource.pitch = volume;
    }
}
