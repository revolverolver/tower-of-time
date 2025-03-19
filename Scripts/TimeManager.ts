
import { TextMeshProUGUI } from "TMPro";
import { GameObject, MonoBehaviour, Time } from "UnityEngine";
export default class TimeManager extends MonoBehaviour {

    @SerializeField private inGameTimeText: TextMeshProUGUI;
    @SerializeField private roundTimeObject: GameObject;
    @SerializeField private roundTimeText: TextMeshProUGUI;

    private roundTimeLeft: float;
    
    private isCounting: bool;

    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
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
    }

    // --- Public Call stuff ---
    public StartCountdown(seconds: float) : void 
    {
        this.roundTimeObject.SetActive(false);

        this.roundTimeLeft = seconds;
        this.isCounting = true;
    }
}
