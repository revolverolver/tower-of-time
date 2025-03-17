
import { MonoBehaviour, Vector3, Mathf, Time, Animator, Quaternion, Transform, Random } from "UnityEngine";
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

        this.animator.enabled = true;
        this.animator.Play("StartSpin", -1, 0);
    }

    private SpinPointers() : void
    {
        if (this.timeLeftSpinning > 0)
        {
            let longRand = Random.Range(0.8, 1.5);
            let longRotation = new Vector3(0, 0, this.spinSpeed * Time.deltaTime * longRand);
            this.pointerLong.Rotate(longRotation);

            let shortRand = Random.Range(0.8, 1.5);
            let shortRotation = new Vector3(0, 0, -this.spinSpeed * Time.deltaTime * shortRand);
            this.pointerShort.Rotate(shortRotation);

            if (this.timeLeftSpinning < 1)
            {
                this.spinSpeed -= 800 * Time.deltaTime;
            }

            this.timeLeftSpinning -= Time.deltaTime;
        }
        else
        {
            // Time is out and the clock finished spinning
            this.isSpinning = false;

            setTimeout(() => this.StartSpin(), 3000);
        }
    }
}
