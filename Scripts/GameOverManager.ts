
import { TextMeshProUGUI } from "TMPro";
import { GameObject, MonoBehaviour } from "UnityEngine";
import RoundManager from "./RoundManager";
import { SceneManager } from "UnityEngine.SceneManagement";
import { Button } from "UnityEngine.UI";
import { CloudSaveStorage } from "Genies.Experience.CloudSave";
import GameSetup from "./GameSetup";
import EnemySpawner from "./EnemySpawner";
import Turret from "./Turret";
import UpgradeMenu from "./UpgradeMenu";
import GameManager from "./GameManager";
import CameraMovement from "./CameraMovement";
import PlayerSounds from "./PlayerSounds";
export default class GameOverManager extends MonoBehaviour {

    @SerializeField restartButton: Button;
    @SerializeField loadingPanel: GameObject;
    @SerializeField setupManager: GameSetup;
    @SerializeField roundsSurvivedText: TextMeshProUGUI;
    @SerializeField yourBestText: TextMeshProUGUI;

    @SerializeField playerRoot: GameObject;

    @SerializeField spawner: EnemySpawner;
    @SerializeField turrets: Turret[];
    
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
        this.GetSetBestScore();
    }

    async GetSetBestScore()
    {
        let storage: CloudSaveStorage = new CloudSaveStorage("ScoreStorage");
        let bestKey = "BestScore";

        await this.EstablishScoreData(storage, bestKey, 0);

        // Get best score from cloud save
        let bestScore = storage.GetInt(bestKey);

        // Check if the best score if beaten
        if (RoundManager.round > bestScore)
        {
            // Save new best score
            bestScore = RoundManager.round;
            await storage.Load();
            await storage.SetInt(bestKey, bestScore);
            await storage.Save();
        }

        // Set best score Text
        this.yourBestText.text = bestScore.toString();
    }

    private async EstablishScoreData(storage: CloudSaveStorage, scoreKey: string, defaultValue: int) {
        //Load data from storage
        await storage.Load();
        //Check if key exists in data
        if (storage.Has(scoreKey)) {
            //Get key value from data
            let score: int =  storage.GetInt(scoreKey);
            console.log("Storage of " + scoreKey + " has a value of " + score.toString());
        }else{
            console.log("Storage of " + scoreKey + " does not have a value yet");
            //Set initial key value
            storage.SetInt(scoreKey, defaultValue);
            //Save data to storage
            await storage.Save();
            console.log("Storage of " + scoreKey + " now has a value of " + defaultValue);
        }
    }

    private PlayAgain()
    {
        // Show loading screen
        console.log(`PLAY AGAIN`);

        // Remove Instances
        //UpgradeMenu.Instance.DestroyInstance();
        //GameManager.Instance.DestroyInstance();
        //CameraMovement.Instance.DestroyInstance();
        //PlayerSounds.Instance.DestroyInstance();

        SceneManager.LoadScene(SceneManager.GetActiveScene().name);

        // Restart Everything
        //this.setupManager.RestartEverything();
    }
}
