
import { MonoBehaviour, Object, Collision, GameObject, Quaternion, Transform, Vector3 } from "UnityEngine";
import RoundManager from "./RoundManager";
import EnemySpawner from "./EnemySpawner";
import PlayerHealth from "./PlayerHealth";
import ParticlePool from "./ParticlePool";
import DamagePool from "./DamagePool";
export default class EnemyDamage extends MonoBehaviour {

    @SerializeField private particles: GameObject;
    public particlePool: ParticlePool;
    public damagePool: DamagePool;

    @SerializeField private type: int;
    public health: int;
    private originalHealth: int;
    
    //Called when script instance is loaded
    private Awake() : void
    {
        this.originalHealth = this.health;
    }

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
     // += RoundManager.round;
    }

    private OnEnable() : void
    {
        this.health = this.originalHealth + RoundManager.round * 2;
        if (this.type == 1) 
            this.health += RoundManager.round * 5;
        else if (RoundManager.round > 19 && this.type == 0)
            this.health += RoundManager.round;
        else if (RoundManager.round > 25 && this.type == 2)
            this.health += RoundManager.round;
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (EnemySpawner.killAll)
        {
            // Self destruct
            EnemySpawner.wormsAlive--;	
            //this.health = this.originalHealth + RoundManager.round;
            this.gameObject.SetActive(false);
        }
    }

    public TakeDamage(damage: int) : void
    {
        this.health -= damage;

        // Show damage number
        this.damagePool.ShowDamageText(this.transform.position, damage, this.type);

        if (this.health <= 0)
        {
            // Die
            // Spawn particles
            //let offset = Vector3.op_Addition(this.transform.position, new Vector3(0, 0.1, 0));
            //let rot = Quaternion.Euler(-90, 0, 0);
            //Object.Instantiate(this.particles, offset, rot);
            this.particlePool.SpawnParticles(this.type, this.transform.position);

            // Destroy
            //Object.Destroy(this.gameObject);
            EnemySpawner.wormsAlive--;	
            //this.health = this.originalHealth + RoundManager.round;
            this.gameObject.SetActive(false);
        }
    }

    private OnCollisionEnter(collision: Collision) 
    {
        if (collision.transform.tag == "Player")
        {
            let player = collision.gameObject.GetComponent<PlayerHealth>();
            player.ReceiveDamage(1);
        }
    }

    private OnDestroy() 
    {
        // Reduce count
        EnemySpawner.wormsAlive--;	
    }
}
