import { Coroutine, GameObject, MonoBehaviour, WaitForSeconds } from "UnityEngine";
import { CloudSaveStorage } from "Genies.Experience.CloudSave";
import { Button } from "UnityEngine.UI";
import { TMP_Text } from "TMPro";
import GameManager, { GameState } from "./GameManager";
import CameraMovement, { CameraState } from "./CameraMovement";

export default class CanvasController extends MonoBehaviour {
    
    @Header("UI Object References")
    @SerializeField private gameOverPanel: GameObject;
    @SerializeField private replayButton: Button;
    @SerializeField private loadingPanel: GameObject;
    @SerializeField private scorePanel: GameObject;
    @SerializeField private mainMenuPanel: GameObject;
    @SerializeField private roundOverPanel: GameObject;
    @SerializeField private scoreText: TMP_Text;
    @SerializeField private personalHighScoreText: TMP_Text;
    @SerializeField private globalHighScoreText: TMP_Text;

    private score: float = 0;

    private personalStorageKey: string = "PersonalStorageKey";
    private globalStorageKey: string = "GlobalStorageKey";
    private floatHighScoreKey: string = "FloatHighScoreKey";

    private personalString: string = "Personal Best: ";
    private globalString: string = "Global Best: ";

    private personalStorage: CloudSaveStorage;
    private globalStorage: CloudSaveStorage;

    private gameManager: CameraMovement;

    /** This coroutine will increase and update the score over time. */
    private coroutine: Coroutine;

    Start() {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = CameraMovement.Instance;
        this.gameManager.OnCameraStateChange.addListener(this.CheckGameState);

        //Add a listener to the ReplayButton click event
        //this.replayButton.onClick.AddListener(this.OnReplay);
        //Initialize both high scores
        this.InitializeHighScores();
    }

    /** Manages the enemy logic when the game state changes. @param newState */
    private CheckGameState(newState: CameraState) {
        console.log(newState);

        switch(newState) {
            case CameraState.LOADING:
                this.OnLoading();
                break;
            case CameraState.MAIN_MENU:
                this.OnMainMenu();
                break;
            case CameraState.START_PAN:
                this.OnClockWatching();
                break;
            case CameraState.PAN_TO_CLOCK_TOWER:
                this.OnClockWatching();
                break;
            case CameraState.FOLLOWING_PLAYER:
                this.OnGamePlay();
                break;
            case CameraState.ROUND_OVER:
                this.OnRoundOver();
                break;
            case CameraState.GAME_OVER:
                this.OnGameOver();
                break;
        }
    }

    /** This will manage the canvas once the Avatar is loading. */
    private OnLoading() {
        this.scorePanel.SetActive(false);
        this.gameOverPanel.SetActive(false);
        this.loadingPanel.SetActive(true);
        this.roundOverPanel.SetActive(false);
    }

    private OnMainMenu()
    {
        this.scorePanel.SetActive(false);
        this.gameOverPanel.SetActive(false);
        this.loadingPanel.SetActive(false);
        this.mainMenuPanel.SetActive(true);
    }

    private OnClockWatching() {
        this.scorePanel.SetActive(false);
        this.gameOverPanel.SetActive(false);
        this.loadingPanel.SetActive(false);
        this.mainMenuPanel.SetActive(false);
        this.roundOverPanel.SetActive(false);
    }

    private OnRoundOver() {
        this.scorePanel.SetActive(false);
        this.roundOverPanel.SetActive(true);
    }

    /** This will manage the canvas once the game starts. */
    private OnGamePlay() {
        this.scorePanel.SetActive(true);
        this.gameOverPanel.SetActive(false);
        this.loadingPanel.SetActive(false);
        this.roundOverPanel.SetActive(false);
        //this.score = 0;
        //this.coroutine = this.StartCoroutine(this.StartScore());
    }

    /** This will manage the canvas once the game ends. */
    private OnGameOver() {
        this.gameOverPanel.SetActive(true);
        this.loadingPanel.SetActive(false);
        this.roundOverPanel.SetActive(false);
        //this.CheckHighScore(this.personalStorage, this.personalHighScoreText, this.personalString);
        //this.CheckHighScore(this.globalStorage, this.globalHighScoreText, this.globalString);
        if(this.coroutine) {
            this.StopCoroutine(this.coroutine);
        }
    }

    /** Set the game state back to replay the game. */
    private OnReplay() {
        //this.gameManager.ChangeGameState(GameState.GAME_PLAY);
    }

    /** Initialize and load both the personal and global high scores. */
    private InitializeHighScores() {
        //Initialize Personal High Score
        this.personalStorage = new CloudSaveStorage(this.personalStorageKey, false);
        this.LoadHighScore(this.personalStorage, this.personalHighScoreText, this.personalString);
        //Initialize Global High Score
        this.globalStorage = new CloudSaveStorage(this.globalStorageKey, true);
        this.LoadHighScore(this.globalStorage, this.globalHighScoreText, this.globalString);
    }

    /** This coroutine will increase and update the score every hundredths of a second. */
    private *StartScore() {
        while(true) {
            this.score += 1;
            this.scoreText.text = "Score " + this.score;
            yield new WaitForSeconds(0.01);
        }
    }

    /**
     * This loads a high score from storage and then displays it to a text object.
     * * It will also create a new stored high score if it does not find a stored one.
     * @param storage the CloudSaveStorage to load from
     * @param textObj  the text object to change the text
     * @param highScoreString the leading string to prepend to the text
     */
    private async LoadHighScore(storage: CloudSaveStorage, textObj: TMP_Text, highScoreString: string) {
        await storage.Load();
        if (storage.Has(this.floatHighScoreKey)) {
            let highScore = storage.GetFloat(this.floatHighScoreKey);
            textObj.text = highScoreString + highScore.toString();
        }else{
            storage.SetFloat(this.floatHighScoreKey, 0);
            textObj.text = highScoreString + "0";
            await storage.Save();
        }
    }

    /**
     * This checks if a stored high score is less than the current score.
     * * If it is, then the high score is updated in storage and text.
     * @param storage the CloudSaveStorage storing the high score
     * @param textObj the high score text object
     * @param highScoreString the leading string to prepend to the text
     */
    private async CheckHighScore(storage: CloudSaveStorage, textObj: TMP_Text, highScoreString: string) {
        await storage.Load();
        if (storage.Has(this.floatHighScoreKey)) {
            let highScore = storage.GetFloat(this.floatHighScoreKey);
            if(this.score > highScore) {
                storage.SetFloat(this.floatHighScoreKey, this.score);
                textObj.text = highScoreString + this.score.toString();
                await storage.Save();
            }
        }
    }
}