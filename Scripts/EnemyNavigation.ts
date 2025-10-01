
import { Color, Debug, GameObject, LayerMask, MonoBehaviour, Physics, Quaternion, Ray, RaycastHit, Rigidbody, Time, Transform, Vector3 } from "UnityEngine";
import RoundManager from "./RoundManager";
import Turret from "./Turret";
import EnemySpawner from "./EnemySpawner";

export default class EnemyNavigation extends MonoBehaviour {

    // public Rigidbody rb;
    @SerializeField rb: Rigidbody;

    @SerializeField public turrets: Turret[];

    // private Transform target;
    private target: Transform;

    private speed: float = 1.5;
    public walkSpeed: float;
    @SerializeField private fastEnemy: bool = false;
    private rayTime: float = 0.0;

    private layerMask: int = 1 << LayerMask.NameToLayer("CustomLayer6");

    private onWall: bool;
    private wallNormal: Vector3;
    private wallDirection: Vector3 = Vector3.zero;
    private direction: Vector3 = Vector3.zero;

    public static isWalking: bool;
    //Debug.DrawRay(this.transform.position, playerDirection.normalized, Color.white);

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.target = GameObject.FindGameObjectWithTag("Player").transform;
        this.turrets = GameObject.FindGameObjectWithTag("Spawner").GetComponent<EnemySpawner>().turrets;

        //console.log(this.turrets.length);
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private FixedUpdate() : void 
    {
        if (this.target != null && EnemyNavigation.isWalking)
        {
            this.WalkTowardsPlayer();
        }

        this.CheckTurretRanges();
    }

    private WalkTowardsPlayer() : void
    {
        // The direction to walk in
        let walkDirection = new Vector3(0, 0, 0);

        // Shoot ray towards player
        let playerDirection = Vector3.op_Subtraction(this.target.position, this.transform.position);
        //let playerDirection = this.target.position - this.transform.position;
        let ray = new Ray(this.transform.position, playerDirection.normalized);
        let hit = $ref<RaycastHit>();

        let rayDistance = (this.onWall) ? 2.0 : 1.0;
        //Debug.DrawRay(this.transform.position, Vector3.op_Multiply(playerDirection.normalized, rayDistance), Color.white);
        
        this.rayTime -= Time.fixedDeltaTime;

        // Raycast only if time has passed
        if (this.rayTime < 0)
        {
            this.rayTime = 0.3;

            // Is the ray hitting a nearby wall?
            if (Physics.Raycast(ray, hit, rayDistance, this.layerMask))
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
        }
        else
        {
            // Otherwise walk in player direction
            walkDirection = this.direction;
        }

        // Save walkDirection for next frame
        this.direction = walkDirection;

        // Turn to walk direction
        let look = Quaternion.LookRotation(walkDirection, Vector3.up);
        this.rb.MoveRotation(Quaternion.Lerp(this.transform.rotation, look, Time.deltaTime * 5));
        
        // Walk forward
        this.speed = (RoundManager.swarmRound) ? 1.5 : 1.0;
        this.speed = (this.fastEnemy) ? 1.25 : 1.0;

        // Move faster every round
        this.speed *= (0.04 * RoundManager.round) + 0.92;

        walkDirection = Vector3.op_Multiply(walkDirection, Time.fixedDeltaTime * this.speed * this.walkSpeed);
        let finalPosition = Vector3.op_Addition(this.transform.position, walkDirection);

        this.rb.MovePosition(finalPosition);
    }

    // See if in range of any turret, then tell the turret if in range
    private CheckTurretRanges() : void 
    {
        for (let i = 0; i < this.turrets.length; i++)
        {
            //console.log(this.turrets[5].isActive);
            // Check if turret has been built
            if (!this.turrets[i].isActive)
                continue;

            //console.log("TURRET ACTIVE");
            if (Vector3.Distance(this.transform.position, this.turrets[i].transform.position) < 4)
            {
                // Enemy is within shooting range of turret
                this.turrets[i].RequestPotentialTarget(this.transform);
            }
        }
    }
}
