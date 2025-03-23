
import { MonoBehaviour, Transform, Input, Vector3, Mathf, Time, Animator, Collider, RuntimeAnimatorController } from 'UnityEngine';

import { GeniesAvatar, GeniesAvatarsSdk } from 'Genies.Avatars.Sdk';
import { Direction } from 'UnityEngine.UI.Scrollbar';
import PlayerController from './PlayerController';
import CameraMovement, {CameraState} from './CameraMovement';
import PlayerHealth from './PlayerHealth';

export default class JoystickControls extends MonoBehaviour {
    
    @SerializeField base: Transform;
    @SerializeField handle: Transform;
    @SerializeField playerController: PlayerController;

    private gameManager: CameraMovement;

    private baseIdlePosition: Vector3;
    private touchStartPosition: Vector3;

    touching : bool = false;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.gameManager = CameraMovement.Instance;
        this.baseIdlePosition = this.base.position;

        this.gameManager.OnCameraStateChange.addListener(this.CheckGameState);
    }

    private CheckGameState(newState: CameraState) {
        switch(newState) {
            case CameraState.PAN_TO_CLOCK_TOWER:
                this.Nullify();
                break;
        }
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (!PlayerHealth.isAlive)
            return;

        // Start Touch
        if (Input.GetMouseButtonDown(0))
        {
            this.touchStartPosition = Input.mousePosition;
            this.base.position = this.touchStartPosition;

            this.touching = true;

            // Animate Running
            this.playerController.ChangeAnimatorState(1);
        }

        // Holding Touch
        if (Input.GetMouseButton(0))
        {
            // Position handle based on direction and distance from the base
            let direction = Vector3.op_Subtraction(this.base.position, Input.mousePosition);
            let distance = Vector3.Distance(this.base.position, Input.mousePosition);
            
            if (distance < 100)
            {
                // Handle is within base
                this.handle.position = Input.mousePosition;
            }
            else
            {
                // Handle is at max distance
                this.handle.position = this.base.position - direction.normalized * 100;
                distance = 100;
            }

            // Send Input data to player controller
            this.playerController.GetJoystickInput(direction, distance);
        }

        // Touch Released
        if (Input.GetMouseButtonUp(0))
        {
            this.base.position = this.baseIdlePosition;
            this.handle.position = this.base.position;

            this.touching = false;

            // Animate Idle
            this.playerController.ChangeAnimatorState(0);
        }

        if (this.touching == false)
        {
            // No input from the joystick when not touching the screen
            this.playerController.GetJoystickInput(Vector3.zero, 0);
        }
    }

    private Nullify() : void
    {
        this.base.position = this.baseIdlePosition;
        this.handle.position = this.base.position;

        this.touching = false;

        PlayerController.movement = 0;

        // Animate Idle
        this.playerController.ChangeAnimatorState(0);
    }
}
