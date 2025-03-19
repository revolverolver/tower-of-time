
import { MonoBehaviour, Quaternion, Time, Transform, Vector2, Vector3 } from "UnityEngine";
import Tower from "./Tower";

enum CameraState
{
    START_PAN,
    FOLLOWING_PLAYER,
    CLOCK_TOWER
}

export default class CameraMovement extends MonoBehaviour {
    
    @SerializeField private tower: Tower;
    @SerializeField private player: Transform;
    @SerializeField private lookTargetPlayer: Transform;
    @SerializeField private camPoints: Transform[];

    private target: Transform;

    private cameraState: CameraState;

    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.cameraState = CameraState.START_PAN;
        this.target = this.player;
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (this.cameraState == CameraState.FOLLOWING_PLAYER)
        {
            this.FollowPlayer();
        }
        else if (this.cameraState == CameraState.CLOCK_TOWER)
        {

        }
        else if (this.cameraState == CameraState.START_PAN)
        {

        }
    }

    private FollowPlayer() : void
    {
        let offsetPosition = new Vector3(this.target.position.x, 6.5, this.target.position.z - 5.5);
        this.transform.position = Vector3.Lerp(this.transform.position, offsetPosition, Time.deltaTime * 12);

        // Look at target
        let lookOffset = Vector3.op_Addition(this.lookTargetPlayer.position, Vector3.back);
        let dir = Vector3.op_Subtraction(this.transform.position, lookOffset);
        let look = Quaternion.LookRotation(-dir, Vector3.up);
        this.transform.rotation = Quaternion.Lerp(this.transform.rotation, look, Time.deltaTime * 7);
    } 

    private Panning() : void
    {
        
    }
}
