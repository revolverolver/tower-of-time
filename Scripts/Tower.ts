
import { MonoBehaviour, Vector3, Mathf, Time, Animator, Quaternion, Transform } from "UnityEngine";
export default class Tower extends MonoBehaviour {

    @SerializeField private pointerLong: Transform;
    @SerializeField private pointerShort: Transform;
    @SerializeField private animator: Animator;

    private isSpinning: bool;

    private timeLeftSpinning: float;
    private spinSpeed: float;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        setTimeout(() => this.StartSpin(), 6500);
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (this.isSpinning)
        {
            this.SpinPointers();
        }
    }

    private StartSpin() : void
    {
        // Start timer
        this.isSpinning = true;
        this.timeLeftSpinning = 3.0;
        this.spinSpeed = 1000.0;
    }

    private SpinPointers() : void
    {
        if (this.timeLeftSpinning > 0)
        {
            let longRotation = new Vector3(0, 0, this.spinSpeed * Time.deltaTime);
            this.pointerLong.Rotate(longRotation);

            let shortRotation = new Vector3(0, 0, -this.spinSpeed * Time.deltaTime * 0.8);
            this.pointerShort.Rotate(shortRotation);

            if (this.timeLeftSpinning < 0.75)
            {
                this.spinSpeed -= 1000 * Time.deltaTime;
            }

            this.timeLeftSpinning -= Time.deltaTime;
        }
    }
}
