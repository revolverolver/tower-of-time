
import { MonoBehaviour, Quaternion, Vector2, Vector3, Transform, Time, Object, GameObject, Random, Collider } from "UnityEngine";
export default class WoodPiece extends MonoBehaviour {

    private target: Transform;
    private targetPosition: Vector3;

    private moveDirection: Vector3 = Vector3.op_Multiply(Vector3.up, 3);
    private finalVector: Vector3;
    private spinRot: Vector3;

    private t: float = 0.0;

    public carried: bool = false;
    private isBuilding: bool = false;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        // Find player
        this.target = GameObject.FindGameObjectWithTag("Player").transform;
        this.targetPosition = Vector3.op_Addition(this.target.position, Vector3.up);

        let direction = Vector3.op_Subtraction(this.transform.position, this.target.position);
        direction.y = 0;

        //this.moveDirection = Vector3.op_Addition(this.moveDirection, direction);

        // Random Spin
        this.spinRot = new Vector3(Random.Range(-40.0, 40.0), Random.Range(-10.0, 10.0), Random.Range(-70.0, 70.0));
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (!this.carried)
        {
            this.Move();
            this.SpinWood();
        }
    }

    public SendToBuilding(building: GameObject) : void
    {
        this.isBuilding = true;

        // Change tag to not get collected by player and activate collider
        this.gameObject.tag = "BuildingMaterial";
        this.GetComponent<Collider>().enabled = true;

        // Remove backpack as parent
        this.transform.SetParent(null);

        // Set building as target
        this.target = building.transform;
        this.targetPosition = this.target.position;

        // Set fly direction just like in Start()
        let direction = Vector3.op_Subtraction(this.transform.position, this.target.position);
        direction.y = 0;
        this.moveDirection = Vector3.op_Multiply(Vector3.up, 2); //Vector3.op_Addition(this.moveDirection, direction);

        // Random Spin
        this.spinRot = new Vector3(Random.Range(-40.0, 40.0), Random.Range(-10.0, 10.0), Random.Range(-70.0, 70.0));

        // Reset timer
        this.t = 0.0;

        // No longer carried
        this.carried = false;
    }

    private Move() : void 
    {
        // Update target's position in world
        if (!this.isBuilding)
            this.targetPosition = Vector3.op_Addition(this.target.position, Vector3.up);

        // Direction from wood to player
        let direction = Vector3.op_Subtraction(this.transform.position, this.targetPosition);

        // Lerps vector from Vector3.up to "direction"
        this.moveDirection = Vector3.Lerp(this.moveDirection, -direction, Time.deltaTime * 1);

        // Adjusts speed maybe?
        let tempVec = Vector3.op_Multiply(this.moveDirection, Time.deltaTime * 6);
        this.finalVector = Vector3.op_Addition(tempVec, this.transform.position);

        // Move Wood!
        this.transform.position = Vector3.Lerp(this.finalVector, this.targetPosition, this.t);

        // Increase Lerp t
        this.t += Time.deltaTime * 0.5;
    }

    private SpinWood() : void
    {
        this.transform.Rotate(Vector3.op_Multiply(this.spinRot, Time.deltaTime * 4));
    }
}
