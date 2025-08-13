
import { MonoBehaviour, Transform, Input, Vector3, Mathf, Time, Animator, Collider, RuntimeAnimatorController, Quaternion, Collision, Rigidbody, Tree } from 'UnityEngine';

import { GeniesAvatar, GeniesAvatarsSdk } from 'Genies.Avatars.Sdk';
import GameManager, { GameState } from './GameManager';
import TreeObject from './TreeObject';
import WoodBackpack from './WoodBackpack';
import CameraMovement, { CameraState } from './CameraMovement';
import PlayerHealth from './PlayerHealth';

export default class PlayerController extends MonoBehaviour {
    
    @Header("Player Settings")
    @SerializeField private playerSpeed: float = 2;
    @SerializeField private playerAnimator: RuntimeAnimatorController;
    @SerializeField private cameraTarget: Transform;
    @SerializeField private rb: Rigidbody;

    private userAvatar: GeniesAvatar;
    private gameManager: CameraMovement;

    private moveDirection: Vector3;

    public static movement: float;

    private canMove: bool = false;

    async Start() {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = CameraMovement.Instance;
        this.gameManager.OnCameraStateChange.addListener(this.CheckGameState);
        //Initialize the SDK
        await GeniesAvatarsSdk.InitializeAsync();
        //Load the user Avatar
        this.userAvatar = await GeniesAvatarsSdk.LoadUserAvatarAsync("UserAvatar", this.transform, this.playerAnimator);
        //send message to GameManager that the Avatar has been loaded
        this.gameManager.ChangeCameraState(CameraState.MAIN_MENU);

        PlayerController.movement = 0;
    }

    /** Manages the player logic when the game state changes. @param newState */
    private CheckGameState(newState: CameraState) {
        switch(newState) {
            case CameraState.FOLLOWING_PLAYER:
               this.OnGamePlay();
                break;
            default:
                this.canMove = false;
                break;
        }
    }

    /** This will manage the player once the game starts. */
    private OnGamePlay() {
        this.canMove = true;
        //this.transform.position = Vector3.zero;
        this.userAvatar.Animator.SetFloat("idle_run_walk", 0);
    }

    FixedUpdate() {
        //If game is playing, move player according to joystick input
        if(this.canMove) {
            this.MovePlayer();
            this.RotatePlayer();
        }
        else
        {
            this.rb.velocity = Vector3.zero;
        }
    }
    
    public ChangeAnimatorState(state: float)
    {
        this.userAvatar.Animator.SetFloat("idle_run_walk", state);
    }

    public GameOver() : void
    {
        this.canMove = false;
        this.userAvatar.Animator.speed = 1;
        this.userAvatar.Animator.SetFloat("idle_run_walk", 0);
        this.userAvatar.Animator.SetTrigger("slip");
    }

    /** Gets the direction of the joystick input */
    public GetJoystickInput(direction: Vector3, value: float)
    {
        if (!PlayerHealth.isAlive)
            return;

        if (value > 5)
        { 
            value = value * 0.012;

            // Change value based on weight
            let weight = (WoodBackpack.woodAmount / 20) * 0.45;
            value -= weight;

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

        // Public Movement speed
        value *= 0.9;
        PlayerController.movement = value; 
    }
    
    /** Moves the player in the direction of the joystick */
    private MovePlayer() 
    {
        if (this.moveDirection == Vector3.zero)
            return;

        let speed = this.playerSpeed * Time.fixedDeltaTime;
        let translatedDirection = new Vector3(this.moveDirection.x * speed, 0, this.moveDirection.y * speed);
        this.rb.MovePosition(Vector3.op_Addition(this.transform.position, translatedDirection));
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
        //console.log(`log : Hello World`);

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
