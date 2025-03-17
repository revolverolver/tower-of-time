
import { MonoBehaviour, Transform, Input, Vector3, Mathf, Time, Animator, Collider, RuntimeAnimatorController, Quaternion, Collision, Rigidbody, Tree } from 'UnityEngine';

import { GeniesAvatar, GeniesAvatarsSdk } from 'Genies.Avatars.Sdk';
import GameManager, { GameState } from './GameManager';
import TreeObject from './TreeObject';

export default class PlayerController extends MonoBehaviour {
    
    @Header("Player Settings")
    @SerializeField private playerSpeed: float = 2;
    @SerializeField private playerAnimator: RuntimeAnimatorController;
    @SerializeField private cameraTarget: Transform;

    /** 
     * This can only be one of three lanes the player can target to move: 
     * * -1 is the left lane
     * * 0 is the middle lane
     * * 1 is the right lane
    */
   
    private userAvatar: GeniesAvatar;
    private gameManager: GameManager;

    private moveDirection: Vector3;

    private canMove: bool = false;

    async Start() {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
        //Initialize the SDK
        await GeniesAvatarsSdk.InitializeAsync();
        //Load the user Avatar
        this.userAvatar = await GeniesAvatarsSdk.LoadUserAvatarAsync("UserAvatar", this.transform, this.playerAnimator);
        //send message to GameManager that the Avatar has been loaded
        this.gameManager.ChangeGameState(GameState.GAME_PLAY);
    }

    /** Manages the player logic when the game state changes. @param newState */
    private CheckGameState(newState: GameState) {
        switch(newState) {
            case GameState.GAME_PLAY:
               this.OnGamePlay();
                break;
        }
    }

    /** This will manage the player once the game starts. */
    private OnGamePlay() {
        this.canMove = true;
        //this.transform.position = Vector3.zero;
        this.userAvatar.Animator.SetFloat("idle_run_walk", 0);
    }

    Update() {
        //If game is playing, move player according to joystick input
        if(this.canMove) {
            this.MovePlayer();
            this.RotatePlayer();
        }
    }
    
    public ChangeAnimatorState(state: float)
    {
        this.userAvatar.Animator.SetFloat("idle_run_walk", state);
    }

    /** Gets the direction of the joystick input */
    public GetJoystickInput(direction: Vector3, value: float)
    {
        if (value > 5)
        { 
            value = value * 0.012;
            this.moveDirection = Vector3.op_Multiply(direction.normalized, -value);
            this.userAvatar.Animator.speed = value * 0.75;
        }
        else
        {
            this.moveDirection = Vector3.zero;
            value = value * 0.012;
        }

        // Put Camera Look Target further away when moving faster
        value *= 0.9;
        let localTarget = new Vector3(0, 0, value * 0.6);
        this.cameraTarget.localPosition = Vector3.Lerp(this.cameraTarget.localPosition, localTarget, Time.deltaTime * 6);
    }
    
    /** Moves the player in the direction of the joystick */
    private MovePlayer() 
    {
        if (this.moveDirection == Vector3.zero)
            return;

        let speed = this.playerSpeed * Time.deltaTime;
        let translatedDirection = new Vector3(this.moveDirection.x * speed, 0, this.moveDirection.y * speed);
        this.transform.position = Vector3.op_Addition(this.transform.position, translatedDirection);
    }

    private RotatePlayer()
    {
        if (this.moveDirection == Vector3.zero)
            return;

        let translatedDirection = new Vector3(this.moveDirection.x, 0, this.moveDirection.y);
        let newRotation = Quaternion.LookRotation(translatedDirection, Vector3.up);

        this.transform.rotation = newRotation;
    }

    OnTriggerEnter(coll: Collider)
    {
        console.log(`log : Hello World`);

        if (coll.tag == "Tree")
        {
            const tree = coll.GetComponent<TreeObject>();
            tree.StartChopping();
        }
    }

    OnTriggerExit(coll: Collider)
    {
        if (coll.tag == "Tree")
            {
                const tree = coll.GetComponent<TreeObject>();
                tree.StopChopping();
            }
    }
}
