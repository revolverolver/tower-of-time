
import { TextMeshProUGUI } from "TMPro";
import { Animator, GameObject, MonoBehaviour, Time } from "UnityEngine";
import Tower from "./Tower";
import RoundManager from "./RoundManager";
import CameraMovement, {CameraState} from "./CameraMovement";
export default class TimeManager extends MonoBehaviour {

    @SerializeField private inGameTimeText: TextMeshProUGUI;
    @SerializeField private roundTimeObject: GameObject;
    @SerializeField private roundTimeText: TextMeshProUGUI;
    @SerializeField private roundObject: GameObject;
    @SerializeField private roundText: TextMeshProUGUI;

    @SerializeField private animator: Animator;

    private gameManager: CameraMovement;

    private roundTimeLeft: float;
    
    private isCounting: bool;

    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.gameManager = CameraMovement.Instance;
        this.inGameTimeText.text = "";
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (this.isCounting)
        {
            this.CountDownRound();
        }
    }

    private CountDownRound() : void 
    {
        this.roundTimeLeft -= Time.deltaTime;

        let minutes = Math.floor(this.roundTimeLeft / 60.0);
        let seconds = Math.round(this.roundTimeLeft - (minutes * 60.0));

        let secString = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();

        let finalTime = minutes.toString() + ":" + secString;
        this.inGameTimeText.text = finalTime;

        // When count is over
        if (this.roundTimeLeft < 0.1)
        {
            this.isCounting = false;
            this.inGameTimeText.text = "";

            // Change game state
            this.gameManager.ChangeCameraState(CameraState.PAN_TO_CLOCK_TOWER);
        }
    }

    // --- Public Call stuff ---
    public StartCountdown(degrees: float) : void 
    {
        this.roundTimeObject.SetActive(false);
        this.roundObject.SetActive(false);

        let sec = Math.ceil(degrees / 60);
        let roundTime = sec * 10;

        this.roundTimeLeft = roundTime;
        this.isCounting = true;
    }

    public ShowRoundTime(degrees: float) : void
    {
        // Convert euler angles to time
        //let division = (RoundManager.round == 1) ? 30 : 60;
        let sec = Math.ceil(degrees / 60);
        let roundTime = sec * 10;

        // Show text
        this.roundTimeText.text = roundTime.toString() + " seconds";
        this.roundTimeObject.SetActive(true);

        // Play animation
        //this.animator.Play("Round Time Popup", -1, 0);
    }

    public ShowRound(round: int) : void
    {
        this.roundText.text = round.toString();
        this.roundObject.SetActive(true);

        // Play animation
        //this.animator.Play("Round Popup", -1, 0);
    }
}
