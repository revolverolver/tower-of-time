
import { TextMeshProUGUI } from "TMPro";
import { Animator, GameObject, MonoBehaviour, Time } from "UnityEngine";
import Tower from "./Tower";
import RoundManager from "./RoundManager";
import CameraMovement, {CameraState} from "./CameraMovement";
import EnemySpawner from "./EnemySpawner";
import EnemyNavigation from "./EnemyNavigation";
export default class TimeManager extends MonoBehaviour {

    @SerializeField private inGameTimeText: TextMeshProUGUI;
    @SerializeField private roundTimeObject: GameObject;
    @SerializeField private roundTimeText: TextMeshProUGUI;
    @SerializeField private roundObject: GameObject;
    @SerializeField private roundText: TextMeshProUGUI;
    @SerializeField private tapToSpin: GameObject;

    @SerializeField private animator: Animator;

    private gameManager: CameraMovement;

    private roundTimeLeft: float;
    
    public static isCounting: bool;

    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.gameManager = CameraMovement.Instance;
        this.inGameTimeText.text = "";

        TimeManager.isCounting = false;
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (TimeManager.isCounting)
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
            TimeManager.isCounting = false;
            this.inGameTimeText.text = "";

            // Pause spawning enemies
            EnemySpawner.isSpawning = false;
            // Stop walking
            EnemyNavigation.isWalking = false;

            // Kill all enemies if swarm round
            if (RoundManager.swarmRound)
            {
                RoundManager.swarmRound = false;
                EnemySpawner.killAll = true;
            }

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
        TimeManager.isCounting = true;
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
        this.tapToSpin.SetActive(true);

        // Play animation
        //this.animator.Play("Round Popup", -1, 0);
    }

    public HideTapToSpin() : void
    {
        this.tapToSpin.SetActive(false);
    }
}
