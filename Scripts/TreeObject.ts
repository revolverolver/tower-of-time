
import { Animator, GameObject, MonoBehaviour, Object, Quaternion, Time, Vector2, Vector3 } from "UnityEngine";
import { QualityMode } from "UnityEngine.LightProbeProxyVolume";
import WoodBackpack from './WoodBackpack';

export default class TreeObject extends MonoBehaviour {

    @SerializeField animator: Animator;
    @SerializeField wood: GameObject;

    private woodLeft: int = 5;
    private chopTime: float = 0.8;

    private isChopping: bool;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.animator.applyRootMotion = true;
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (this.isChopping)
        {
            if (this.chopTime > 0)
            {
                // Chopping
                this.chopTime -= Time.deltaTime;
            }
            else
            {
                // Chop once
                this.Chop();

                // Reset chopping
                this.chopTime = 0.8;
            }
        }
    }

    public StartChopping() : void
    {
        if (WoodBackpack.woodFull)
            return;

        this.isChopping = true;
        this.chopTime = 0.8;

        // Chop once
        this.Chop();
    }

    public StopChopping() : void
    {
        this.isChopping = false;
    }

    private Chop() : void
    {
        if (WoodBackpack.woodFull)
        {
            // Stop chopping if wood inventory is full
            this.StopChopping();
            return;
        }

        // Spawn Wood
        const woodChunk = Object.Instantiate(this.wood, this.transform.position + Vector3.up, Quaternion.identity);

        this.woodLeft--;

        // Play Animation
        this.animator.Play("Chop", -1, 0);

        if (this.woodLeft <= 0)
        {
            Object.Destroy(this.gameObject);
        }
    }
}
