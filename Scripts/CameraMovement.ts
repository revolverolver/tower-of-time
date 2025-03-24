
import { MonoBehaviour, Object, Quaternion, Time, Transform, Vector2, Vector3 } from "UnityEngine";
import Tower from "./Tower";
import GameManager, { GameState } from "./GameManager";

export enum CameraState
{
    LOADING,
    START_PAN,
    PAN_TO_CLOCK_TOWER,
    FOLLOWING_PLAYER,
    CLOCK_TOWER,
    GAME_OVER
}

export default class CameraMovement extends MonoBehaviour {

    @NonSerialized public OnCameraStateChange: GeniesEvent<[CameraState]> = new GeniesEvent<[CameraState]>();
    /** This is an instance of the GameManager singleton. */
    @NonSerialized public static Instance: CameraMovement;
    
    @SerializeField private tower: Tower;
    @SerializeField private player: Transform;
    @SerializeField private lookTargetPlayer: Transform;
    @SerializeField private camPoints: Transform[];

    public static focusingOnPlayer: bool = false;

    private target: Transform;
    private rabbit: Vector3;

    private gameManager: GameManager;
    private cameraState: CameraState;

    private t: float = 0;

    //Called when script instance is loaded
    private Awake() : void {
        CameraMovement.Instance = this;
        /*if(CameraMovement.Instance == null) {
            CameraMovement.Instance = this;
        }else{
            Object.Destroy(this.gameObject);
        }*/
    }

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);

        this.cameraState = CameraState.LOADING;
        this.target = this.player;

        CameraMovement.focusingOnPlayer = false;

        // Start position
        this.transform.position = this.camPoints[0].position;
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private FixedUpdate() : void 
    {
        if (this.cameraState == CameraState.LOADING || this.cameraState == CameraState.CLOCK_TOWER)
            return;

        if (this.cameraState == CameraState.FOLLOWING_PLAYER)
        {
            this.FollowPlayer();
        }
        else if (this.cameraState == CameraState.PAN_TO_CLOCK_TOWER)
        {
            this.GoToClockTower();
        }
        else if (this.cameraState == CameraState.START_PAN)
        {
            this.Panning();
        }
    }

    private FollowPlayer() : void
    {
        let offsetPosition = new Vector3(this.target.position.x, 6.5, this.target.position.z - 5.5);
        this.transform.position = Vector3.Lerp(this.transform.position, offsetPosition, Time.fixedDeltaTime * 12);

        // Look at target
        let lookOffset = Vector3.op_Addition(this.lookTargetPlayer.position, Vector3.back);
        let dir = Vector3.op_Subtraction(this.transform.position, lookOffset);
        let look = Quaternion.LookRotation(-dir, Vector3.up);
        this.transform.rotation = Quaternion.Lerp(this.transform.rotation, look, Time.fixedDeltaTime * 7);
    } 

    private Panning() : void
    {
        this.rabbit = Vector3.Lerp(this.camPoints[0].position, this.camPoints[1].position, this.t);
        this.transform.rotation = Quaternion.Lerp(this.camPoints[0].rotation, this.camPoints[1].rotation, this.t);
        this.t += Time.deltaTime * 0.25;

        // Move camera
        this.transform.position = Vector3.Lerp(this.transform.position, this.rabbit, Time.deltaTime * 6);

        if (this.t > 1.5)
        {
            // Tell Tower to do stuff
            this.tower.NewRound();
            this.cameraState = CameraState.CLOCK_TOWER;
        }
    }

    private GoToClockTower() : void
    {
        this.rabbit = Vector3.Lerp(this.target.position, this.camPoints[1].position, this.t);
        this.transform.rotation = Quaternion.Lerp(this.camPoints[0].rotation, this.camPoints[1].rotation, this.t);
        this.t += Time.deltaTime * 1;

        // Move camera
        this.transform.position = Vector3.Lerp(this.transform.position, this.rabbit, Time.deltaTime * 6);

        if (this.t > 2.0)
        {
            // Tell Tower to do stuff
            this.tower.NewRound();
            this.cameraState = CameraState.CLOCK_TOWER;
        }
    }

    private CheckGameState(newState: GameState) {
        switch(newState) {
            case GameState.LOADING:
                this.cameraState = CameraState.LOADING;
                break;
            case GameState.GAME_PLAY:
                this.cameraState = CameraState.START_PAN;
                break;
            case GameState.GAME_OVER:
                
                break;
        }

        // Update state change for other scripts
        this.OnCameraStateChange.trigger(this.cameraState);
    }

    public ChangeCameraState(newState: CameraState) : void
    {
        this.cameraState = newState;
        this.OnCameraStateChange.trigger(newState);

        if (newState == CameraState.PAN_TO_CLOCK_TOWER)
        {
            this.t = 0;
        }

        if (newState == CameraState.FOLLOWING_PLAYER)
            CameraMovement.focusingOnPlayer = true;
        else
            CameraMovement.focusingOnPlayer = false;
    }
}
