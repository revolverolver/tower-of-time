
import { Enum } from "System";
import { MonoBehaviour, Vector3, Mathf, Time, Animator, Quaternion, Transform, Random, Input } from "UnityEngine";
import RoundManager from "./RoundManager";

enum ClockState {
    TAP_TO_SPIN,
    TAP_TO_STOP,
    NOT_INTERACTABLE
}

export default class Tower extends MonoBehaviour {

    @SerializeField private pointerLong: Transform;
    @SerializeField private pointerShort: Transform;
    @SerializeField private animator: Animator;

    private isSpinning: bool;

    private timeLeftSpinning: float;
    private spinSpeed: float;

    private state: ClockState;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.state = ClockState.NOT_INTERACTABLE;
        //setTimeout(() => this.StartSpin(), 6500);
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        // Touch events
        if (this.state == ClockState.TAP_TO_SPIN && Input.GetMouseButtonDown(0))
        {
            this.StartSpin();
        }
        else if (this.state == ClockState.TAP_TO_STOP && Input.GetMouseButtonDown(0))
        {
            this.StopSpin();
        }

        // Spin pointer if spinning
        if (this.isSpinning)
        {
            this.SpinPointer();
        }
    }

    public StartSpin() : void
    {
        // Start timer
        this.isSpinning = true;
        this.timeLeftSpinning = 3.0;
        this.spinSpeed = 1000.0;

        // Play animation
        this.animator.enabled = true;
        this.animator.Play("StartSpin", -1, 0);
    }

    private StopSpin() : void
    {

    }

    private SpinPointer() : void
    {
        if (this.isSpinning)
        {
            let longRotation = new Vector3(0, 0, this.spinSpeed * Time.deltaTime);
            this.pointerLong.Rotate(longRotation);
        }
    }

    // --- Moving the short pointer ---
    public NewRound() : void 
    {
        // Increase round number
        let round = RoundManager.round;
        round++;

        // Move pointer one step
        let deg = 30.0;
        let eulerRot = new Vector3(0, 0, deg);
        this.pointerShort.Rotate(eulerRot);

        // Play "tap to spin" animation, the animation will change clock state
        this.animator.Play("TapToSpin", -1, 0);
    }

    public ChangeState(newState: ClockState) : void
    {
        this.state = newState;
    }
}
