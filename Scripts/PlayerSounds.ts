
import { MonoBehaviour, AudioSource, Mathf, Time, AudioClip, Random, Object, Physics, LayerMask, Vector3 } from "UnityEngine";
import PlayerController from "./PlayerController";
export default class PlayerSounds extends MonoBehaviour {

    @NonSerialized public static Instance: PlayerSounds;

    @SerializeField private constantSource: AudioSource;
    @SerializeField private quickSource: AudioSource;
    @SerializeField private enemySource: AudioSource;

    @SerializeField private quickClips: AudioClip[];

    private layerMask: int = 1 << LayerMask.NameToLayer("CustomLayer3"); 
    
    //Called when script instance is loaded
    private Awake() : void 
    {
        PlayerSounds.Instance = this;
        /*if(PlayerSounds.Instance == null) {
            PlayerSounds.Instance = this;
        }else{
            Object.Destroy(this.gameObject);
        }*/
    }

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        this.AdjustWalkingSound();
        this.AdjustEnemyVolume();
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

    private AdjustEnemyVolume()
    {
        // Find enemies within reach
        let colliders = Physics.OverlapSphere(this.transform.position, 5, this.layerMask);
        let dist = 10.0;

        if (colliders.length > 0)
        {
            let closest = 100.0;

            for(let i = 0; i < colliders.length; i++)
            {
                let distance = Vector3.Distance(colliders[i].transform.position, this.transform.position); // Vector3.op_Subtraction(colliders[i].transform.position, this.transform.position).magnitude;

                if (distance < closest)
                {
                    closest = distance;

                    dist = distance;
                    if (dist < 1)
                        dist = 1;
                }
            }
        }

        
        let maxVol = (colliders.length > 7) ? 0.2 : 0.1;

        // Adjust volume
        this.enemySource.volume = Mathf.Lerp(0.0, maxVol, (5 - dist) / 5);
        this.enemySource.pitch = 0.9 + (maxVol / 3.5);
    }
}
