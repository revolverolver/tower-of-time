
import { TextMeshProUGUI } from "TMPro";
import { GameObject, MonoBehaviour } from "UnityEngine";
import RoundManager from "./RoundManager";
import { SceneManager } from "UnityEngine.SceneManagement";
import { Button } from "UnityEngine.UI";
import { CloudSaveStorage } from "Genies.Experience.CloudSave";
import GameSetup from "./GameSetup";
import EnemySpawner from "./EnemySpawner";
import Turret from "./Turret";
export default class GameOverManager extends MonoBehaviour {

    @SerializeField restartButton: Button;
    @SerializeField loadingPanel: GameObject;
    @SerializeField setupManager: GameSetup;
    @SerializeField roundsSurvivedText: TextMeshProUGUI;
    @SerializeField yourBestText: TextMeshProUGUI;

    @SerializeField spawner: EnemySpawner;
    @SerializeField turrets: Turret[];

    private personalStorageKey: string = "PersonalStorageKey";
    private globalStorageKey: string = "GlobalStorageKey";
    private floatHighScoreKey: string = "FloatHighScoreKey";

    private personalString: string = "Personal Best: ";
    private globalString: string = "Global Best: ";

    private personalStorage: CloudSaveStorage;
    private globalStorage: CloudSaveStorage;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.restartButton.onClick.AddListener(this.PlayAgain);
    }

    private OnEnable() 
    {
        this.SetupScores();
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    private SetupScores() : void
    {
        // You survived this many rounds
        this.roundsSurvivedText.text = RoundManager.round.toString();

        // Your best score
    }

    private PlayAgain()
    {
        // Show loading screen
        console.log(`PLAY AGAIN`);

        // Stop coroutines
        this.spawner.GameOver();

        for (let i = 0; i < this.turrets.length; i++)
        {
            this.turrets[i].GameOver();
        }

        SceneManager.LoadScene("Game");

        // Restart Everything
        //this.setupManager.RestartEverything();
    }
}
