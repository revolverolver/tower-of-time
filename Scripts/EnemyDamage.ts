
import { MonoBehaviour, Object, Collision, GameObject, Quaternion, Transform, Vector3 } from "UnityEngine";
import RoundManager from "./RoundManager";
import EnemySpawner from "./EnemySpawner";
import PlayerHealth from "./PlayerHealth";
export default class EnemyDamage extends MonoBehaviour {

    @SerializeField private particles: GameObject;
    private health: int = 20;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        if (EnemySpawner.killAll)
        {
            // Self destruct
            Object.Destroy(this.gameObject);
        }
    }

    public TakeDamage(damage: int) : void
    {
        this.health -= damage;

        if (this.health <= 0)
        {
            // Die
            // Spawn particles
            let offset = Vector3.op_Addition(this.transform.position, new Vector3(0, 0.1, 0));
            let rot = Quaternion.Euler(-90, 0, 0);
            Object.Instantiate(this.particles, offset, rot);

            // Destroy
            Object.Destroy(this.gameObject);
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
}
