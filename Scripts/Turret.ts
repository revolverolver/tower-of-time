
import { Animator, AudioClip, AudioSource, Collider, LayerMask, MonoBehaviour, Physics, Quaternion, Random, Time, Transform, Vector3, WaitForSeconds } from "UnityEngine";
import EnemyDamage from "./EnemyDamage";
import EnemyNavigation from "./EnemyNavigation";
import Building from "./Building";
import Upgrades from "./Upgrades";
export default class Turret extends MonoBehaviour {

    private target: Transform;
    @SerializeField private building: Building;
    @SerializeField private turretArm: Transform;
    @SerializeField private turretHead: Transform;
    @SerializeField private animator: Animator;
    @SerializeField private headAnimator: Animator;
    @SerializeField private source: AudioSource;
    @SerializeField private audioClips: AudioClip[];

    private layerMask: int = 1 << LayerMask.NameToLayer("CustomLayer3"); 

    private fireRate: float = 0.8;
    //private damage: int = 10;
    private shootSide: int = 0;

    private isActive: bool;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private OnEnable() : void 
    {
        //this.animator.Play("Popup");
        this.source.clip = this.audioClips[0];

        // Start shooting coroutine
        this.StartCoroutine(this.Shooting());
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (!this.isActive)
            return;

        this.FindTarget();
        this.AimAtTarget();
    }

    *Shooting()
    {
        // Wait for build animation to finish
        yield new WaitForSeconds(0.6);
        this.animator.enabled = false;
        this.isActive = true;
        this.source.clip = this.audioClips[1];

        while (true)
        {
            // Wait
            let rate = this.fireRate - (0.15 * this.building.level);
            if (rate < 0.1)
                rate = 0.1;

            yield new WaitForSeconds(rate);

            // Shoot if target is available
            if (this.target != null && EnemyNavigation.isWalking)
            {
                let enemy = this.target.GetComponent<EnemyDamage>();
                enemy.TakeDamage(Upgrades.turretDamage);

                // Play animation
                if (!this.headAnimator.isActiveAndEnabled)
                    this.headAnimator.enabled = true;

                let animationName = (this.shootSide == 0) ? "Shoot_Right" : "Shoot_Left";
                this.headAnimator.Play(animationName, -1, 0);

                // Change side
                this.shootSide = (this.shootSide == 0) ? 1 : 0;

                // Play sound
                this.source.pitch = Random.Range(0.5, 0.6);
                this.source.Play();
            }
        }
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
        let colliders = Physics.OverlapSphere(this.transform.position, 4, this.layerMask);

        if (colliders.length > 0)
        {
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

    public GameOver() : void
    {
        this.StopAllCoroutines();
    }
}
