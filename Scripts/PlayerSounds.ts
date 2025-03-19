
import { MonoBehaviour, AudioSource, Mathf, Time, AudioClip, Random, Object } from "UnityEngine";
import PlayerController from "./PlayerController";
export default class PlayerSounds extends MonoBehaviour {

    @NonSerialized public static Instance: PlayerSounds;

    @SerializeField private constantSource: AudioSource;
    @SerializeField private quickSource: AudioSource;

    @SerializeField private quickClips: AudioClip[];
    
    //Called when script instance is loaded
    private Awake() : void 
    {
        if(PlayerSounds.Instance == null) {
            PlayerSounds.Instance = this;
        }else{
            Object.Destroy(this.gameObject);
        }
    }

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

    public PlayQuickSound(clip: int, vol: float = 1.0, pitch: float = 1.0) : void
    {
        this.quickSource.clip = this.quickClips[clip];
        
        let r = pitch + Random.Range(-0.2, 0.1);
        this.quickSource.pitch = r;
        this.quickSource.volume = vol;

        this.quickSource.Play();
    }
}
