
import { Collider, LayerMask, MonoBehaviour, Physics, Quaternion, Time, Transform, Vector3 } from "UnityEngine";
export default class Turret extends MonoBehaviour {

    private target: Transform;
    @SerializeField private turretArm: Transform;
    @SerializeField private turretHead: Transform;

    private layerMask: int = 1 << LayerMask.NameToLayer("CustomLayer3"); 
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        this.FindTarget();
        this.AimAtTarget();
    }

    private AimAtTarget() : void 
    {
        if (this.target == null)
            return;

        // Aim the turret arm in the direction of target
        let targetDirection = Vector3.op_Subtraction(this.target.position, this.transform.position);

        let rot = Quaternion.LookRotation(targetDirection, Vector3.up);
        let euler = rot.eulerAngles;
        euler.x = -90.0;

        this.turretArm.rotation = Quaternion.Lerp(this.turretArm.rotation, Quaternion.Euler(euler), Time.deltaTime * 9);

        // Aim the head towards target
        let targetOffset = Vector3.op_Addition(this.target.position, Vector3.up * 0.1);
        let headDirection = Vector3.op_Subtraction(targetOffset, this.turretHead.position);

        let headRot = Quaternion.LookRotation(headDirection, Vector3.up);
        let headEuler = headRot.eulerAngles;
        headEuler.x -= 90.0;

        this.turretHead.rotation = Quaternion.Lerp(this.turretHead.rotation, Quaternion.Euler(headEuler), Time.deltaTime * 5); 
    }

    private FindTarget() : void
    {
        // Find enemies within reach
        let colliders = Physics.OverlapSphere(this.transform.position, 5, this.layerMask);

        console.log(colliders.length);

        if (colliders.length > 0)
        {
            //let tempTarget = colliders[0].transform;
            let closest = 100.0;

            for(let i = 0; i < colliders.length; i++)
            {
                let distance = Vector3.op_Subtraction(this.transform.position, colliders[i].transform.position).magnitude;

                if (distance < closest)
                {
                    this.target = colliders[i].transform;
                }
            }
        }
        else
        {
            // No target within reach
            this.target = null;
        }
    }
}
