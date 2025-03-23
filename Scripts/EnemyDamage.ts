
import { MonoBehaviour, Object, Collision } from "UnityEngine";
import RoundManager from "./RoundManager";
import EnemySpawner from "./EnemySpawner";
import PlayerHealth from "./PlayerHealth";
export default class EnemyDamage extends MonoBehaviour {

    private health: int = 2;
    
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
