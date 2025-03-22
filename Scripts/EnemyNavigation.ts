
import { GameObject, LayerMask, MonoBehaviour, Physics, Quaternion, Ray, RaycastHit, Rigidbody, Time, Transform, Vector2, Vector3 } from "UnityEngine";
import { NavMeshAgent } from "UnityEngine.AI";
import PlayerController from "./PlayerController";
import CameraMovement from "./CameraMovement";
export default class EnemyNavigation extends MonoBehaviour {

    @SerializeField rb: Rigidbody;

    private target: Transform;

    private speed: float = 1.8;
    private turnSpeed: float = 3.0;

    private layerMask: int = 1 << LayerMask.NameToLayer("CustomLayer6");

    private onWall: bool;
    private wallNormal: Vector3;
    private wallDirection: Vector3 = Vector3.zero;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.target = GameObject.FindGameObjectWithTag("Player").transform;
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private FixedUpdate() : void 
    {
        if (this.target != null)
        {
            this.WalkTowardsPlayer();
        }
    }

    private WalkTowardsPlayer() : void
    {
        // The direction to walk in
        let walkDirection = new Vector3(0, 0, 0);

        // Shoot ray towards player
        let playerDirection = Vector3.op_Subtraction(this.target.position, this.transform.position);
        let ray = new Ray(this.transform.position, playerDirection.normalized);
        let hit = $ref<RaycastHit>();

        // Is the ray hitting a nearby wall?
        if (Physics.Raycast(ray, hit, 1.0, this.layerMask))
        {
            if (!this.onWall)
            {
                // If so, change direction based on hit normal
                // I'm not sure what Cross does but it works 
                let cross = Vector3.Cross(playerDirection.normalized, hit.value.normal);

                // if cross.y > 0, player is on the enemies right, if cross.y < 0, he is on the left
                // Take the normal and rotate it 90 degrees to the left or right depending on where the player is
                let deg = (cross.y > 0) ? -90.0 : 90.0;
                let rot = Quaternion.Euler(0, deg, 0);
            
                // Set direction
                walkDirection = rot * hit.value.normal;

                // Remember wall
                this.wallNormal = hit.value.normal;
                this.wallDirection = walkDirection;
                this.onWall = true;
            }
            else if (this.onWall && hit.value.normal == this.wallNormal)
            {
                // Follow up the same wall
                walkDirection = new Vector3(this.wallDirection.x, this.wallDirection.y, this.wallDirection.z);
            }
            else if (this.onWall && hit.value.normal != this.wallNormal)
            {
                // Reset if you hit a new wall
                this.onWall = false;
            }
        }
        else
        {
            // Otherwise walk in player direction
            walkDirection = playerDirection.normalized;
            this.onWall = false;
        }

        // Turn to walk direction
        let look = Quaternion.LookRotation(walkDirection, Vector3.up);
        this.rb.MoveRotation(Quaternion.Lerp(this.transform.rotation, look, Time.deltaTime * 5));
        
        // Walk forward
        //this.rb.MovePosition(this.transform.forward * Time.fixedDeltaTime * this.speed);
        walkDirection = Vector3.op_Multiply(walkDirection, Time.fixedDeltaTime * this.speed);
        let finalPosition = Vector3.op_Addition(this.transform.position, walkDirection);

        this.rb.MovePosition(finalPosition);
    }
}
