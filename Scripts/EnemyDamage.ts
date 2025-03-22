
import { MonoBehaviour, Object } from "UnityEngine";
export default class EnemyDamage extends MonoBehaviour {

    private health: int = 5;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    public TakeDamage(damage: int) : void
    {
        this.health -= damage;

        if (this.health <= 0)
        {
            // Die
            Object.Destroy(this.gameObject);
        }
    }
}
