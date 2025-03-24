
import { Animator, MonoBehaviour, Transform, Vector3 } from "UnityEngine";
import EnemyNavigation from "./EnemyNavigation";
import TimeManager from "./TimeManager";
import EnemySpawner from "./EnemySpawner";
import PlayerController from "./PlayerController";
import CameraMovement, {CameraState} from "./CameraMovement";
export default class PlayerHealth extends MonoBehaviour {

    @SerializeField private playerController: PlayerController;
    @SerializeField private healthBar: Transform;
    @SerializeField private damageIndicatorAnimator: Animator;

    private gameManager: CameraMovement;

    public static isAlive: bool = true;

    private health: int = 10;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.gameManager = CameraMovement.Instance;
        PlayerHealth.isAlive = true;
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    public ReceiveDamage(damage: int) : void
    {
        if (this.health <= 0)
            return;

        this.health -= damage;

        // Update health bar
        let x = this.health / 10;
        this.healthBar.localScale = new Vector3(x, 1, 1);

        // Play damage animation
        //this.animator.enabled = true;
        this.damageIndicatorAnimator.Play("Damaged", -1, 0);

        if (this.health <= 0)
        {
            // Died and game over
            this.DieAndStopGame();
        }
    }

    private DieAndStopGame() : void 
    {
        // Stop stuff
        EnemyNavigation.isWalking = false;
        TimeManager.isCounting = false;
        EnemySpawner.isSpawning = false;
        PlayerHealth.isAlive = false;

        // Play fall animation
        this.playerController.GameOver();

        // Show game over
        this.gameManager.ChangeCameraState(CameraState.GAME_OVER);
    }
}
